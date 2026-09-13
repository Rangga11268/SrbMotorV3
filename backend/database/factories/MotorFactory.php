<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Motor>
 */
class MotorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->word . ' ' . $this->faker->numberBetween(100, 999),
            'brand' => $this->faker->randomElement(['Honda', 'Yamaha', 'Suzuki', 'Kawasaki']),
            'model' => $this->faker->word,
            'price' => $this->faker->numberBetween(10000000, 50000000),
            'year' => $this->faker->numberBetween(2020, 2025),
            'type' => $this->faker->randomElement(['Matic', 'Bebek', 'Sport', 'Trail']),
            'image_path' => 'storage/motor_images/default.jpg',
            'details' => $this->faker->sentence,
            'tersedia' => $this->faker->boolean,
        ];
    }
}
