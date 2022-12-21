<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class OfflineValidation implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    private $cloudService;
    private $guestID;
    private $status;
    public function __construct($cloudService, $guestID, $status)
    {
        $this->cloudService = $cloudService;
        $this->guestID = $guestID;
        $this->status = $status;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        try {
            $this->cloudService->update_guest_status($this->guestID, $this->status);
        } catch (\Throwable $exception) {
            if ($this->attempts() > 9) {
                //if failed in 9 attempts
                throw $exception;
            }
        }
        //requeue this job to be executes in 3 minutes from now
        $this->cloudService->update_guest_status($this->guestID, $this->status);
        $this->release(180);
        return;
    }

    public function retryUntil()
    {
        // will keep retrying, by backoff logic below
        // until 12 hours from first run.
        // After that, if it fails it will go
        // to the failed_jobs table
        return now()->addHours(12);
    }

    public function backoff()
    {
        // first 5 retries, after first failure
        // will be 5 minutes (300 seconds) apart,
        // further attempts will be
        // 3 hours (10,800 seconds) after
        // previous attempt
        return [300, 300, 300, 300, 300, 10800];
    }
}
