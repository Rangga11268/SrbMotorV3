<?php

namespace Tests\Feature;

use App\Models\Motor;
use App\Models\Transaction;
use App\Models\User;
use App\Models\TransactionLog;
use App\Models\LeasingProvider;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TransactionLogTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $admin;
    protected $motor;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create(['role' => 'user']);
        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->motor = Motor::factory()->create([
            'price' => 20000000,
            'tersedia' => true,
            'min_dp_amount' => 2000000
        ]);
    }

    public function test_cash_order_creation_logs_correctly()
    {
        $response = $this->actingAs($this->user)
            ->post(route('motors.process-cash-order', $this->motor->id), [
                'name' => 'John Doe',
                'phone' => '08123456789',
                'nik' => '1234567890123456',
                'address' => 'Test Address',
                'motor_color' => 'Hitam',
                'delivery_method' => 'pickup',
                'payment_method' => 'transfer',
                'booking_fee' => 1000000,
            ]);

        $response->assertStatus(302);
        
        $transaction = Transaction::first();
        $this->assertNotNull($transaction);

        // Assert initial log exists
        $this->assertDatabaseHas('transaction_logs', [
            'transaction_id' => $transaction->id,
            'status_to' => 'new_order',
            'actor_id' => $this->user->id,
        ]);

        // Assert payment log exists
        $this->assertDatabaseHas('transaction_logs', [
            'transaction_id' => $transaction->id,
            'status_to' => 'waiting_payment',
            'actor_id' => $this->user->id,
        ]);
    }

    public function test_credit_order_creation_logs_correctly()
    {
        $provider = LeasingProvider::create(['name' => 'Test Leasing']);

        $response = $this->actingAs($this->user)
            ->post(route('motors.process-credit-order', $this->motor->id), [
                'name' => 'Jane Doe',
                'phone' => '08987654321',
                'occupation' => 'Employee',
                'nik' => '1234567890123456',
                'monthly_income' => 5000000,
                'employment_duration' => '1 Year',
                'address' => 'Test Credit Address',
                'dp_amount' => 3000000,
                'tenor' => 12,
                'motor_color' => 'Putih',
                'delivery_method' => 'delivery',
                'payment_method' => 'leasing',
                'leasing_provider_id' => $provider->id,
            ]);

        $response->assertStatus(302);

        $transaction = Transaction::first();
        
        // Assert transaction log exists
        $this->assertDatabaseHas('transaction_logs', [
            'transaction_id' => $transaction->id,
            'status_to' => 'menunggu_persetujuan',
            'actor_id' => $this->user->id,
            'actor_type' => User::class,
        ]);
    }

    public function test_admin_update_status_logs_correctly()
    {
        $transaction = Transaction::create([
            'user_id' => $this->user->id,
            'motor_id' => $this->motor->id,
            'reference_number' => 'TEST-001',
            'transaction_type' => 'CASH',
            'status' => 'new_order',
            'total_price' => 20000000,
            'final_price' => 20000000,
            'motor_price' => 20000000,
            'booking_fee' => 0,
            'payment_method' => 'transfer',
            'phone' => '08123',
            'name' => 'Tester',
        ]);

        $response = $this->actingAs($this->admin)
            ->post(route('admin.transactions.updateStatus', $transaction->id), [
                'status' => 'payment_confirmed',
            ]);

        $response->assertStatus(302);

        // Assert log shows transition
        $this->assertDatabaseHas('transaction_logs', [
            'transaction_id' => $transaction->id,
            'status_from' => 'new_order',
            'status_to' => 'payment_confirmed',
            'actor_id' => $this->admin->id,
            'actor_type' => User::class,
        ]);
    }
}
