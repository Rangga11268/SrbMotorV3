<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\MotorRepositoryInterface;
use App\Repositories\MotorRepository;
use App\Models\CreditDetail;
use App\Models\MotorUnit;
use App\Observers\CreditDetailObserver;
use App\Observers\MotorUnitObserver;

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
        // Smart Force HTTPS: Only force it if the request is coming via an HTTPS proxy (like ngrok)
        // or if explicitly set in APP_URL but only for those requests.
        if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
            \Illuminate\Support\Facades\URL::forceScheme('https');
        }

        // Register observers

        \App\Models\Transaction::observe(\App\Observers\TransactionObserver::class);
        CreditDetail::observe(CreditDetailObserver::class);
        \App\Models\SurveySchedule::observe(\App\Observers\SurveyScheduleObserver::class);
        \App\Models\Installment::observe(\App\Observers\InstallmentObserver::class);
    }

}
