<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ServiceAppointment;
use App\Models\Setting;
use App\Services\WhatsAppService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class ServiceAppointmentController extends Controller
{
    /**
     * Display a listing of user appointments
     */
    public function index(Request $request)
    {
        $appointments = ServiceAppointment::where('user_id', $request->user()->id)
            ->with('user')
            ->latest()
            ->get();

        return response()->json($appointments);
    }

    /**
     * Display a specific appointment
     */
    public function show($id, Request $request)
    {
        $appointment = ServiceAppointment::with('user')->findOrFail($id);

        if ($appointment->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($appointment);
    }

    /**
     * Store a new service booking
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'branch' => 'required|string|max:100',
            'plate_number' => 'required|string|max:20',
            'service_date' => 'required|date|after_or_equal:today',
            'service_time' => 'required|string',
            'motor_model' => 'nullable|string|max:255',
            'service_type' => 'nullable|string|max:255',
            'complaint_notes' => 'nullable|string|max:1000',
        ]);

        $serviceDate = $request->service_date;
        
        // 1. Double Booking Check
        $existing = ServiceAppointment::where('plate_number', $request->plate_number)
            ->where('service_date', $serviceDate)
            ->where('branch', $request->branch)
            ->whereNotIn('status', ['cancelled'])
            ->first();

        if ($existing) {
            return response()->json([
                'message' => "Plat Nomor {$request->plate_number} sudah memiliki antrian terjadwal pada tanggal " . Carbon::parse($serviceDate)->format('d/m/Y') . " di {$request->branch}."
            ], 422);
        }

        // 2. Queue Number Generation
        $dateCount = ServiceAppointment::where('service_date', $serviceDate)
            ->where('branch', $request->branch)
            ->count();
        
        $queueNumber = 'A-' . str_pad($dateCount + 1, 2, '0', STR_PAD_LEFT);

        // 3. Create Appointment
        $appointment = ServiceAppointment::create([
            'user_id' => Auth::id(),
            'branch' => $request->branch,
            'customer_name' => Auth::user()->name,
            'customer_phone' => Auth::user()->phone ?? '-',
            'plate_number' => strtoupper($request->plate_number),
            'queue_number' => $queueNumber,
            'motor_model' => $request->motor_model ?? 'Unit SRB/SSM',
            'service_date' => $serviceDate,
            'service_time' => $request->service_time,
            'service_type' => $request->service_type ?? 'Servis Berkala',
            'complaint_notes' => $request->complaint_notes,
            'status' => 'confirmed',
        ]);

        // 4. WhatsApp Notifications
        $this->sendNotifications($appointment);

        return response()->json([
            'status' => 'success',
            'message' => 'Antrian Berhasil Dibuat',
            'appointment' => $appointment
        ], 201);
    }

    /**
     * Cancel appointment
     */
    public function cancel($id, Request $request)
    {
        $appointment = ServiceAppointment::findOrFail($id);

        if ($appointment->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (!in_array($appointment->status, ['pending', 'confirmed'])) {
            return response()->json(['message' => 'Tidak dapat membatalkan servis yang sudah diproses.'], 422);
        }

        $appointment->update([
            'status' => 'cancelled',
            'cancelled_by' => 'user',
            'cancel_reason' => $request->input('reason', 'Dibatalkan oleh pelanggan via Mobile App.'),
        ]);

        return response()->json(['message' => 'Reservasi berhasil dibatalkan']);
    }

    /**
     * Helper: Send WhatsApp Notifications
     */
    private function sendNotifications($appointment)
    {
        // To Admin
        $adminPhone = config('services.fonnte.admin_phone');
        if ($adminPhone) {
            $message = "*[ANTRIAN BARU - MOBILE]* Bengkel {$appointment->branch}\n\n" .
                "Nomor: *{$appointment->queue_number}*\n" .
                "Waktu: " . Carbon::parse($appointment->service_date)->format('d/m/y') . " @ {$appointment->service_time}\n" .
                "Plat: {$appointment->plate_number}\n" .
                "User: {$appointment->customer_name}";
            WhatsAppService::sendMessage($adminPhone, $message);
        }

        // To User
        $userMsg = "Halo {$appointment->customer_name},\n\n" .
            "Ini adalah *TIKET ANTRIAN* Anda untuk di *{$appointment->branch}*:\n\n" .
            "NO. ANTRIAN: *{$appointment->queue_number}*\n" .
            "JADWAL: " . Carbon::parse($appointment->service_date)->format('d M Y') . " Pukul *{$appointment->service_time}*\n" .
            "PLAT NOMOR: *{$appointment->plate_number}*\n\n" .
            "Harap datang 10 menit lebih awal. — Dealer SRB Motor";
        WhatsAppService::sendMessage($appointment->customer_phone, $userMsg);
    }
}
