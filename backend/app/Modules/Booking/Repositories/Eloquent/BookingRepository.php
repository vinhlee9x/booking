<?php

namespace App\Modules\Booking\Repositories\Eloquent;

use App\Modules\Booking\Models\Booking;
use App\Modules\Booking\Repositories\Contracts\BookingRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class BookingRepository implements BookingRepositoryInterface
{
    public function forRoom(int $roomId): Collection
    {
        return Booking::query()
            ->where('room_id', $roomId)
            ->orderBy('start_time')
            ->get();
    }

    public function hasOverlap(int $roomId, string $startTime, string $endTime): bool
    {
        return Booking::query()
            ->where('room_id', $roomId)
            ->where('start_time', '<', $endTime)
            ->where('end_time', '>', $startTime)
            ->exists();
    }

    public function create(array $data): Booking
    {
        return Booking::query()->create($data);
    }

    public function deleteById(int $id): void
    {
        Booking::query()->findOrFail($id)->delete();
    }
}
