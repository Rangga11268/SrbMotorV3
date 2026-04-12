<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MotorController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\CategoryController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/login/google', [App\Http\Controllers\Api\GoogleAuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/motors', [MotorController::class, 'index']);
Route::get('/motors/brands', [MotorController::class, 'brands']);
Route::get('/motors/{id}', [MotorController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/orders/{id}/invoice', [OrderController::class, 'generateInvoice'])->name('api.orders.invoice');
Route::get('/settings/contact', function () {
    $keys = ['site_name', 'contact_phone', 'contact_email', 'contact_address', 'contact_city'];
    $settings = \App\Models\Setting::whereIn('key', $keys)->pluck('value', 'key');
    return response()->json($settings);
});

Route::post('/midtrans/notification', [App\Http\Controllers\PaymentCallbackController::class, 'handle'])->name('midtrans.notification');


// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders/cash', [OrderController::class, 'storeCashOrder']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::get('/orders/{id}/get-invoice-url', [OrderController::class, 'getInvoiceUrl']);
    Route::post('/orders/{order}/cancel', [OrderController::class, 'cancel']);
    
    // Installment routes for mobile
    Route::post('/installments/{installment}/pay-online', [\App\Http\Controllers\InstallmentController::class, 'createPayment']);
    Route::post('/installments/{installment}/check-status', [\App\Http\Controllers\InstallmentController::class, 'checkPaymentStatus']);
    
    // Notifications
    Route::get('/notifications', [App\Http\Controllers\Api\NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [App\Http\Controllers\Api\NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [App\Http\Controllers\Api\NotificationController::class, 'markAllAsRead']);
});
