<?php

namespace Database\Factories;

use App\Models\Transaction;
use App\Models\User;
use App\Models\Motor;
use Illuminate\Database\Eloquent\Factories\Factory;

class TransactionFactory extends Factory
{
    protected $model = Transaction::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'motor_id' => Motor::factory(),
            'reference_number' => 'TRX-' . strtoupper(uniqid()),
            'transaction_type' => $this->faker->randomElement(['CASH', 'CREDIT']),
            'status' => 'new_order',
            'motor_price' => 20000000,
            'total_price' => 20000000,
            'final_price' => 20000000,
            'payment_method' => 'transfer',
            'payment_status' => 'pending',
            'phone' => $this->faker->phoneNumber(),
            'address' => $this->faker->address(),
        ];
    }
}
