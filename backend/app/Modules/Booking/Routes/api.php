<?php

use App\Modules\Booking\Http\Controllers\BookingController;
use App\Modules\Booking\Http\Controllers\RoomController;
use Illuminate\Support\Facades\Route;

// Public: anyone can browse rooms and their bookings (view available slots)
Route::get('/rooms', [RoomController::class, 'index']);
Route::get('/rooms/{id}/bookings', [RoomController::class, 'bookings']);

// Protected: only authenticated users can create or delete bookings
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::delete('/bookings/{id}', [BookingController::class, 'destroy']);
});
