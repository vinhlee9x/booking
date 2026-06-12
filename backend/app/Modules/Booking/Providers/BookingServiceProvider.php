<?php

namespace App\Modules\Booking\Providers;

use App\Modules\Booking\Repositories\Contracts\BookingRepositoryInterface;
use App\Modules\Booking\Repositories\Contracts\RoomRepositoryInterface;
use App\Modules\Booking\Repositories\Eloquent\BookingRepository;
use App\Modules\Booking\Repositories\Eloquent\RoomRepository;
use Illuminate\Support\ServiceProvider;

class BookingServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(RoomRepositoryInterface::class, RoomRepository::class);
        $this->app->bind(BookingRepositoryInterface::class, BookingRepository::class);
    }
}
