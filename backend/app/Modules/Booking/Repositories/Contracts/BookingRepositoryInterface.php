<?php

namespace App\Modules\Booking\Repositories\Contracts;

use App\Modules\Booking\Models\Booking;
use Illuminate\Database\Eloquent\Collection;

interface BookingRepositoryInterface
{
    public function forRoom(int $roomId): Collection;
    public function hasOverlap(int $roomId, string $startTime, string $endTime): bool;
    public function create(array $data): Booking;
    public function deleteById(int $id): void;
}
