<?php

namespace App\Modules\Booking\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Booking\Http\Resources\BookingResource;
use App\Modules\Booking\Http\Resources\RoomResource;
use App\Modules\Booking\Repositories\Contracts\BookingRepositoryInterface;
use App\Modules\Booking\Repositories\Contracts\RoomRepositoryInterface;

class RoomController extends Controller
{
    public function __construct(
        private RoomRepositoryInterface $roomRepo,
        private BookingRepositoryInterface $bookingRepo
    ) {
    }

    public function index()
    {
        return $this->successResponse(RoomResource::collection($this->roomRepo->all())->resolve());
    }

    public function bookings(int $id)
    {
        return $this->successResponse(BookingResource::collection($this->bookingRepo->forRoom($id))->resolve());
    }
}
