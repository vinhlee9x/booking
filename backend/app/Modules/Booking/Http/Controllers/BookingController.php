<?php

namespace App\Modules\Booking\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Booking\Http\Requests\StoreBookingRequest;
use App\Modules\Booking\Http\Resources\BookingResource;
use App\Modules\Booking\Services\BookingService;

class BookingController extends Controller
{
    public function __construct(private BookingService $bookingService)
    {
    }

    public function store(StoreBookingRequest $request)
    {
        $booking = $this->bookingService->create($request->validated());

        return $this->successResponse((new BookingResource($booking))->resolve(), 'Booking created', 201);
    }

    public function destroy(int $id)
    {
        $this->bookingService->delete($id);

        return $this->successResponse(null, 'Booking deleted');
    }
}
