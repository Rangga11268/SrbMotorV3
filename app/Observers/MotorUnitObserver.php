<?php

namespace App\Observers;

use App\Models\MotorUnit;
use App\Repositories\MotorRepositoryInterface;

class MotorUnitObserver
{
    protected $motorRepository;

    public function __construct(MotorRepositoryInterface $motorRepository)
    {
        $this->motorRepository = $motorRepository;
    }

    /**
     * Handle the MotorUnit "created" event.
     */
    public function created(MotorUnit $motorUnit): void
    {
        $this->motorRepository->clearCache();
    }

    /**
     * Handle the MotorUnit "updated" event.
     */
    public function updated(MotorUnit $motorUnit): void
    {
        $this->motorRepository->clearCache();
    }

    /**
     * Handle the MotorUnit "deleted" event.
     */
    public function deleted(MotorUnit $motorUnit): void
    {
        $this->motorRepository->clearCache();
    }
}
