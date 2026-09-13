<?php

namespace Database\Factories;

use App\Models\CreditDetail;
use App\Models\Transaction;
use Illuminate\Database\Eloquent\Factories\Factory;

class CreditDetailFactory extends Factory
{
    protected $model = CreditDetail::class;

    public function definition(): array
    {
        return [
            'transaction_id' => Transaction::factory(),
            'status' => 'pengajuan_masuk',
            'dp_amount' => 5000000,
            'tenor' => 36,
            'monthly_installment' => 700000,
            'interest_rate' => 0.05,
            'reference_number' => 'REF-' . strtoupper(uniqid()),
        ];
    }
}
