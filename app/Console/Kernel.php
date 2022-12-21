<?php

namespace App\Console;

use App\Services\CloudService;
use App\Services\CloudHoaService;
use Carbon\Carbon;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        //
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule
            ->call(function () {
                // sleep(5);
                // Log::debug('debug schedule: ' . Carbon::now());

                $cloudService = new CloudService();
                $cloudService->sync_table();
            })
            ->name('cloud-sync')
            ->cron(config('app.cloud_sync.cron_schedule'))
            // ->everyMinute()
            ->withoutOverlapping(5) // 5 minutes lock
            ->runInBackground();

        $schedule
            ->call(function () {
                // sleep(5);
                // Log::debug('debug schedule: ' . Carbon::now());

                $cloudHoaService = new CloudHoaService();
                $cloudHoaService->sync_table();
            })
            ->name('cloud-sync-hoa')
            ->cron(config('app.cloud_sync.cron_schedule'))
            ->withoutOverlapping(5) // 5 minutes lock
            ->runInBackground();

        $schedule
            ->call(function () {
                $process_runnning_on_port_6001 = shell_exec('netstat -ano | findstr 6001');
                // Log::debug('debug shell exec: ' . $process_runnning_on_port_6001);

                if (!$process_runnning_on_port_6001) {
                    Artisan::call('websockets:serve');
                    // $process_runnning_on_port_6001 = shell_exec('netstat -ano | findstr 6001');
                    // Log::debug('websocket started: ' . $process_runnning_on_port_6001);
                }
            })
            ->everyMinute()
            ->runInBackground();
        // $schedule->command('optimize:clear')->dailyAt('23:59'); //clear all cache at 12:00 am
        // $schedule->command('migrate:fresh --seed')->dailyAt('21:40');
        $schedule->command('backup:run --only-db')->dailyAt('21:35'); //backup the database at 11:58
        $schedule->command('default:template')
            ->name('back-default-template')->everyMinute()->withoutOverlapping();
        // ->cron(config('app.cloud_sync.cron_schedule'))
        // ->withoutOverlapping(5) // 5 minutes lock
        // ->runInBackground();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
