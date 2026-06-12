<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class ModuleRouteServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        foreach (glob(app_path('Modules/*/Routes/api.php')) as $routeFile) {
            Route::middleware('api')
                ->prefix('api')
                ->group($routeFile);
        }
    }
}
