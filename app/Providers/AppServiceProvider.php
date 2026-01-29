<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\MotorRepositoryInterface;
use App\Repositories\MotorRepository;
use App\Models\CreditDetail;
use App\Observers\CreditDetailObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Bind repository interfaces to their implementations
        $this->app->bind(
            MotorRepositoryInterface::class,
            MotorRepository::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register observers
        CreditDetail::observe(CreditDetailObserver::class);
    }
}
