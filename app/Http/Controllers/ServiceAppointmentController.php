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
     * Show a specific ticket detail
     */
    public function show(ServiceAppointment $appointment)
    {
        // Safety: only owner or admin can see
        if ($appointment->user_id !== Auth::id() && !Auth::user()->isAdmin()) {
            abort(403);
        }

        return Inertia::render('Services/Show', [
            'appointment' => $appointment
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
        $serviceTime = $request->service_time;
        
        // 1. Double Booking Check for same plate on same day/branch
        $existing = ServiceAppointment::where('plate_number', $request->plate_number)
            ->where('service_date', $serviceDate)
            ->where('branch', $request->branch)
            ->whereNotIn('status', ['cancelled'])
            ->first();

        if ($existing) {
            return back()->with('error', "Plat Nomor {$request->plate_number} sudah memiliki antrian terjadwal pada tanggal " . Carbon::parse($serviceDate)->format('d/m/Y') . " di {$request->branch} (#{$existing->queue_number}).");
        }

        // 2. Queue Number Generation (Daily per branch for selected date)
        // Format: A-01, A-02...
        $dateCount = ServiceAppointment::where('service_date', $serviceDate)
            ->where('branch', $request->branch)
            ->count();
        
        $queueNumber = 'A-' . str_pad($dateCount + 1, 2, '0', STR_PAD_LEFT);

        // 3. Create Scheduled Digital Ticket
        $appointment = ServiceAppointment::create([
            'user_id' => Auth::id(),
            'branch' => $request->branch,
            'customer_name' => Auth::user()->name,
            'customer_phone' => Auth::user()->phone ?? '-',
            'plate_number' => strtoupper($request->plate_number),
            'queue_number' => $queueNumber,
            'motor_model' => $request->motor_model ?? 'Unit SRB/SSM',
            'service_date' => $serviceDate,
            'service_time' => $serviceTime,
            'service_type' => $request->service_type ?? 'Servis Berkala',
            'complaint_notes' => $request->complaint_notes,
            'status' => 'pending',
        ]);

        // 4. Notify Admin via WhatsApp
        $adminPhone = config('services.fonnte.admin_phone');
        if ($adminPhone) {
            $message = "*[ANTRIAN TERJADWAL] Bengkel {$appointment->branch}*\n\n" .
                "Nomor: *{$appointment->queue_number}*\n" .
                "Waktu: " . Carbon::parse($appointment->service_date)->format('d/m/y') . " @ {$appointment->service_time} WIB\n" .
                "Plat: {$appointment->plate_number}\n" .
                "User: {$appointment->customer_name}\n\n" .
                "Segera tinjau di dashboard admin.";
            WhatsAppService::sendMessage($adminPhone, $message);
        }

        // 5. Notify User via WhatsApp (Ticket Style)
        $userMsg = "Halo {$appointment->customer_name},\n\n" .
            "Ini adalah *TIKET ANTRIAN TERJADWAL* Anda untuk di *{$appointment->branch}*:\n\n" .
            "NO. ANTRIAN: *{$appointment->queue_number}*\n" .
            "JADWAL: " . Carbon::parse($appointment->service_date)->format('d M Y') . " Pukul *{$appointment->service_time}* WIB\n" .
            "PLAT NOMOR: *{$appointment->plate_number}*\n\n" .
            "Harap datang 10 menit lebih awal dari jadwal yang dipilih. Tunjukkan tiket ini kepada petugas bengkel. — Dealer SRB Motor (SSM Network)";
        WhatsAppService::sendMessage($appointment->customer_phone, $userMsg);

        return redirect()->route('services.index')->with('success', "Antrian Terjadwal {$queueNumber} untuk tanggal " . Carbon::parse($serviceDate)->format('d/m/Y') . " berhasil diterbitkan.");
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
