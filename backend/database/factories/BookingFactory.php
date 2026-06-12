<?php

namespace Database\Factories;

use App\Modules\Booking\Models\Booking;
use App\Modules\Booking\Models\Room;
use Illuminate\Database\Eloquent\Factories\Factory;

class BookingFactory extends Factory
{
    protected $model = Booking::class;

    public function definition(): array
    {
        $start = $this->faker->dateTimeBetween('+1 day', '+30 days');
        $end = (clone $start)->modify('+2 hours');

        return [
            'room_id' => Room::factory(),
            'user_name' => $this->faker->name(),
            'start_time' => $start,
            'end_time' => $end,
        ];
    }
}
