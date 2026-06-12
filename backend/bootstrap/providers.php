<?php

use App\Providers\AppServiceProvider;

return [
    AppServiceProvider::class,
    App\Providers\ModuleRouteServiceProvider::class,
    App\Modules\Booking\Providers\BookingServiceProvider::class,
];
