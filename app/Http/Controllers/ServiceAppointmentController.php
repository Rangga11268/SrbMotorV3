<?php

namespace App\Http\Controllers;

use App\Models\ServiceAppointment;
use App\Services\WhatsAppService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ServiceAppointmentController extends Controller
{
    /**
     * Display a listing of appointments
     */
    public function index(Request $request)
    {
        $query = ServiceAppointment::with('user');

        // If not admin, only show own appointments
        if (!Auth::user()->isAdmin()) {
            $query->where('user_id', Auth::id());
        }

        $appointments = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Services/History', [
            'appointments' => $appointments
        ]);
    }

    /**
     * Show the booking form
     */
    public function create()
    {
        return Inertia::render('Services/Booking', [
            'user' => Auth::user()
        ]);
    }

    /**
     * Store a newly created appointment
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'motor_brand' => 'required|string|max:100',
            'motor_type' => 'required|string|max:100',
            'license_plate' => 'required|string|max:20',
            'service_date' => 'required|date|after_or_equal:today',
            'service_time' => 'required',
            'service_type' => 'required|in:Servis Berkala,Ganti Oli,Perbaikan Berat,Lainnya',
            'complaint_notes' => 'nullable|string|max:1000',
        ]);

        $validated['user_id'] = Auth::id();
        $validated['status'] = 'pending';

        $appointment = ServiceAppointment::create($validated);

        // Notify Admin via WhatsApp
        $adminPhone = config('services.fonnte.admin_phone');
        if ($adminPhone) {
            $message = "*[ADMIN] Booking Servis Baru*\n\n" .
                "Pelanggan: {$appointment->customer_name}\n" .
                "Unit: {$appointment->motor_brand} {$appointment->motor_type}\n" .
                "Plat: {$appointment->license_plate}\n" .
                "Jadwal: " . date('d M Y', strtotime($appointment->service_date)) . " {$appointment->service_time}\n" .
                "Keluhan: " . ($appointment->complaint_notes ?? '-') . "\n\n" .
                "Cek detail di dashboard.";
            WhatsAppService::sendMessage($adminPhone, $message);
        }

        // Notify User via WhatsApp
        $userMsg = "Halo {$appointment->customer_name},\n\n" .
            "Terima kasih! Booking servis Anda untuk motor *{$appointment->motor_brand} {$appointment->motor_type}* telah kami terima.\n\n" .
            "Jadwal: " . date('d M Y', strtotime($appointment->service_date)) . " jam {$appointment->service_time}.\n\n" .
            "Silakan datang tepat waktu. Tim kami akan segera mengkonfirmasi pesanan Anda. — SRB Motor";
        WhatsAppService::sendMessage($appointment->customer_phone, $userMsg);

        return redirect()->route('services.index')->with('success', 'Booking servis berhasil dibuat.');
    }

    /**
     * Admin: Update appointment status
     */
    public function updateStatus(Request $request, ServiceAppointment $service)
    {
        if (!Auth::user()->isAdmin()) {
            abort(403);
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,in_progress,completed,cancelled',
            'admin_notes' => 'nullable|string|max:500',
        ]);

        $service->update($validated);

        // Optional: Notify user on status change
        $statusLabels = [
            'confirmed' => 'Dikonfirmasi',
            'in_progress' => 'Sedang Dikerjakan',
            'completed' => 'Selesai',
            'cancelled' => 'Dibatalkan'
        ];

        if (isset($statusLabels[$service->status])) {
            $msg = "Halo {$service->customer_name},\n\nStatus booking servis Anda (#{$service->id}) saat ini adalah: *" . $statusLabels[$service->status] . "*.\n\n";
            if ($service->admin_notes) {
                $msg .= "Catatan: {$service->admin_notes}\n";
            }
            $msg .= "\n— SRB Motor";
            WhatsAppService::sendMessage($service->customer_phone, $msg);
        }

        return back()->with('success', 'Status servis berhasil diperbarui.');
    }
}
