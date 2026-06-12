<?php

namespace Tests\Feature;

use App\Models\User;
use App\Modules\Booking\Models\Booking;
use App\Modules\Booking\Models\Room;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookingApiTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsUser(): User
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        return $user;
    }

    private function envelopeStructure(bool $success = true): array
    {
        return $success
            ? ['code', 'data', 'msg', 'success']
            : ['code', 'errors', 'error' => ['code', 'message', 'errors', 'key'], 'msg', 'success'];
    }

    public function test_create_booking_valid(): void
    {
        Carbon::setTestNow(Carbon::create(2026, 1, 1, 9, 0, 0));
        $this->actingAsUser();
        $room = Room::factory()->create();

        $response = $this->postJson('/api/bookings', [
            'room_id' => $room->id,
            'user_name' => 'Alice',
            'start_time' => '2026-01-02T10:00:00',
            'end_time' => '2026-01-02T12:00:00',
        ]);

        $response->assertCreated()
            ->assertJsonStructure($this->envelopeStructure())
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.user_name', 'Alice');

        Carbon::setTestNow();
    }

    public function test_create_booking_overlap_returns_422(): void
    {
        Carbon::setTestNow(Carbon::create(2026, 1, 1, 9, 0, 0));
        $this->actingAsUser();
        $room = Room::factory()->create();

        Booking::factory()->create([
            'room_id' => $room->id,
            'start_time' => '2026-01-02 10:00:00',
            'end_time' => '2026-01-02 12:00:00',
        ]);

        $response = $this->postJson('/api/bookings', [
            'room_id' => $room->id,
            'user_name' => 'Bob',
            'start_time' => '2026-01-02T11:00:00',
            'end_time' => '2026-01-02T13:00:00',
        ]);

        $response->assertStatus(422)
            ->assertJsonStructure($this->envelopeStructure(false))
            ->assertJsonPath('success', false)
            ->assertJsonPath('msg', 'Booking overlaps an existing booking for this room.');

        Carbon::setTestNow();
    }

    public function test_back_to_back_booking_is_allowed(): void
    {
        Carbon::setTestNow(Carbon::create(2026, 1, 1, 9, 0, 0));
        $this->actingAsUser();
        $room = Room::factory()->create();

        Booking::factory()->create([
            'room_id' => $room->id,
            'start_time' => '2026-01-02 10:00:00',
            'end_time' => '2026-01-02 12:00:00',
        ]);

        $response = $this->postJson('/api/bookings', [
            'room_id' => $room->id,
            'user_name' => 'Charlie',
            'start_time' => '2026-01-02T12:00:00',
            'end_time' => '2026-01-02T14:00:00',
        ]);

        $response->assertCreated()
            ->assertJsonPath('success', true);

        Carbon::setTestNow();
    }

    public function test_end_before_start_returns_422(): void
    {
        Carbon::setTestNow(Carbon::create(2026, 1, 1, 9, 0, 0));
        $this->actingAsUser();
        $room = Room::factory()->create();

        $response = $this->postJson('/api/bookings', [
            'room_id' => $room->id,
            'user_name' => 'Dave',
            'start_time' => '2026-01-02T12:00:00',
            'end_time' => '2026-01-02T10:00:00',
        ]);

        $response->assertStatus(422)
            ->assertJsonPath('success', false);

        Carbon::setTestNow();
    }

    public function test_past_start_time_returns_422(): void
    {
        Carbon::setTestNow(Carbon::create(2026, 6, 12, 12, 0, 0));
        $this->actingAsUser();
        $room = Room::factory()->create();

        $response = $this->postJson('/api/bookings', [
            'room_id' => $room->id,
            'user_name' => 'Eve',
            'start_time' => '2026-01-01T10:00:00',
            'end_time' => '2026-01-01T12:00:00',
        ]);

        $response->assertStatus(422)
            ->assertJsonPath('success', false);

        Carbon::setTestNow();
    }

    public function test_create_booking_requires_auth(): void
    {
        $room = Room::factory()->create();

        $response = $this->postJson('/api/bookings', [
            'room_id' => $room->id,
            'user_name' => 'Frank',
            'start_time' => '2026-01-02T10:00:00',
            'end_time' => '2026-01-02T12:00:00',
        ]);

        $response->assertUnauthorized()
            ->assertJsonPath('success', false)
            ->assertJsonPath('code', 401);
    }

    public function test_delete_booking_authenticated(): void
    {
        Carbon::setTestNow(Carbon::create(2026, 1, 1, 9, 0, 0));
        $this->actingAsUser();
        $booking = Booking::factory()->create([
            'start_time' => '2026-01-02 10:00:00',
            'end_time' => '2026-01-02 12:00:00',
        ]);

        $response = $this->deleteJson("/api/bookings/{$booking->id}");

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('msg', 'Booking deleted');

        Carbon::setTestNow();
    }

    public function test_delete_booking_requires_auth(): void
    {
        $booking = Booking::factory()->create();

        $response = $this->deleteJson("/api/bookings/{$booking->id}");

        $response->assertUnauthorized()
            ->assertJsonPath('success', false);
    }
}
