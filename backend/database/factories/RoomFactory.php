<?php

namespace Database\Factories;

use App\Modules\Booking\Models\Room;
use Illuminate\Database\Eloquent\Factories\Factory;

class RoomFactory extends Factory
{
    protected $model = Room::class;

    public function definition(): array
    {
        return [
            'name' => 'Room ' . $this->faker->unique()->word(),
            'capacity' => $this->faker->numberBetween(4, 20),
        ];
    }
}
