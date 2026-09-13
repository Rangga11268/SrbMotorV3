<?php

namespace Database\Factories;

use App\Models\LeasingProvider;
use Illuminate\Database\Eloquent\Factories\Factory;

class LeasingProviderFactory extends Factory
{
    protected $model = LeasingProvider::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->company(),
            'logo_path' => 'leasing/logos/' . $this->faker->uuid() . '.png',
        ];
    }
}
