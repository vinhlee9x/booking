<?php

namespace Tests\Feature;

use App\Modules\Booking\Models\Booking;
use App\Modules\Booking\Models\Room;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoomApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_rooms_index_returns_envelope(): void
    {
        Room::factory()->count(3)->create();

        $response = $this->getJson('/api/rooms');

        $response->assertOk()
            ->assertJsonStructure(['code', 'data', 'msg', 'success'])
            ->assertJsonPath('success', true)
            ->assertJsonCount(3, 'data');
    }

    public function test_room_bookings_public(): void
    {
        $room = Room::factory()->create();
        Booking::factory()->count(2)->create(['room_id' => $room->id]);

        $response = $this->getJson("/api/rooms/{$room->id}/bookings");

        $response->assertOk()
            ->assertJsonStructure(['code', 'data', 'msg', 'success'])
            ->assertJsonPath('success', true)
            ->assertJsonCount(2, 'data');
    }
}
