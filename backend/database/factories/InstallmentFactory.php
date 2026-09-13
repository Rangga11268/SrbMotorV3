<?php

namespace Database\Factories;

use App\Models\Installment;
use App\Models\Transaction;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Installment>
 */
class InstallmentFactory extends Factory
{
    protected $model = Installment::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'transaction_id' => Transaction::factory(),
            'installment_number' => $this->faker->numberBetween(1, 12),
            'amount' => $this->faker->randomFloat(2, 500000, 2000000),
            'penalty_amount' => 0,
            'due_date' => $this->faker->dateTimeBetween('now', '+1 year'),
            'status' => 'pending',
            'paid_at' => null,
            'payment_method' => null,
            'payment_proof' => null,
            'notes' => $this->faker->sentence(),
        ];
    }
}
