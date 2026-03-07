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
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|regex:/^[\+]?[0-9\s\-\(\)]+$/|max:20',
            'customer_occupation' => 'required|string|max:255',
            'notes' => 'nullable|string',
            'booking_fee' => 'nullable|numeric|min:0',
            'payment_method' => 'required|string',
        ]);


        if ($request->booking_fee && $request->booking_fee >= $motor->price) {
            return back()->withErrors(['booking_fee' => 'Booking fee tidak boleh melebihi atau sama dengan harga motor.'])->withInput();
        }


        $transaction = Transaction::create([
            'user_id' => Auth::id(),
            'motor_id' => $motor->id,
            'transaction_type' => 'CASH',
            'status' => 'new_order',
            'notes' => $request->notes ?? '',
            'booking_fee' => $request->booking_fee ?? 0,
            'total_amount' => $motor->price,
            'payment_method' => $request->payment_method,
            'payment_status' => 'pending',
            'customer_name' => $request->customer_name,
            'customer_phone' => $request->customer_phone,
            'customer_occupation' => $request->customer_occupation,
        ]);


        if ($transaction->booking_fee > 0) {
            \App\Models\Installment::create([
                'transaction_id' => $transaction->id,
                'installment_number' => 0,
                'amount' => $transaction->booking_fee,
                'due_date' => now()->addDays(1),
                'status' => 'pending',
            ]);
        }


        $remainingAmount = $motor->price - ($transaction->booking_fee ?? 0);

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

            if ($request->customer_phone) {
                $userMsg = "Halo {$request->customer_name},\n\nTerima kasih! Pesanan motor *{$motor->name}* Anda telah kami terima.\nOrder ID: #{$transaction->id}\n\nSilakan lanjutkan pembayaran Booking Fee agar kami dapat segera memproses pesanan Anda.\n\n- SRB Motor";
                \App\Services\WhatsAppService::sendMessage($request->customer_phone, $userMsg);
            }


            $adminPhone = config('services.fonnte.admin_phone');
            if ($adminPhone) {
                $adminMsg = "*[ADMIN] Order Tunai Baru*\n\nPelanggan: {$request->customer_name}\nUnit: {$motor->name}\nTelp: {$request->customer_phone}\n\nSegera cek dashboard admin.";
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
        return \Inertia\Inertia::render('Motors/CreditOrderForm', compact('motor'));
    }


    public function processCreditOrder(Request $request, Motor $motor): RedirectResponse
    {
        $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|regex:/^[\+]?[0-9\s\-\(\)]+$/|max:20',
            'customer_occupation' => 'required|string|max:255',
            'down_payment' => 'required|numeric|min:0',
            'tenor' => 'required|integer|min:1',

            'notes' => 'nullable|string',
            'payment_method' => 'required|string',
        ]);


        if ($request->down_payment >= $motor->price) {
            return back()->withErrors(['down_payment' => 'Uang muka tidak boleh melebihi atau sama dengan harga motor.'])->withInput();
        }


        $transaction = Transaction::create([
            'user_id' => Auth::id(),
            'motor_id' => $motor->id,
            'transaction_type' => 'CREDIT',
            'status' => 'menunggu_persetujuan',
            'notes' => $request->notes ?? '',
            'total_amount' => $motor->price,
            'payment_method' => $request->payment_method,
            'payment_status' => 'pending',
            'customer_name' => $request->customer_name,
            'customer_phone' => $request->customer_phone,
            'customer_occupation' => $request->customer_occupation,
        ]);


        $loanAmount = $motor->price - $request->down_payment;
        $monthlyInstallment = $loanAmount / $request->tenor;


        CreditDetail::create([
            'transaction_id' => $transaction->id,
            'down_payment' => $request->down_payment,
            'tenor' => $request->tenor,
            'monthly_installment' => $monthlyInstallment,
            'credit_status' => 'menunggu_persetujuan',
        ]);


        try {

            if ($request->customer_phone) {
                $userMsg = "Halo {$request->customer_name},\n\nPengajuan Kredit untuk motor *{$motor->name}* telah diterima.\nOrder ID: #{$transaction->id}\nTenor: {$request->tenor} Bulan\nCicilan: Rp " . number_format($monthlyInstallment, 0, ',', '.') . "\n\nMohon SEGERA UNGGAH DOKUMEN (KTP, KK, Slip Gaji) agar pengajuan dapat kami proses.\n\n- SRB Motor";
                \App\Services\WhatsAppService::sendMessage($request->customer_phone, $userMsg);
            }


            $adminPhone = config('services.fonnte.admin_phone');
            if ($adminPhone) {
                $adminMsg = "*[ADMIN] Pengajuan Kredit Baru*\n\nPelanggan: {$request->customer_name}\nUnit: {$motor->name}\nTenor: {$request->tenor} Bulan\n\nSegera cek dokumen di dashboard.";
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
        $transaction = Transaction::with(['motor', 'creditDetail', 'installments'])->findOrFail($transactionId);


        if ($transaction->user_id !== Auth::id() && !Auth::user()->isAdmin()) {
            abort(403, 'Unauthorized access to this transaction');
        }

        return \Inertia\Inertia::render('Motors/OrderConfirmation', compact('transaction'));
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
            $transaction->creditDetail->update(['credit_status' => 'menunggu_persetujuan']);
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
                $transaction->creditDetail->update(['credit_status' => 'menunggu_persetujuan']);
            }

            return redirect()->route('motors.order.confirmation', ['transaction' => $transaction->id])
                ->with('success', 'Dokumen berhasil diperbarui. Pengajuan kredit Anda sedang dalam proses review.');
        } else {
            return redirect()->route('motors.order.confirmation', ['transaction' => $transaction->id])
                ->with('info', 'Tidak ada dokumen baru yang diunggah.');
        }
    }


    public function showUserTransactions()
    {
        if (!Auth::check()) {
            abort(403, 'Anda harus login terlebih dahulu untuk mengakses halaman ini.');
        }

        $transactions = Transaction::with(['motor', 'creditDetail'])
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->paginate(9);

        return \Inertia\Inertia::render('Motors/UserTransactions', compact('transactions'));
    }

    public function search(Request $request): JsonResponse
    {
        $query = $request->get('q');
        
        if (empty($query)) {
            return response()->json([]);
        }

        $motors = Motor::where(function($q) use ($query) {
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
}
