<?php

namespace App\Modules\Booking\Repositories\Contracts;

use App\Modules\Booking\Models\Room;
use Illuminate\Database\Eloquent\Collection;

interface RoomRepositoryInterface
{
    public function all(): Collection;
    public function lockById(int $id): Room;
}
