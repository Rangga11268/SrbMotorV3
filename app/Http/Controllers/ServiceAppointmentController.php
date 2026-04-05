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
            'user' => Auth::user(),
            'branches' => Setting::get('service_branches', [
                "SSM JATIASIH (BEKASI)",
                "SSM MEKAR SARI (BEKASI)",
                "SSM DEPOK (DEPOK)",
                "SSM BOGOR (BOGOR)",
                "SSM TANGERANG (TANGERANG)"
            ]),
            'serviceHours' => Setting::get('service_business_hours', [
                'monday' => '08:00 - 16:00',
                'tuesday' => '08:00 - 16:00',
                'wednesday' => '08:00 - 16:00',
                'thursday' => '08:00 - 16:00',
                'friday' => '08:00 - 16:00',
                'saturday' => '08:00 - 14:00',
                'sunday' => 'Tutup',
            ])
        ]);
    }

    /**
     * Store a newly created appointment
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'branch' => 'required|string|max:100',
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'motor_model' => 'required|string|max:255',
            'service_date' => 'required|date|after_or_equal:today',
            'service_time' => 'required',
            'service_type' => 'required|in:Servis Berkala,Ganti Oli,Perbaikan Berat,Lainnya',
            'complaint_notes' => 'nullable|string|max:1000',
        ]);

        // 1. Quota Check Logic (Per Slot Per Cabang)
        $quotaPerSlot = (int) (Setting::where('key', 'service_slot_quota')->first()->value ?? 5);
        $currentBookingsCount = ServiceAppointment::where('service_date', $request->service_date)
            ->where('service_time', $request->service_time)
            ->where('branch', $request->branch)
            ->whereIn('status', ['pending', 'confirmed', 'in_progress'])
            ->count();

        if ($currentBookingsCount >= $quotaPerSlot && !Auth::user()->isAdmin()) {
            return back()->withErrors([
                'service_time' => "Mohon maaf, slot jam {$request->service_time} pada tanggal " . Carbon::parse($request->service_date)->format('d M Y') . " di {$request->branch} sudah penuh. Silakan pilih jam lain."
            ]);
        }

        $validated['user_id'] = Auth::id();
        $validated['status'] = 'pending';

        $appointment = ServiceAppointment::create($validated);

        // 2. Notify Admin via WhatsApp
        $adminPhone = config('services.fonnte.admin_phone');
        if ($adminPhone) {
            $message = "*[ADMIN] Booking Servis Baru*\n\n" .
                "Cabang: {$appointment->branch}\n" .
                "Pelanggan: {$appointment->customer_name}\n" .
                "Unit: {$appointment->motor_model}\n" .
                "Jadwal: " . Carbon::parse($appointment->service_date)->format('d M Y') . " {$appointment->service_time}\n" .
                "Kategori: {$appointment->service_type}\n" .
                "Keluhan: " . ($appointment->complaint_notes ?? '-') . "\n\n" .
                "Cek detail di dashboard.";
            WhatsAppService::sendMessage($adminPhone, $message);
        }

        // 3. Notify User via WhatsApp
        $userMsg = "Halo {$appointment->customer_name},\n\n" .
            "Terima kasih! Booking servis Anda (#{$appointment->id}) di cabang *{$appointment->branch}* untuk motor *{$appointment->motor_model}* telah kami terima.\n\n" .
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
            'admin_notes' => 'nullable|string|max:2000',
            'service_notes' => 'nullable|string|max:2000',
        ]);

        if ($validated['status'] === 'cancelled' && $service->status !== 'cancelled') {
            $validated['cancelled_by'] = 'admin';
            $validated['cancel_reason'] = $validated['admin_notes'] ?? 'Dibatalkan oleh admin';
        }

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
            
            if ($service->status === 'completed') {
                $msg .= "Status: *Selesai & Siap Diambil*\n";
            }
            
            if ($service->service_notes) {
                $msg .= "Catatan Layanan: *{$service->service_notes}*\n";
            }

            if ($service->admin_notes) {
                $msg .= "Pesan Admin: {$service->admin_notes}\n";
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

    /**
     * API: Get available time slots for a specific date and branch
     */
    public function getAvailableTimeSlots(Request $request)
    {
        $date = $request->query('date');
        $branch = $request->query('branch');

        if (!$date || !$branch) {
            return response()->json(['error' => 'Missing date or branch'], 400);
        }

        // Get quota setting
        $quotaPerSlot = (int) (Setting::where('key', 'service_slot_quota')->get()->first()->value ?? 5);
        
        // Parse business hours specifically for SERVICE
        $businessHoursRaw = Setting::where('key', 'service_business_hours')->get()->first()?->value;
        $standardSlots = ['08:00', '10:00', '12:00', '14:00']; // default fallback

        if ($businessHoursRaw) {
            $bh = is_string($businessHoursRaw) ? json_decode($businessHoursRaw, true) : $businessHoursRaw;
            $dayName = strtolower(Carbon::parse($date)->englishDayOfWeek);
            
            if (isset($bh[$dayName]) && str_contains($bh[$dayName], '-')) {
                list($start, $end) = array_map('trim', explode('-', $bh[$dayName]));
                $startHour = (int) substr($start, 0, 2);
                $endHour = (int) substr($end, 0, 2);
                
                $dynamicSlots = [];
                // Generate a slot every 2 hours
                for ($h = $startHour; $h <= $endHour - 1; $h += 2) {
                    $dynamicSlots[] = sprintf('%02d:00', $h);
                }
                if (count($dynamicSlots) > 0) {
                    $standardSlots = $dynamicSlots;
                }
            }
        }
        
        $bookings = ServiceAppointment::selectRaw('LEFT(service_time, 5) as time_slot, COUNT(*) as count')
            ->where('service_date', $date)
            ->where('branch', $branch)
            ->whereIn('status', ['pending', 'confirmed', 'in_progress'])
            ->groupBy('time_slot')
            ->pluck('count', 'time_slot');

        $availableSlots = [];
        foreach ($standardSlots as $slot) {
            $bookedCount = $bookings[$slot] ?? 0;
            $availableSlots[] = [
                'time' => $slot,
                'available' => $bookedCount < $quotaPerSlot,
                'remaining' => max(0, $quotaPerSlot - $bookedCount)
            ];
        }

        return response()->json(['slots' => $availableSlots]);
    }

    /**
     * User: Cancel appointment
     */
    public function cancelUser(Request $request, ServiceAppointment $appointment)
    {
        // Must belong to user
        if ($appointment->user_id !== Auth::id()) {
            abort(403, 'Akses ditolak.');
        }

        // Must be in pending or confirmed state
        if (!in_array($appointment->status, ['pending', 'confirmed'])) {
            return back()->with('error', 'Tidak dapat membatalkan servis yang sudah diproses atau selesai.');
        }

        // Must be at least H-1 or earlier (e.g. not same day cancellation depending on requirement).
        // Let's allow same day but before service_time, or simply allow if date >= today.
        $serviceDateTime = Carbon::parse($appointment->service_date . ' ' . $appointment->service_time);
        if ($serviceDateTime->isPast()) {
            return back()->with('error', 'Waktu servis sudah terlewat, tidak dapat dibatalkan.');
        }

        $appointment->update([
            'status' => 'cancelled',
            'cancelled_by' => 'user',
            'cancel_reason' => $request->input('reason', 'Dibatalkan langsung secara mandiri oleh pelanggan melalui sistem.'),
        ]);

        return back()->with('success', 'Reservasi servis berhasil dibatalkan.');
    }
}
