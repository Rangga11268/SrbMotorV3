<?php

namespace App\Http\Controllers;

use App\Models\Motor;
use App\Models\Transaction;
use App\Models\CreditDetail;
use App\Models\Document;
use App\Repositories\MotorRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class MotorGalleryController extends Controller
{
    private MotorRepositoryInterface $motorRepository;

    public function __construct(MotorRepositoryInterface $motorRepository)
    {
        $this->motorRepository = $motorRepository;
    }


    public function compare(Request $request)
    {
        $ids = explode(',', $request->query('ids', ''));
        $ids = array_filter($ids, fn($id) => is_numeric($id));

        if (empty($ids)) {
            return redirect()->route('motors.index');
        }

        $motors = Motor::with(['promotions', 'financingSchemes.provider'])
            ->whereIn('id', $ids)
            ->get();

        return \Inertia\Inertia::render('Motors/Compare', [
            'motors' => $motors
        ]);
    }


    public function index(Request $request): \Inertia\Response|JsonResponse
    {

        $filters = [];
        if ($request->has('search') && !empty($request->search)) {
            $filters['search'] = $request->search;
        }
        if ($request->has('brand') && !empty($request->brand)) {
            $filters['brand'] = $request->brand;
        }
        if ($request->has('type') && !empty($request->type)) {
            $filters['type'] = $request->type;
        }
        if ($request->has('year') && !empty($request->year)) {
            $filters['year'] = $request->year;
        }
        if ($request->has('min_price') && !empty($request->min_price)) {
            $filters['min_price'] = $request->min_price;
        }
        if ($request->has('max_price') && !empty($request->max_price)) {
            $filters['max_price'] = $request->max_price;
        }


        $motors = $this->motorRepository->getWithFilters($filters, true, 12);


        $filterOptions = $this->motorRepository->getFilterOptions($request->get('search'));
        $brands = $filterOptions['brands'];
        $types = $filterOptions['types'];
        $years = $filterOptions['years'];

        if ($request->wantsJson() && !$request->header('X-Inertia')) {
            return response()->json([
                'motors' => $motors,
                'filters' => $request->only(['search', 'brand', 'type', 'year', 'min_price', 'max_price']),
                'brands' => $brands,
                'types' => $types,
                'years' => $years,
            ]);
        }

        return \Inertia\Inertia::render('Motors/Index', [
            'motors' => $motors,
            'filters' => $request->only(['search', 'brand', 'type', 'year', 'min_price', 'max_price']),
            'brands' => $brands,
            'types' => $types,
            'years' => $years,
        ]);
    }


    public function show(Motor $motor): \Inertia\Response
    {

        $motor = $this->motorRepository->findById($motor->id, true);


        $relatedMotors = Motor::where('brand', $motor->brand)
            ->where('id', '!=', $motor->id)
            ->with('promotions')
            ->limit(4)
            ->get();

        return \Inertia\Inertia::render('Motors/Show', [
            'motor' => $motor,
            'relatedMotors' => $relatedMotors
        ]);
    }


    public function showCreditCalculation(Motor $motor): View
    {
        return view('pages.motors.credit_calculation', compact('motor'));
    }


    public function showCashOrderForm(Motor $motor): View|\Inertia\Response
    {
        return \Inertia\Inertia::render('Motors/CashOrderForm', compact('motor'));
    }


    public function processCashOrder(Request $request, Motor $motor): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|regex:/^[\+]?[0-9\s\-\(\)]+$/|max:20',
            'email' => 'required|email|max:255',
            'nik' => 'required|string|max:20',
            'address' => 'required|string|max:1000',
            'motor_color' => 'required|string',
            'delivery_method' => 'required|string',
            'notes' => 'nullable|string',
            'booking_fee' => 'nullable|numeric|min:0',
            'payment_method' => 'required|string',
        ]);

        if ($request->booking_fee && $request->booking_fee >= $motor->price) {
            return back()->withErrors(['booking_fee' => 'Booking fee tidak boleh melebihi atau sama dengan harga motor.'])->withInput();
        }

        // Cek ketersediaan motor
        if (!$motor->tersedia) {
            return back()->withErrors(['motor' => 'Motor ini sedang tidak tersedia untuk dipesan.'])->withInput();
        }

        // Cek duplikasi order aktif
        $existingOrder = Transaction::where('user_id', Auth::id())
            ->where('motor_id', $motor->id)
            ->where('status', '!=', 'cancelled')
            ->exists();
        if ($existingOrder) {
            return back()->withErrors(['motor' => 'Anda sudah memiliki pesanan aktif untuk motor ini.'])->withInput();
        }

        $bookingFee = (float) ($request->booking_fee ?? 0);

        $transaction = Transaction::create([
            'user_id' => Auth::id(),
            'motor_id' => $motor->id,
            'reference_number' => 'TRX-' . strtoupper(uniqid()),
            'transaction_type' => 'CASH',
            'status' => 'new_order',
            'notes' => $request->notes ?? '',
            'motor_price' => $motor->price,
            'booking_fee' => $bookingFee,
            'total_price' => $motor->price,
            'discount_amount' => 0,
            'final_price' => $motor->price,
            'payment_method' => $request->payment_method,
            'payment_status' => 'pending',
            'phone' => $request->phone,
            'email' => $request->email,
            'address' => $request->address,
            'name' => $request->name,
            'nik' => $request->nik,
            'motor_color' => $request->motor_color,
            'delivery_method' => $request->delivery_method,
        ]);

        if ($bookingFee > 0) {
            \App\Models\Installment::create([
                'transaction_id' => $transaction->id,
                'installment_number' => 0,
                'amount' => $bookingFee,
                'due_date' => now()->addDays(1),
                'status' => 'pending',
            ]);
        }

        $remainingAmount = $motor->price - $bookingFee;

        if ($remainingAmount > 0) {
            \App\Models\Installment::create([
                'transaction_id' => $transaction->id,
                'installment_number' => 1,
                'amount' => $remainingAmount,
                'due_date' => now()->addDays(7),
                'status' => 'pending',
            ]);
        }



        try {

            if ($request->phone) {
                $userMsg = "Halo {$request->name},\n\nTerima kasih! Pesanan motor *{$motor->name}* Anda telah kami terima.\nOrder ID: #{$transaction->id}\n\nSilakan lanjutkan pembayaran Booking Fee agar kami dapat segera memproses pesanan Anda.\n\n- SRB Motor";
                \App\Services\WhatsAppService::sendMessage($request->phone, $userMsg);
            }


            $adminPhone = config('services.fonnte.admin_phone');
            if ($adminPhone) {
                $adminMsg = "*[ADMIN] Order Tunai Baru*\n\nPelanggan: {$request->name}\nUnit: {$motor->name}\nTelp: {$request->phone}\n\nSegera cek dashboard admin.";
                \App\Services\WhatsAppService::sendMessage($adminPhone, $adminMsg);
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('WA Notification Error: ' . $e->getMessage());
        }


        return redirect()->route('motors.order.confirmation', ['transaction' => $transaction->id])
            ->with('success', 'Pesanan tunai Anda telah dibuat. Silakan lanjutkan ke halaman konfirmasi.');
    }


    public function showCreditOrderForm(Motor $motor): View|\Inertia\Response
    {
        $leasingProviders = \App\Models\LeasingProvider::all(['id', 'name']);
        return \Inertia\Inertia::render('Motors/CreditOrderForm', compact('motor', 'leasingProviders'));
    }


    public function processCreditOrder(Request $request, Motor $motor): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|regex:/^[\+]?[0-9\s\-\(\)]+$/|max:20',
            'occupation' => 'required|string|max:255',
            'nik' => 'required|digits:16',
            'monthly_income' => 'required|numeric|min:0',
            'employment_duration' => 'required|string|max:255',
            'address' => 'required|string|max:1000',
            'dp_amount' => 'required|numeric|min:0',
            'tenor' => 'required|integer|min:1|max:60',
            'leasing_provider_id' => 'nullable|exists:leasing_providers,id',
            'notes' => 'nullable|string',
            'payment_method' => 'required|string',
        ]);

        // Validasi DP minimum 20% dari harga motor
        $minDownPayment = $motor->price * 0.20;
        if ($request->dp_amount < $minDownPayment) {
            return back()->withErrors(['dp_amount' => 'Uang muka minimum adalah 20% dari harga motor (Rp ' . number_format($minDownPayment, 0, ',', '.') . ').'])->withInput();
        }


        if ($request->dp_amount >= $motor->price) {
            return back()->withErrors(['dp_amount' => 'Uang muka tidak boleh melebihi atau sama dengan harga motor.'])->withInput();
        }


        // Cek ketersediaan motor
        if (!$motor->tersedia) {
            return back()->withErrors(['motor' => 'Motor ini sedang tidak tersedia untuk dipesan.'])->withInput();
        }

        // Cek duplikasi order aktif
        $existingOrder = Transaction::where('user_id', Auth::id())
            ->where('motor_id', $motor->id)
            ->where('status', '!=', 'cancelled')
            ->exists();
        if ($existingOrder) {
            return back()->withErrors(['motor' => 'Anda sudah memiliki pesanan aktif untuk motor ini.'])->withInput();
        }


        $transaction = Transaction::create([
            'user_id' => Auth::id(),
            'motor_id' => $motor->id,
            'reference_number' => 'TRX-' . strtoupper(uniqid()),
            'transaction_type' => 'CREDIT',
            'status' => 'menunggu_persetujuan',
            'notes' => $request->notes ?? '',
            'motor_price' => $motor->price,
            'total_price' => $motor->price,
            'discount_amount' => 0,
            'final_price' => $motor->price,
            'payment_method' => $request->payment_method,
            'payment_status' => 'pending',
            'phone' => $request->phone,
            'address' => $request->address,
            'name' => $request->name,
            'nik' => $request->nik,
            'occupation' => $request->occupation,
            'monthly_income' => $request->monthly_income,
            'employment_duration' => $request->employment_duration,
        ]);


        $loanAmount = $motor->price - $request->dp_amount;
        $interestRate = 0.015; // 1.5% bunga flat per bulan
        $totalInterest = $loanAmount * $interestRate * $request->tenor;
        $monthlyInstallment = ($loanAmount + $totalInterest) / $request->tenor;


        CreditDetail::create([
            'transaction_id' => $transaction->id,
            'dp_amount' => $request->dp_amount,
            'tenor' => $request->tenor,
            'monthly_installment' => $monthlyInstallment,
            'interest_rate' => $interestRate,
            'status' => 'pengajuan_masuk',
            'leasing_provider_id' => $request->leasing_provider_id,
            'reference_number' => 'REF-' . strtoupper(uniqid()),
        ]);

        // Create DP Installment (#0)
        \App\Models\Installment::create([
            'transaction_id' => $transaction->id,
            'installment_number' => 0,
            'amount' => $request->dp_amount,
            'due_date' => now()->addDays(1),
            'status' => 'pending',
        ]);


        try {

            if ($request->phone) {
                $userMsg = "Halo {$request->name},\n\nPengajuan Kredit untuk motor *{$motor->name}* telah diterima.\nOrder ID: #{$transaction->id}\nTenor: {$request->tenor} Bulan\nCicilan: Rp " . number_format($monthlyInstallment, 0, ',', '.') . "\n\nMohon SEGERA UNGGAH DOKUMEN (KTP, KK, Slip Gaji) agar pengajuan dapat kami proses.\n\n- SRB Motor";
                \App\Services\WhatsAppService::sendMessage($request->phone, $userMsg);
            }


            $adminPhone = config('services.fonnte.admin_phone');
            if ($adminPhone) {
                $adminMsg = "*[ADMIN] Pengajuan Kredit Baru*\n\nPelanggan: {$request->name}\nUnit: {$motor->name}\nTenor: {$request->tenor} Bulan\n\nSegera cek dokumen di dashboard.";
                \App\Services\WhatsAppService::sendMessage($adminPhone, $adminMsg);
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('WA Notification Error: ' . $e->getMessage());
        }


        return redirect()->route('motors.upload-credit-documents', ['transaction' => $transaction->id])
            ->with('success', 'Pengajuan kredit berhasil dibuat. Silakan lengkapi dokumen untuk melanjutkan proses.');
    }


    public function showOrderConfirmation($transactionId): \Inertia\Response
    {
        $transaction = Transaction::with(['motor', 'creditDetail.documents', 'creditDetail.leasingProvider', 'installments', 'user'])->findOrFail($transactionId);

        if ($transaction->user_id !== Auth::id() && !Auth::user()->isAdmin()) {
            abort(403, 'Unauthorized access to this transaction');
        }

        // Calculate if documents are complete
        $transaction->documents_complete = $transaction->transaction_type === 'CREDIT' && $transaction->creditDetail
            ? $transaction->creditDetail->hasRequiredDocuments()
            : true;

        $midtransClientKey = config('services.midtrans.client_key') ?? config('midtrans.client_key');
        return \Inertia\Inertia::render('Motors/OrderConfirmation', [
            'transaction' => $transaction,
            'midtransClientKey' => $midtransClientKey
        ]);
    }


    public function showUploadCreditDocuments($transactionId): View|\Inertia\Response
    {
        $transaction = Transaction::with(['motor', 'creditDetail'])->findOrFail($transactionId);


        if ($transaction->user_id !== Auth::id() || $transaction->transaction_type !== 'CREDIT') {
            abort(403, 'Unauthorized access to this transaction');
        }

        return \Inertia\Inertia::render('Motors/UploadCreditDocuments', compact('transaction'));
    }


    public function uploadCreditDocuments(Request $request, $transactionId)
    {
        $transaction = Transaction::with(['creditDetail'])->findOrFail($transactionId);


        if ($transaction->user_id !== Auth::id() || $transaction->transaction_type !== 'CREDIT') {
            abort(403, 'Unauthorized access to this transaction');
        }

        $request->validate([
            'documents.KTP' => 'required|array|min:1',
            'documents.KTP.*' => 'file|mimes:jpg,jpeg,png,pdf|max:2048',
            'documents.KK' => 'required|array|min:1',
            'documents.KK.*' => 'file|mimes:jpg,jpeg,png,pdf|max:2048',
            'documents.SLIP_GAJI' => 'required|array|min:1',
            'documents.SLIP_GAJI.*' => 'file|mimes:jpg,jpeg,png,pdf|max:2048',
            'documents.LAINNYA' => 'nullable|array',
            'documents.LAINNYA.*' => 'file|mimes:jpg,jpeg,png,pdf|max:2048',
        ], [
            'documents.KTP.required' => 'File KTP wajib diunggah',
            'documents.KTP.min' => 'Minimal 1 file KTP harus diunggah',
            'documents.KTP.*.file' => 'File KTP harus berupa file yang valid',
            'documents.KTP.*.mimes' => 'File KTP harus berupa file gambar (jpg, jpeg, png) atau PDF',
            'documents.KTP.*.max' => 'Ukuran file KTP tidak boleh lebih dari 2MB',
            'documents.KK.required' => 'File KK wajib diunggah',
            'documents.KK.min' => 'Minimal 1 file KK harus diunggah',
            'documents.KK.*.file' => 'File KK harus berupa file yang valid',
            'documents.KK.*.mimes' => 'File KK harus berupa file gambar (jpg, jpeg, png) atau PDF',
            'documents.KK.*.max' => 'Ukuran file KK tidak boleh lebih dari 2MB',
            'documents.SLIP_GAJI.required' => 'File slip gaji wajib diunggah',
            'documents.SLIP_GAJI.min' => 'Minimal 1 file slip gaji harus diunggah',
            'documents.SLIP_GAJI.*.file' => 'File slip gaji harus berupa file yang valid',
            'documents.SLIP_GAJI.*.mimes' => 'File slip gaji harus berupa file gambar (jpg, jpeg, png) atau PDF',
            'documents.SLIP_GAJI.*.max' => 'Ukuran file slip gaji tidak boleh lebih dari 2MB',
            'documents.LAINNYA.*.file' => 'File tambahan harus berupa file yang valid',
            'documents.LAINNYA.*.mimes' => 'File tambahan harus berupa file gambar (jpg, jpeg, png) atau PDF',
            'documents.LAINNYA.*.max' => 'Ukuran file tambahan tidak boleh lebih dari 2MB',
        ]);


        foreach ($request->file('documents', []) as $docType => $files) {
            if (is_array($files)) {
                foreach ($files as $file) {
                    if ($file) {

                        $path = $file->store('credit-documents/' . $transaction->id, 'public');


                        Document::create([
                            'credit_detail_id' => $transaction->creditDetail->id,
                            'document_type' => $docType,
                            'file_path' => $path,
                            'original_name' => $file->getClientOriginalName(),
                        ]);
                    }
                }
            }
        }


        $transaction->update(['status' => 'menunggu_persetujuan']);
        if ($transaction->creditDetail) {
            $transaction->creditDetail->update(['status' => 'menunggu_persetujuan']);
        }

        // Notifikasi WA ke admin bahwa dokumen telah diunggah
        try {
            $adminPhone = config('services.fonnte.admin_phone');
            if ($adminPhone) {
                $transaction->load('motor');
                $adminMsg = "*[ADMIN] Dokumen Kredit Diunggah*\n\nPelanggan: {$transaction->name}\nUnit: {$transaction->motor->name}\nOrder ID: #{$transaction->id}\n\nSilakan cek & verifikasi dokumen di dashboard admin.";
                \App\Services\WhatsAppService::sendMessage($adminPhone, $adminMsg);
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('WA Notification Error (upload docs): ' . $e->getMessage());
        }

        return redirect()->route('motors.order.confirmation', ['transaction' => $transaction->id])
            ->with('success', 'Dokumen berhasil diunggah. Pengajuan kredit Anda sedang dalam proses review.');
    }


    public function showDocumentManagement($transactionId): View|\Inertia\Response
    {
        $transaction = Transaction::with(['motor', 'creditDetail', 'creditDetail.documents'])->findOrFail($transactionId);


        if ($transaction->user_id !== Auth::id() || $transaction->transaction_type !== 'CREDIT') {
            abort(403, 'Unauthorized access to this transaction');
        }

        return \Inertia\Inertia::render('Motors/DocumentManagement', compact('transaction'));
    }


    public function updateDocuments(Request $request, $transactionId)
    {
        $transaction = Transaction::with(['creditDetail'])->findOrFail($transactionId);


        if ($transaction->user_id !== Auth::id() || $transaction->transaction_type !== 'CREDIT') {
            abort(403, 'Unauthorized access to this transaction');
        }


        if (!$transaction->creditDetail) {
            return redirect()->back()->withErrors(['error' => 'Transaksi tidak memiliki detail kredit yang valid.']);
        }

        $request->validate([
            'documents.KTP' => 'nullable|array',
            'documents.KTP.*' => 'file|mimes:jpg,jpeg,png,pdf|max:2048',
            'documents.KK' => 'nullable|array',
            'documents.KK.*' => 'file|mimes:jpg,jpeg,png,pdf|max:2048',
            'documents.SLIP_GAJI' => 'nullable|array',
            'documents.SLIP_GAJI.*' => 'file|mimes:jpg,jpeg,png,pdf|max:2048',
            'documents.LAINNYA' => 'nullable|array',
            'documents.LAINNYA.*' => 'file|mimes:jpg,jpeg,png,pdf|max:2048',
        ], [
            'documents.KTP.*.file' => 'File KTP harus berupa file yang valid',
            'documents.KTP.*.mimes' => 'File KTP harus berupa file gambar (jpg, jpeg, png) atau PDF',
            'documents.KTP.*.max' => 'Ukuran file KTP tidak boleh lebih dari 2MB',
            'documents.KK.*.file' => 'File KK harus berupa file yang valid',
            'documents.KK.*.mimes' => 'File KK harus berupa file gambar (jpg, jpeg, png) atau PDF',
            'documents.KK.*.max' => 'Ukuran file KK tidak boleh lebih dari 2MB',
            'documents.SLIP_GAJI.*.file' => 'File slip gaji harus berupa file yang valid',
            'documents.SLIP_GAJI.*.mimes' => 'File slip gaji harus berupa file gambar (jpg, jpeg, png) atau PDF',
            'documents.SLIP_GAJI.*.max' => 'Ukuran file slip gaji tidak boleh lebih dari 2MB',
            'documents.LAINNYA.*.file' => 'File tambahan harus berupa file yang valid',
            'documents.LAINNYA.*.mimes' => 'File tambahan harus berupa file gambar (jpg, jpeg, png) atau PDF',
            'documents.LAINNYA.*.max' => 'Ukuran file tambahan tidak boleh lebih dari 2MB',
        ]);

        $documentsProcessed = false;


        $documents = $request->file('documents');
        if ($documents) {
            foreach ($documents as $docType => $files) {
                if (is_array($files)) {
                    foreach ($files as $file) {
                        if ($file) {

                            $path = $file->store('credit-documents/' . $transaction->id, 'public');


                            Document::create([
                                'credit_detail_id' => $transaction->creditDetail->id,
                                'document_type' => $docType,
                                'file_path' => $path,
                                'original_name' => $file->getClientOriginalName(),
                            ]);

                            $documentsProcessed = true;
                        }
                    }
                }
            }
        }


        if ($documentsProcessed) {

            $transaction->update(['status' => 'menunggu_persetujuan']);
            if ($transaction->creditDetail) {
                $transaction->creditDetail->update(['status' => 'menunggu_persetujuan']);
            }

            return redirect()->route('motors.order.confirmation', ['transaction' => $transaction->id])
                ->with('success', 'Dokumen berhasil diperbarui. Pengajuan kredit Anda sedang dalam proses review.');
        } else {
            return redirect()->route('motors.order.confirmation', ['transaction' => $transaction->id])
                ->with('info', 'Tidak ada dokumen baru yang diunggah.');
        }
    }


    public function showUserTransactions(Request $request)
    {
        if (!Auth::check()) {
            abort(403, 'Anda harus login terlebih dahulu untuk mengakses halaman ini.');
        }

        $search = $request->query('search');
        $status = $request->query('status');

        $query = Transaction::with(['motor', 'creditDetail'])
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhereHas('motor', function ($mq) use ($search) {
                        $mq->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        $transactions = $query->paginate(9)->withQueryString();

        if ($request->wantsJson()) {
            return response()->json($transactions);
        }

        return \Inertia\Inertia::render('Motors/UserTransactions', [
            'transactions' => $transactions,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    public function search(Request $request): JsonResponse
    {
        $query = $request->get('q');

        if (empty($query)) {
            return response()->json([]);
        }

        $motors = Motor::where(function ($q) use ($query) {
            $q->where('name', 'LIKE', "%{$query}%")
                ->orWhere('brand', 'LIKE', "%{$query}%")
                ->orWhere('model', 'LIKE', "%{$query}%");
        })
            ->where('tersedia', true)
            ->with(['promotions'])
            ->limit(8)
            ->get();

        return response()->json($motors);
    }

    public function cancelOrder(Request $request, Transaction $transaction): \Illuminate\Http\RedirectResponse
    {
        // Authorize - user hanya bisa cancel order mereka sendiri
        if ($transaction->user_id !== Auth::id() && !Auth::user()->isAdmin()) {
            abort(403, 'Unauthorized access');
        }

        $request->validate([
            'cancellation_reason' => 'string|max:500|nullable',
        ]);

        $creditService = app(\App\Services\CreditService::class);
        $result = $creditService->cancelByCustomer($transaction, $request->cancellation_reason);

        if (!$result['success']) {
            return back()->with('error', $result['message']);
        }

        // Send WA notification
        try {
            $motor = $transaction->motor;
            $userMsg = "Pesanan motor *{$motor->name}* (Order ID: #{$transaction->id}) telah dibatalkan.\n\nTanggal pembatalan: " . now()->format('d-m-Y H:i') . "\n\nTerima kasih telah menggunakan layanan kami. — SRB Motor";
            \App\Services\WhatsAppService::sendMessage($transaction->phone, $userMsg);

            $adminPhone = config('services.fonnte.admin_phone');
            if ($adminPhone) {
                $statusLabel = $transaction->transaction_type === 'CASH' ? 'Tunai' : 'Kredit';
                $adminMsg = "*[ADMIN] Order {$statusLabel} Dibatalkan oleh Pelanggan*\n\nPelanggan: {$transaction->name}\nUnit: {$motor->name}\nAlasan: " . ($transaction->cancellation_reason ?? '-') . "\n\nSilakan cek dashboard.";
                \App\Services\WhatsAppService::sendMessage($adminPhone, $adminMsg);
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('WA Notification Error on cancellation: ' . $e->getMessage());
        }

        return back()->with('success', 'Pesanan telah dibatalkan.');
    }

    /**
     * Approve a document (admin only)
     */
    public function approveDocument(Document $document): RedirectResponse
    {
        // Only admin can approve documents
        if (!Auth::user()->isAdmin) {
            return back()->with('error', 'Unauthorized');
        }

        try {
            $document->approve();

            Log::info('Document approved', [
                'document_id' => $document->id,
                'admin_id' => Auth::id(),
            ]);

            // Check if all documents are now approved
            $creditDetail = $document->creditDetail;
            if ($creditDetail->documents()->where('approval_status', '!=', 'approved')->count() === 0) {
                // All documents approved - send notification
                $creditDetail->status = 'semua_dokumen_disetujui';
                $creditDetail->save();

                // Send WhatsApp notification to customer
                $user = $creditDetail->transaction->user;
                $whatsappService = app(\App\Services\WhatsAppService::class);
                $whatsappService->sendMessage(
                    $user->phone,
                    "Halo {$user->name},\n\nSemua dokumen Anda telah disetujui. Tim kami akan segera melanjutkan proses verifikasi kredit Anda.\n\nTerima kasih atas perhatian Anda.\n\n- SRB Motor"
                );
            }

            return back()->with('success', 'Dokumen telah disetujui.');
        } catch (\Exception $e) {
            Log::error('Error approving document', [
                'error' => $e->getMessage(),
                'document_id' => $document->id,
            ]);

            return back()->with('error', 'Terjadi kesalahan saat menyetujui dokumen.');
        }
    }

    /**
     * Reject a document (admin only)
     */
    public function rejectDocument(Request $request, Document $document): RedirectResponse
    {
        // Validate input
        $request->validate([
            'rejection_reason' => 'required|string|min:10|max:500',
        ]);

        // Only admin can reject documents
        if (!Auth::user()->isAdmin) {
            return back()->with('error', 'Unauthorized');
        }

        try {
            $reason = $request->input('rejection_reason');
            $document->reject($reason);

            // Update credit status to indicate rejection
            $creditDetail = $document->creditDetail;
            $creditDetail->status = 'dokumen_ditolak';
            $creditDetail->save();

            Log::info('Document rejected', [
                'document_id' => $document->id,
                'admin_id' => Auth::id(),
                'reason' => $reason,
            ]);

            // Send WhatsApp notification to customer
            $user = $creditDetail->transaction->user;
            $whatsappService = app(\App\Services\WhatsAppService::class);
            $whatsappService->sendMessage(
                $user->phone,
                "Halo {$user->name},\n\nSalah satu dokumen Anda telah disesuaikan dengan komentar berikut:\n\n{$reason}\n\nSilakan upload ulang dokumen yang telah disesuaikan.\n\n- SRB Motor"
            );

            return back()->with('success', 'Dokumen telah ditolak dan notifikasi telah dikirim ke customer.');
        } catch (\Exception $e) {
            Log::error('Error rejecting document', [
                'error' => $e->getMessage(),
                'document_id' => $document->id,
            ]);

            return back()->with('error', 'Terjadi kesalahan saat menolak dokumen.');
        }
    }

    /**
     * Schedule a survey for credit application
     */
    public function scheduleSurvey(Request $request, $creditDetailId)
    {
        // Validate input
        $request->validate([
            'scheduled_date' => 'required|date|after_or_equal:today',
            'scheduled_time' => 'required|date_format:H:i',
            'location' => 'required|string|min:5|max:255',
            'surveyor_name' => 'required|string|min:3|max:100',
            'surveyor_phone' => 'required|string|min:10|max:20',
            'notes' => 'nullable|string|max:500',
        ]);

        // Only admin can schedule surveys
        if (!Auth::user()->isAdmin) {
            return back()->with('error', 'Unauthorized');
        }

        try {
            $creditDetail = CreditDetail::findOrFail($creditDetailId);

            // Create survey schedule
            $schedule = $creditDetail->surveySchedules()->create([
                'scheduled_date' => $request->scheduled_date,
                'scheduled_time' => $request->scheduled_time,
                'location' => $request->location,
                'surveyor_name' => $request->surveyor_name,
                'surveyor_phone' => $request->surveyor_phone,
                'notes' => $request->notes,
                'status' => 'pending',
            ]);

            // Update credit status
            $creditDetail->status = 'jadwal_survey';
            $creditDetail->save();

            Log::info('Survey scheduled', [
                'survey_schedule_id' => $schedule->id,
                'credit_detail_id' => $creditDetailId,
                'scheduled_date' => $request->scheduled_date,
            ]);

            // Send WhatsApp notification to customer
            $user = $creditDetail->transaction->user;
            $whatsappService = app(\App\Services\WhatsAppService::class);
            $whatsappService->sendMessage(
                $user->phone,
                "Halo {$user->name},\n\n✓ Jadwal survey kredit Anda telah dijadwalkan:\n\n📅 Tanggal: {$request->scheduled_date}\n⏰ Waktu: {$request->scheduled_time}\n📍 Lokasi: {$request->location}\n👤 Surveyor: {$request->surveyor_name}\n📞 Telepon: {$request->surveyor_phone}\n\nMohon memastikan Anda ada di lokasi pada waktu yang telah ditentukan.\n\n- SRB Motor"
            );

            return back()->with('success', 'Jadwal survey telah dibuat dan notifikasi telah dikirim ke customer.');
        } catch (\Exception $e) {
            Log::error('Error scheduling survey', [
                'error' => $e->getMessage(),
                'credit_detail_id' => $creditDetailId,
            ]);

            return back()->with('error', 'Terjadi kesalahan saat menjadwalkan survey.');
        }
    }

    /**
     * Confirm survey completion
     */
    public function confirmSurveyCompletion($surveyScheduleId)
    {
        // Only admin can confirm survey completion
        if (!Auth::user()->isAdmin) {
            return back()->with('error', 'Unauthorized');
        }

        try {
            $schedule = \App\Models\SurveySchedule::findOrFail($surveyScheduleId);
            $schedule->complete();

            Log::info('Survey completed', [
                'survey_schedule_id' => $surveyScheduleId,
            ]);

            // Send notification to customer
            $user = $schedule->creditDetail->transaction->user;
            $whatsappService = app(\App\Services\WhatsAppService::class);
            $whatsappService->sendMessage(
                $user->phone,
                "Halo {$user->name},\n\n✓ Survey kredit Anda telah selesai dilakukan.\n\nTim kami akan segera memproses hasil survey dan memberikan keputusan persetujuan kredit Anda.\n\nTerima kasih atas waktu dan kerjasama Anda.\n\n- SRB Motor"
            );

            return back()->with('success', 'Survey telah ditandai sebagai selesai.');
        } catch (\Exception $e) {
            Log::error('Error confirming survey completion', [
                'error' => $e->getMessage(),
                'survey_schedule_id' => $surveyScheduleId,
            ]);

            return back()->with('error', 'Terjadi kesalahan saat mengkonfirmasi survey.');
        }
    }

    /**
     * Show single transaction detail page for customer.
     * GET /motors/transactions/{transaction}
     */
    public function showTransaction(Transaction $transaction)
    {
        // Authorize - user can only view their own transactions
        if ($transaction->user_id !== Auth::id() && !Auth::user()->isAdmin()) {
            abort(403, 'Unauthorized access');
        }

        // Load all relationships
        $transaction->load([
            'motor',
            'creditDetail.documents',
            'creditDetail.surveySchedules',
            'creditDetail.leasingProvider',
            'installments',
        ]);

        // Prepare explicit response data
        $transactionData = $transaction->toArray();

        // Ensure creditDetail is in the response
        if ($transaction->creditDetail) {
            $transactionData['creditDetail'] = $transaction->creditDetail->toArray();
            $transactionData['creditDetail']['documents'] = $transaction->creditDetail->documents->toArray();
            $transactionData['creditDetail']['surveySchedules'] = $transaction->creditDetail->surveySchedules->toArray();
            $transactionData['creditDetail']['leasingProvider'] = $transaction->creditDetail->leasingProvider?->toArray();
        }

        return \Inertia\Inertia::render('Motors/TransactionDetail', [
            'transaction' => $transactionData,
        ]);
    }

    /**
     * Show installments/cicilan page for a transaction
     */
    public function showInstallments(Transaction $transaction)
    {
        // Authorize - user can only view their own transactions
        if ($transaction->user_id !== Auth::id() && !Auth::user()->isAdmin()) {
            abort(403, 'Unauthorized access');
        }

        // Load relationships
        $transaction->load(['motor', 'installments']);

        return \Inertia\Inertia::render('Motors/Installments', [
            'transaction' => $transaction,
        ]);
    }

    /**
     * Show credit application status page for customer
     */
    public function showCreditStatus(Transaction $transaction)
    {
        // Authorize - user can only view their own transactions
        if ($transaction->user_id !== Auth::id() && !Auth::user()->isAdmin()) {
            abort(403, 'Unauthorized access');
        }

        // Only for credit transactions
        if ($transaction->transaction_type !== 'CREDIT' || !$transaction->creditDetail) {
            abort(404, 'Credit application not found');
        }

        $transaction->load(['motor', 'creditDetail']);

        return \Inertia\Inertia::render('CreditStatus', [
            'transaction' => $transaction,
            'credit' => $transaction->creditDetail,
        ]);
    }

    /**
     * Confirm survey attendance by customer.
     * POST /survey-schedules/{surveySchedule}/confirm-attendance
     */
    public function confirmSurveyAttendance(Request $request, \App\Models\SurveySchedule $surveySchedule)
    {
        // Authorize - customer owns this survey
        $transaction = $surveySchedule->creditDetail->transaction;
        if ($transaction->user_id !== Auth::id()) {
            abort(403, 'Unauthorized access');
        }

        $validated = $request->validate([
            'notes' => 'nullable|string|max:500',
        ]);

        try {
            // Update survey status to confirmed
            $surveySchedule->update([
                'status' => 'confirmed',
                'customer_confirmed_at' => now(),
                'customer_notes' => $validated['notes'] ?? null,
            ]);

            // Send WhatsApp notification to surveyor
            $surveyor_msg = "Pelanggan *{$transaction->user->name}* telah mengkonfirmasi kehadiran survei pada *" .
                $surveySchedule->scheduled_date->format('d-m-Y H:i') . "* di " .
                $surveySchedule->location . ".\n\nKontak: {$transaction->user->phone}";

            \App\Services\WhatsAppService::sendMessage($surveySchedule->surveyor_phone, $surveyor_msg);

            return back()->with('success', 'Kehadiran survei telah dikonfirmasi. Surveyor akan segera menghubungi Anda.');
        } catch (\Exception $e) {
            Log::error('Survey confirmation error', [
                'error' => $e->getMessage(),
                'survey_schedule_id' => $surveySchedule->id,
            ]);

            return back()->withErrors(['survey' => 'Terjadi kesalahan saat mengkonfirmasi kehadiran.']);
        }
    }

    /**
     * Request survey reschedule by customer.
     * POST /survey-schedules/{surveySchedule}/request-reschedule
     */
    public function requestSurveyReschedule(Request $request, \App\Models\SurveySchedule $surveySchedule)
    {
        // Authorize - customer owns this survey
        $transaction = $surveySchedule->creditDetail->transaction;
        if ($transaction->user_id !== Auth::id()) {
            abort(403, 'Unauthorized access');
        }

        // Can only reschedule pending/confirmed surveys (not completed/cancelled)
        if (!in_array($surveySchedule->status, ['pending', 'confirmed'])) {
            return back()->withErrors(['survey' => 'Survei ini tidak dapat dijadwal ulang.']);
        }

        $validated = $request->validate([
            'requested_date' => 'required|date|after:today',
            'requested_time' => 'required|date_format:H:i',
            'reason' => 'required|string|max:255',
            'reason_notes' => 'nullable|string|max:500',
        ]);

        try {
            // Update survey schedule directly with new date/time
            $surveySchedule->update([
                'scheduled_date' => $validated['requested_date'],
                'scheduled_time' => $validated['requested_time'],
                'customer_notes' => $validated['reason'] . ($validated['reason_notes'] ? ' - ' . $validated['reason_notes'] : ''),
                'status' => 'pending', // Reset to pending for admin re-confirmation
            ]);

            // Notify surveyor and admin
            $datetime_str = $validated['requested_date'] . ' ' . $validated['requested_time'];
            $surveyor_msg = "Pelanggan *{$transaction->user->name}* telah mengajukan jadwal survei baru.\n\n" .
                "Motor: {$transaction->motor->name}\n" .
                "Tanggal jadwal baru: {$datetime_str}\n" .
                "Alasan: {$validated['reason']}\n\n" .
                "Mohon konfirmasi penjadwalan baru.\n" .
                "Kontak: {$transaction->user->phone}";

            \App\Services\WhatsAppService::sendMessage($surveySchedule->surveyor_phone, $surveyor_msg);

            return back()->with('success', 'Jadwal survei telah diperbarui. Admin akan mengkonfirmasi jadwal baru Anda.');
        } catch (\Exception $e) {
            Log::error('Survey reschedule error', [
                'error' => $e->getMessage(),
                'survey_schedule_id' => $surveySchedule->id,
            ]);

            return back()->withErrors(['survey' => 'Terjadi kesalahan saat memperbarui jadwal survei.']);
        }
    }

    /**
     * Get survey schedule history for a credit detail.
     * GET /api/survey-history/{creditDetail}
     */
    public function getSurveyHistory(\App\Models\CreditDetail $creditDetail)
    {
        $transaction = $creditDetail->transaction;
        if ($transaction->user_id !== Auth::id() && !Auth::user()->isAdmin()) {
            abort(403, 'Unauthorized access');
        }

        $surveys = $creditDetail->surveySchedules()
            ->with('rescheduleRequests')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $surveys,
        ]);
    }
}
