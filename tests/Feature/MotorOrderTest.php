<?php

namespace Tests\Feature;

use App\Models\Motor;
use App\Models\User;
use App\Models\Transaction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class MotorOrderTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test cash order form can be rendered.
     */
    public function test_cash_order_form_can_be_rendered()
    {
        $user = User::factory()->create();
        $motor = Motor::factory()->create(['tersedia' => true]);

        $response = $this->actingAs($user)->get(route('motors.cash-order', $motor));

        $response->assertStatus(200);
    }

    /**
     * Test cash order validation errors.
     */
    public function test_cash_order_validation_errors()
    {
        $user = User::factory()->create();
        $motor = Motor::factory()->create(['tersedia' => true]);

        $response = $this->actingAs($user)->from(route('motors.cash-order', $motor))
            ->post(route('motors.process-cash-order', $motor), [
                'name' => '',
                'phone' => '',
                'occupation' => '',
                'address' => '',
                'payment_method' => '',
            ]);

        $response->assertRedirect(route('motors.cash-order', $motor));
        $response->assertSessionHasErrors(['name', 'phone', 'address', 'payment_method', 'nik', 'motor_color', 'delivery_method']);
    }

    /**
     * Test user can submit cash order.
     */
    public function test_user_can_submit_cash_order()
    {
        $this->withoutExceptionHandling();
        $user = User::factory()->create();
        $motor = Motor::factory()->create(['price' => 15000000, 'tersedia' => true]);

        $response = $this->actingAs($user)->post(route('motors.process-cash-order', $motor), [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '081234567890',
            'occupation' => 'Employee',
            'nik' => '1234567890123456',
            'address' => 'Test Address',
            'notes' => 'Test order',
            'payment_method' => 'transfer',
            'motor_color' => 'Hitam',
            'delivery_method' => 'pickup',
        ]);

        if (session('errors')) {
            dump(session('errors')->getMessages());
        }

        $transaction = Transaction::where('user_id', $user->id)->where('motor_id', $motor->id)->first();
        $this->assertNotNull($transaction, 'Transaction was not created');

        $response->assertRedirect(route('motors.order.confirmation', ['transaction' => $transaction->id]));
        $this->assertDatabaseHas('transactions', [
            'user_id' => $user->id,
            'motor_id' => $motor->id,
            'transaction_type' => 'CASH',
            'final_price' => 15000000,
            'phone' => '081234567890',
        ]);
    }

    /**
     * Test credit order form can be rendered.
     */
    public function test_credit_order_form_can_be_rendered()
    {
        $user = User::factory()->create();
        $motor = Motor::factory()->create(['tersedia' => true]);

        $response = $this->actingAs($user)->get(route('motors.credit-order', $motor));

        $response->assertStatus(200);
    }

    /**
     * Test credit order validation errors.
     */
    public function test_credit_order_validation_errors()
    {
        $user = User::factory()->create();
        $motor = Motor::factory()->create(['tersedia' => true]);

        $response = $this->actingAs($user)->from(route('motors.credit-order', $motor))
            ->post(route('motors.process-credit-order', $motor), [
                'name' => '',
                'phone' => '',
                'address' => '',
                'dp_amount' => '',
                'tenor' => '',
            ]);

        $response->assertRedirect(route('motors.credit-order', $motor));
        $response->assertSessionHasErrors(['name', 'phone', 'address', 'dp_amount', 'tenor', 'occupation', 'nik', 'monthly_income', 'employment_duration', 'motor_color', 'delivery_method']);
    }

    /**
     * Test credit order down payment validation (cannot exceed price).
     */
    public function test_credit_order_dp_amount_validation()
    {
        $user = User::factory()->create();
        $motor = Motor::factory()->create(['price' => 15000000, 'tersedia' => true]);

        $response = $this->actingAs($user)->from(route('motors.credit-order', $motor))
            ->post(route('motors.process-credit-order', $motor), [
                'name' => 'John Doe',
                'phone' => '081234567890',
                'occupation' => 'Employee',
                'nik' => '1234567890123456',
                'monthly_income' => 5000000,
                'employment_duration' => '2 years',
                'address' => 'Test Address',
                'dp_amount' => 16000000, // More than price
                'tenor' => 12,
                'payment_method' => 'transfer',
                'motor_color' => 'Merah',
                'delivery_method' => 'pickup',
            ]);

        $response->assertRedirect(route('motors.credit-order', $motor));
        $response->assertSessionHasErrors('dp_amount');
    }

    /**
     * Test user can submit credit order.
     */
    public function test_user_can_submit_credit_order()
    {
        $user = User::factory()->create();
        $motor = Motor::factory()->create(['price' => 50000000, 'tersedia' => true]); // 50 million

        $response = $this->actingAs($user)->post(route('motors.process-credit-order', $motor), [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '081234567890',
            'occupation' => 'Employee',
            'nik' => '1234567890123456',
            'monthly_income' => 5000000,
            'employment_duration' => '2 years',
            'address' => 'Test Address',
            'dp_amount' => 15000000, // 30% of 50m
            'tenor' => 12,
            'payment_method' => 'transfer',
            'motor_color' => 'Merah',
            'delivery_method' => 'pickup',
        ]);

        $transaction = Transaction::where('user_id', $user->id)->where('motor_id', $motor->id)->first();
        $this->assertNotNull($transaction, 'Transaction was not created');

        $response->assertRedirect(route('motors.upload-credit-documents', $transaction));
        
        $this->assertDatabaseHas('transactions', [
            'user_id' => $user->id,
            'motor_id' => $motor->id,
            'transaction_type' => 'CREDIT',
            'final_price' => 50000000,
        ]);

        $this->assertDatabaseHas('credit_details', [
            'transaction_id' => $transaction->id,
            'dp_amount' => 15000000,
            'tenor' => 12,
        ]);
    }
}
