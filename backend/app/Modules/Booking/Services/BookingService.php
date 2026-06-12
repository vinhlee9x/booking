<?php

namespace App\Modules\Booking\Services;

use App\Modules\Booking\Exceptions\BookingOverlapException;
use App\Modules\Booking\Models\Booking;
use App\Modules\Booking\Repositories\Contracts\BookingRepositoryInterface;
use App\Modules\Booking\Repositories\Contracts\RoomRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class BookingService
{
    public function __construct(
        private RoomRepositoryInterface $roomRepo,
        private BookingRepositoryInterface $bookingRepo
    ) {
    }

    public function create(array $data): Booking
    {
        $data['start_time'] = Carbon::parse($data['start_time'])->format('Y-m-d H:i:s');
        $data['end_time'] = Carbon::parse($data['end_time'])->format('Y-m-d H:i:s');

        return DB::transaction(function () use ($data) {
            $this->roomRepo->lockById($data['room_id']);

            if ($this->bookingRepo->hasOverlap($data['room_id'], $data['start_time'], $data['end_time'])) {
                throw new BookingOverlapException();
            }

            return $this->bookingRepo->create($data);
        });
    }

    public function delete(int $id): void
    {
        $this->bookingRepo->deleteById($id);
    }
}
