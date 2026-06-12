<?php

namespace App\Modules\Booking\Repositories\Eloquent;

use App\Modules\Booking\Models\Room;
use App\Modules\Booking\Repositories\Contracts\RoomRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class RoomRepository implements RoomRepositoryInterface
{
    public function all(): Collection
    {
        return Room::query()->get();
    }

    public function lockById(int $id): Room
    {
        return Room::query()->lockForUpdate()->findOrFail($id);
    }
}
