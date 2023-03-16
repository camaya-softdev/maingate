<?php

namespace App\Services;

use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class SocketLogService
{
    public function write_log($data_to_write)
    {
        if (!config('app.log_scan')) {
            return;
        }

        $file = storage_path('logs/socket-log-' . Carbon::now()->toDateString() . '.log');
        $opened_file = fopen($file, 'a');

        fwrite($opened_file, $data_to_write);
        fclose($opened_file);
    }
}
