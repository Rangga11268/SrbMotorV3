<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MotorController;
use App\Http\Controllers\Api\OrderController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/motors', [MotorController::class, 'index']);
Route::get('/motors/{id}', [MotorController::class, 'show']);

Route::post('/midtrans/notification', [App\Http\Controllers\PaymentCallbackController::class, 'handle']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders/cash', [OrderController::class, 'storeCashOrder']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
});
