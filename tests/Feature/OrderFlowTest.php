<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Motor;
use App\Models\Transaction;
use App\Models\CreditDetail;

class OrderFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_cash_order_flow()
    {
        // Create a user
        $user = User::factory()->create();
        
        // Create a motor
        $motor = Motor::factory()->create([
            'price' => 25000000, // 25 million
            'tersedia' => true,
        ]);
        
        // Test cash order creation
        $response = $this->actingAs($user)
            ->post(route('motors.process-cash-order', $motor->id), [
                'name' => 'Test User',
                'phone' => '08123456789',
                'occupation' => 'Employee',
                'nik' => '1234567890123456',
                'address' => 'Test Address',
                'motor_color' => 'Hitam',
                'delivery_method' => 'pickup',
                'notes' => 'Test cash order',
                'booking_fee' => 2000000, // 2 million
                'payment_method' => 'transfer',
            ]);
            
        // Check that the transaction was created
        if (session('errors')) {
            dump(session('errors')->getMessages());
        }
        $transaction = Transaction::where('user_id', $user->id)->first();
        // dump($transaction->toArray());

        $this->assertDatabaseHas('transactions', [
            'user_id' => $user->id,
            'motor_id' => $motor->id,
            'transaction_type' => 'CASH',
            'status' => 'new_order',
            'notes' => 'Test cash order',
            'total_price' => 25000000,
            'final_price' => 25000000,
            'payment_method' => 'transfer',
            'payment_status' => 'pending',
        ]);
        
        // Verify redirect to confirmation page
        $response->assertRedirect(route('motors.order.confirmation', ['transaction' => $transaction->id]));
    }
    
    public function test_credit_order_flow()
    {
        // Create a user
        $user = User::factory()->create();
        
        // Create a motor
        $motor = Motor::factory()->create([
            'price' => 50000000, // 50 million
            'tersedia' => true,
        ]);
        
        // Test credit order creation
        $response = $this->actingAs($user)
            ->post(route('motors.process-credit-order', $motor->id), [
                'name' => 'Test User',
                'phone' => '08123456789',
                'occupation' => 'Employee',
                'nik' => '1234567890123456',
                'monthly_income' => 5000000,
                'employment_duration' => '2 years',
                'address' => 'Test Address',
                'dp_amount' => 15000000, // 30% of 50m
                'tenor' => 36, // 36 months
                'notes' => 'Test credit order',
                'motor_color' => 'Merah',
                'delivery_method' => 'delivery',
                'payment_method' => 'leasing',
            ]);
            
        // Check that the transaction was created
        if (session('errors')) {
            dump(session('errors')->getMessages());
        }
        $transaction = Transaction::where('user_id', $user->id)->first();
        // dump($transaction->toArray());

        $this->assertDatabaseHas('transactions', [
            'user_id' => $user->id,
            'motor_id' => $motor->id,
            'transaction_type' => 'CREDIT',
            'status' => 'menunggu_persetujuan',
            'notes' => 'Test credit order',
            'final_price' => 50000000,
            'payment_method' => 'leasing',
            'payment_status' => 'pending',
        ]);
        
        // Check that the credit details were created
        $this->assertDatabaseHas('credit_details', [
            'transaction_id' => $transaction->id,
            'dp_amount' => 15000000,
            'tenor' => 36,
            'status' => 'pengajuan_masuk',
        ]);
        
        // Verify redirect to document upload page
        $transaction = Transaction::where('user_id', $user->id)->first();
        $response->assertRedirect(route('motors.upload-credit-documents', ['transaction' => $transaction->id]));
    }
}