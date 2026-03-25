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
Route::get('/motors/{id}', [MotorController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);

Route::post('/midtrans/notification', [App\Http\Controllers\PaymentCallbackController::class, 'handle']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders/cash', [OrderController::class, 'storeCashOrder']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::post('/orders/{order}/cancel', [OrderController::class, 'cancel']);
    
    // Installment routes for mobile
    Route::post('/installments/{installment}/pay-online', [\App\Http\Controllers\InstallmentController::class, 'createPayment']);
    Route::post('/installments/{installment}/check-status', [\App\Http\Controllers\InstallmentController::class, 'checkPaymentStatus']);
});
