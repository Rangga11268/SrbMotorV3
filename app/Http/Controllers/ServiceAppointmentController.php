<?php

namespace App\Http\Controllers;

use App\Models\ServiceAppointment;
use App\Models\Setting;
use App\Services\WhatsAppService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

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
            'current_km' => 'required|integer|min:0',
            'service_date' => 'required|date|after_or_equal:today',
            'service_time' => 'required',
            'service_type' => 'required|in:Servis Berkala,Ganti Oli,Perbaikan Berat,Lainnya',
            'complaint_notes' => 'nullable|string|max:1000',
        ]);

        // 1. Quota Check Logic
        $quota = (int) (Setting::where('key', 'service_daily_quota')->first()->value ?? 10);
        $currentBookingsCount = ServiceAppointment::where('service_date', $request->service_date)
            ->whereIn('status', ['pending', 'confirmed', 'in_progress'])
            ->count();

        if ($currentBookingsCount >= $quota && !Auth::user()->isAdmin()) {
            return back()->withErrors([
                'service_date' => "Mohon maaf, kuota servis untuk tanggal " . Carbon::parse($request->service_date)->format('d M Y') . " sudah penuh. Silakan pilih tanggal lain."
            ]);
        }

        $validated['user_id'] = Auth::id();
        $validated['status'] = 'pending';

        $appointment = ServiceAppointment::create($validated);

        // 2. Notify Admin via WhatsApp
        $adminPhone = config('services.fonnte.admin_phone');
        if ($adminPhone) {
            $message = "*[ADMIN] Booking Servis Baru*\n\n" .
                "Pelanggan: {$appointment->customer_name}\n" .
                "Unit: {$appointment->motor_brand} {$appointment->motor_type}\n" .
                "Plat: {$appointment->license_plate}\n" .
                "KM: {$appointment->current_km} km\n" .
                "Jadwal: " . Carbon::parse($appointment->service_date)->format('d M Y') . " {$appointment->service_time}\n" .
                "Keluhan: " . ($appointment->complaint_notes ?? '-') . "\n\n" .
                "Cek detail di dashboard.";
            WhatsAppService::sendMessage($adminPhone, $message);
        }

        // 3. Notify User via WhatsApp
        $userMsg = "Halo {$appointment->customer_name},\n\n" .
            "Terima kasih! Booking servis Anda (#{$appointment->id}) untuk motor *{$appointment->motor_brand} {$appointment->motor_type}* telah kami terima.\n\n" .
            "Jadwal: " . Carbon::parse($appointment->service_date)->format('d M Y') . " jam {$appointment->service_time}.\n\n" .
            "Silakan datang tepat waktu sesuai jadwal. Antrean Anda akan diverifikasi oleh tim kami. — SRB Motor (Powered by SSM)";
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
            'estimated_cost' => 'nullable|numeric|min:0',
        ]);

        $service->update($validated);

        // Notify user based on new status
        $statusLabels = [
            'confirmed' => 'Dikonfirmasi (Slot Tersedia)',
            'in_progress' => 'Sedang Dikerjakan oleh Mekanik',
            'completed' => 'Selesai & Motor Siap Diambil',
            'cancelled' => 'Dibatalkan'
        ];

        if (isset($statusLabels[$service->status])) {
            $msg = "Halo {$service->customer_name},\n\nStatus booking servis Anda (#{$service->id}) saat ini adalah: *" . $statusLabels[$service->status] . "*.\n\n";
            
            if ($service->status === 'completed' && $service->estimated_cost > 0) {
                $msg .= "Total Biaya Perbaikan: *Rp " . number_format($service->estimated_cost, 0, ',', '.') . "*\n";
            }
            
            if ($service->admin_notes) {
                $msg .= "Catatan: {$service->admin_notes}\n";
            }
            $msg .= "\nSilakan hubungi kami untuk informasi lebih lanjut. — Dealer SRB Motor SSM";
            WhatsAppService::sendMessage($service->customer_phone, $msg);
        }

        return back()->with('success', 'Status servis berhasil diperbarui.');
    }

    /**
     * Admin: Display a listing for Admin Panel
     */
    public function adminIndex(Request $request)
    {
        if (!Auth::user()->isAdmin()) {
            abort(403);
        }

        $appointments = ServiceAppointment::with('user')
            ->orderByRaw("CASE WHEN status = 'pending' THEN 0 WHEN status = 'confirmed' THEN 1 WHEN status = 'in_progress' THEN 2 ELSE 3 END")
            ->orderBy('service_date', 'asc')
            ->orderBy('service_time', 'asc')
            ->get();

        return Inertia::render('Admin/Services/Index', [
            'appointments' => $appointments
        ]);
    }

    /**
     * API: Get dates that are fully booked
     */
    public function getUnavailableDates()
    {
        $quota = (int) (Setting::where('key', 'service_daily_quota')->first()->value ?? 10);
        
        // Find dates from today onwards that have reached the quota
        $bookedDates = ServiceAppointment::select('service_date')
            ->where('service_date', '>=', Carbon::today())
            ->whereIn('status', ['pending', 'confirmed', 'in_progress'])
            ->groupBy('service_date')
            ->havingRaw('COUNT(*) >= ?', [$quota])
            ->pluck('service_date');

        return response()->json(['unavailable_dates' => $bookedDates]);
    }
}
