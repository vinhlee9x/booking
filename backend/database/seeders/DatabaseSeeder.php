<?php

namespace Database\Seeders;

use App\Models\User;
use App\Modules\Booking\Models\Room;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        Room::factory()->count(5)->create();

        User::factory()->create([
            'name'     => 'Admin User',
            'email'    => 'admin@example.com',
            'password' => bcrypt('password'),
        ]);
    }
}
