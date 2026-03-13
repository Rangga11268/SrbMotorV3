<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\MotorController;
use App\Http\Controllers\ContactMessageController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MotorGalleryController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminProfileController;
use App\Http\Controllers\Admin\TransactionController as AdminTransactionController;


Route::get('/', [HomeController::class, '__invoke'])->name('home');
Route::get('/about', [PageController::class, 'about'])->name('about');
Route::get('/motors/compare', [MotorGalleryController::class, 'compare'])->name('motors.compare');
Route::get('/motors', [MotorGalleryController::class, 'index'])->name('motors.index');
Route::get('/api/search/motors', [MotorGalleryController::class, 'search'])->name('api.motors.search');
Route::get('/motors/my-transactions', [MotorGalleryController::class, 'showUserTransactions'])->name('motors.user-transactions')->middleware('auth');
Route::get('/motors/{motor}', [MotorGalleryController::class, 'show'])->name('motors.show');
// Order routes - auth + email verification required (security fix: prevent unauthenticated access + applying rate limits)
Route::middleware(['auth', 'verified', 'throttle:15,1'])->group(function () {
    Route::get('/motors/{motor}/cash-order', [MotorGalleryController::class, 'showCashOrderForm'])->name('motors.cash-order');
    Route::post('/motors/{motor}/process-cash-order', [MotorGalleryController::class, 'processCashOrder'])->name('motors.process-cash-order');
    Route::get('/motors/{motor}/credit-order', [MotorGalleryController::class, 'showCreditOrderForm'])->name('motors.credit-order');
    Route::post('/motors/{motor}/process-credit-order', [MotorGalleryController::class, 'processCreditOrder'])->name('motors.process-credit-order');
});
Route::get('/motors/order-confirmation/{transaction}', [MotorGalleryController::class, 'showOrderConfirmation'])->name('motors.order.confirmation')->middleware(['auth', 'verified']);
Route::get('/motors/{transaction}/upload-credit-documents', [MotorGalleryController::class, 'showUploadCreditDocuments'])->name('motors.upload-credit-documents')->middleware(['auth', 'verified']);
Route::post('/motors/{transaction}/upload-credit-documents', [MotorGalleryController::class, 'uploadCreditDocuments'])->name('motors.upload-credit-documents.post')->middleware(['auth', 'verified']);
Route::get('/motors/{transaction}/manage-documents', [MotorGalleryController::class, 'showDocumentManagement'])->name('motors.manage-documents')->middleware(['auth', 'verified']);
Route::post('/motors/{transaction}/update-documents', [MotorGalleryController::class, 'updateDocuments'])->name('motors.update-documents')->middleware(['auth', 'verified']);
Route::post('/motors/{transaction}/cancel', [MotorGalleryController::class, 'cancelOrder'])->name('motors.cancel')->middleware(['auth', 'verified']);
Route::post('/documents/{document}/approve', [MotorGalleryController::class, 'approveDocument'])->name('documents.approve')->middleware(['auth', 'verified']);
Route::post('/documents/{document}/reject', [MotorGalleryController::class, 'rejectDocument'])->name('documents.reject')->middleware(['auth', 'verified']);
Route::get('/credit-details/{creditDetail}/schedule-survey', function ($creditDetailId) {
    return redirect()->back()->with('error', 'Akses tidak valid. Gunakan form di halaman transaksi.');
})->middleware(['auth', 'verified']);
Route::post('/credit-details/{creditDetail}/schedule-survey', [MotorGalleryController::class, 'scheduleSurvey'])->name('credit-details.schedule-survey')->middleware(['auth', 'verified']);
Route::post('/survey-schedules/{surveySchedule}/confirm-completion', [MotorGalleryController::class, 'confirmSurveyCompletion'])->name('survey-schedules.confirm-completion')->middleware(['auth', 'verified']);

// Customer transaction & survey routes
Route::get('/motors/transactions/{transaction}', [MotorGalleryController::class, 'showTransaction'])->name('motors.transaction.show')->middleware(['auth', 'verified']);
Route::get('/motors/transactions/{transaction}/installments', [MotorGalleryController::class, 'showInstallments'])->name('motors.installments')->middleware(['auth', 'verified']);
Route::get('/credit-status/{transaction}', [MotorGalleryController::class, 'showCreditStatus'])->name('credit-status.show')->middleware(['auth', 'verified']);
Route::post('/survey-schedules/{surveySchedule}/confirm-attendance', [MotorGalleryController::class, 'confirmSurveyAttendance'])->name('survey.confirm-attendance')->middleware(['auth', 'verified']);
Route::post('/survey-schedules/{surveySchedule}/request-reschedule', [MotorGalleryController::class, 'requestSurveyReschedule'])->name('survey.request-reschedule')->middleware(['auth', 'verified']);
Route::get('/api/survey-history/{creditDetail}', [MotorGalleryController::class, 'getSurveyHistory'])->name('api.survey-history')->middleware(['auth', 'verified']);

// Customer-facing news routes
Route::get('/berita', [App\Http\Controllers\NewsController::class, 'index'])->name('berita.index');
Route::get('/berita/{post:slug}', [App\Http\Controllers\NewsController::class, 'show'])->name('berita.show');
Route::get('/api/berita/search', [App\Http\Controllers\NewsController::class, 'search'])->name('api.berita.search');

Route::get('/contact', function () {
    return redirect('/#contact');
})->name('contact');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.submit');


Route::middleware(['guest', 'throttle:5,1'])->group(function () {
    Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'showRegistrationForm'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
});

// Email Verification Routes
Route::middleware('auth')->group(function () {
    Route::get('/email/verify', function () {
        return view('auth.verify-email');
    })->name('verification.notice');

    Route::get('/email/verify/{id}/{hash}', function (\Illuminate\Foundation\Auth\EmailVerificationRequest $request) {
        $request->fulfill();
        return redirect('/')->with('status', 'Email anda telah berhasil diverifikasi!');
    })->middleware(['signed', 'throttle:6,1'])->name('verification.verify');

    Route::post('/email/verification-notification', function (\Illuminate\Http\Request $request) {
        $request->user()->sendEmailVerificationNotification();
        return back()->with('status', 'Verifikasi email telah dikirim!');
    })->middleware(['throttle:6,1'])->name('verification.send');
});

// Google OAuth routes
Route::get('/auth/google', [\App\Http\Controllers\GoogleAuthController::class, 'redirect'])->name('auth.google');
Route::get('/auth/google/callback', [\App\Http\Controllers\GoogleAuthController::class, 'callback'])->name('google.callback');


Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password.update');
});



Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/installments', [\App\Http\Controllers\InstallmentController::class, 'index'])->name('installments.index');
    Route::post('/installments/pay-multiple', [\App\Http\Controllers\InstallmentController::class, 'payMultiple'])->name('installments.pay-multiple');
    Route::post('/installments/{installment}/pay', [\App\Http\Controllers\InstallmentController::class, 'store'])->name('installments.pay');
    Route::post('/installments/{installment}/pay-online', [\App\Http\Controllers\InstallmentController::class, 'createPayment'])->name('installments.create-payment');
    Route::post('/installments/{installment}/check-status', [\App\Http\Controllers\InstallmentController::class, 'checkPaymentStatus'])->name('installments.check-status');
    Route::get('/installments/{installment}/receipt', [\App\Http\Controllers\InstallmentController::class, 'downloadReceipt'])->name('installments.receipt');
});


Route::prefix('admin')->name('admin.')->middleware('admin')->group(function () {
    Route::get('/', [AdminController::class, 'index'])->name('dashboard');

    // Credit Management Routes (Refactored Credit Flow)
    Route::get('/credits', [App\Http\Controllers\Admin\CreditController::class, 'index'])->name('credits.index');
    Route::get('/credits/{credit}', [App\Http\Controllers\Admin\CreditController::class, 'show'])->name('credits.show');
    Route::post('/credits/{credit}/verify-documents', [App\Http\Controllers\Admin\CreditController::class, 'verifyDocuments'])->name('credits.verify-documents');
    Route::post('/credits/{credit}/reject-document', [App\Http\Controllers\Admin\CreditController::class, 'rejectDocument'])->name('credits.reject-document');
    Route::post('/credits/{credit}/send-to-leasing', [App\Http\Controllers\Admin\CreditController::class, 'sendToLeasing'])->name('credits.send-to-leasing');
    Route::post('/credits/{credit}/schedule-survey', [App\Http\Controllers\Admin\CreditController::class, 'scheduleSurvey'])->name('credits.schedule-survey');
    Route::post('/credits/{credit}/start-survey', [App\Http\Controllers\Admin\CreditController::class, 'startSurvey'])->name('credits.start-survey');
    Route::post('/credits/{credit}/complete-survey', [App\Http\Controllers\Admin\CreditController::class, 'completeSurvey'])->name('credits.complete-survey');
    Route::post('/credits/{credit}/approve', [App\Http\Controllers\Admin\CreditController::class, 'approveCredit'])->name('credits.approve');
    Route::post('/credits/{credit}/reject', [App\Http\Controllers\Admin\CreditController::class, 'rejectCredit'])->name('credits.reject');
    Route::post('/credits/{credit}/record-dp-payment', [App\Http\Controllers\Admin\CreditController::class, 'recordDPPayment'])->name('credits.record-dp-payment');
    Route::get('/credits/export', [App\Http\Controllers\Admin\CreditController::class, 'export'])->name('credits.export');

    Route::resource('motors', MotorController::class);


    Route::resource('contact', ContactMessageController::class)->only(['index', 'show', 'destroy']);


    Route::resource('users', UserController::class)->except(['create', 'store', 'show']);

    // Cash Transaction Management Routes (CASH ONLY - tunai)
    Route::resource('transactions', AdminTransactionController::class);
    Route::post('/transactions/{transaction}/status', [AdminTransactionController::class, 'updateStatus'])->name('transactions.updateStatus');
    Route::post('/transactions/{transaction}/allocate-unit', [AdminTransactionController::class, 'allocateUnit'])->name('transactions.allocate-unit');

    // Inventory Unit Management
    Route::post('/motor-units/batch', [\App\Http\Controllers\Admin\MotorUnitController::class, 'batchStore'])->name('motor-units.batch-store');
    Route::resource('motor-units', \App\Http\Controllers\Admin\MotorUnitController::class);



    Route::post('/installments/{installment}/approve', [\App\Http\Controllers\InstallmentController::class, 'approve'])->name('installments.approve');
    Route::post('/installments/{installment}/reject', [\App\Http\Controllers\InstallmentController::class, 'reject'])->name('installments.reject');


    Route::get('/transactions/{transaction}/invoice', [InvoiceController::class, 'preview'])->name('transactions.invoice.preview');
    Route::get('/transactions/{transaction}/invoice/download', [InvoiceController::class, 'generate'])->name('transactions.invoice.download');


    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/create', [ReportController::class, 'create'])->name('reports.create');
    Route::get('/reports/generate', [ReportController::class, 'generate'])->name('reports.generate');
    Route::get('/reports/export', [ReportController::class, 'export'])->name('reports.export');
    Route::get('/reports/export-excel', [ReportController::class, 'exportExcel'])->name('reports.export-excel');


    Route::resource('promotions', \App\Http\Controllers\Admin\PromotionController::class);
    Route::resource('leasing-providers', \App\Http\Controllers\Admin\LeasingProviderController::class);

    // Settings Management
    Route::get('/settings', [\App\Http\Controllers\Admin\SettingController::class, 'index'])->name('settings.index');
    Route::get('/settings/{category}/edit', [\App\Http\Controllers\Admin\SettingController::class, 'edit'])->name('settings.edit');
    Route::put('/settings/{category}', [\App\Http\Controllers\Admin\SettingController::class, 'update'])->name('settings.update');
    Route::post('/settings', [\App\Http\Controllers\Admin\SettingController::class, 'store'])->name('settings.store');
    Route::delete('/settings/{setting}', [\App\Http\Controllers\Admin\SettingController::class, 'destroy'])->name('settings.destroy');

    // Banner Management
    Route::resource('banners', \App\Http\Controllers\Admin\BannerController::class);

    // News & Categories Management
    Route::resource('news', \App\Http\Controllers\Admin\NewsController::class);
    Route::resource('categories', \App\Http\Controllers\Admin\CategoryController::class);

    // Credit Management
    Route::get('/credits', [\App\Http\Controllers\Admin\CreditController::class, 'index'])->name('credits.index');
    Route::get('/credits/{credit}', [\App\Http\Controllers\Admin\CreditController::class, 'show'])->name('credits.show');
    Route::post('/credits/{credit}/verify-documents', [\App\Http\Controllers\Admin\CreditController::class, 'verifyDocuments'])->name('credits.verify-documents');
    Route::post('/credits/{credit}/reject-document', [\App\Http\Controllers\Admin\CreditController::class, 'rejectDocument'])->name('credits.reject-document');
    Route::post('/credits/{credit}/send-to-leasing', [\App\Http\Controllers\Admin\CreditController::class, 'sendToLeasing'])->name('credits.send-to-leasing');
    Route::post('/credits/{credit}/schedule-survey', [\App\Http\Controllers\Admin\CreditController::class, 'scheduleSurvey'])->name('credits.schedule-survey');
    Route::post('/credits/{credit}/start-survey', [\App\Http\Controllers\Admin\CreditController::class, 'startSurvey'])->name('credits.start-survey');
    Route::post('/credits/{credit}/complete-survey', [\App\Http\Controllers\Admin\CreditController::class, 'completeSurvey'])->name('credits.complete-survey');
    Route::post('/credits/{credit}/approve', [\App\Http\Controllers\Admin\CreditController::class, 'approveCredit'])->name('credits.approve');
    Route::post('/credits/{credit}/reject', [\App\Http\Controllers\Admin\CreditController::class, 'rejectCredit'])->name('credits.reject');
    Route::post('/credits/{credit}/record-dp-payment', [\App\Http\Controllers\Admin\CreditController::class, 'recordDPPayment'])->name('credits.record-dp-payment');
    Route::post('/credits/{credit}/complete', [\App\Http\Controllers\Admin\CreditController::class, 'completeCredit'])->name('credits.complete');
    Route::get('/credits/export', [\App\Http\Controllers\Admin\CreditController::class, 'export'])->name('credits.export');
    Route::post('/documents/{document}/approve', [\App\Http\Controllers\Admin\CreditController::class, 'approveDocument'])->name('documents.approve');
    Route::post('/documents/{document}/reject', [\App\Http\Controllers\Admin\CreditController::class, 'rejectDocumentUpload'])->name('documents.reject');

    Route::get('/profile', [AdminProfileController::class, 'show'])->name('profile.show');
    Route::get('/profile/edit', [AdminProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile', [AdminProfileController::class, 'update'])->name('profile.update');
    Route::put('/profile/password', [AdminProfileController::class, 'updatePassword'])->name('profile.password.update');
});
