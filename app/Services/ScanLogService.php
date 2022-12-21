<?php

namespace App\Services;

use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class ScanLogService
{
    public function write_log($data_to_write)
    {
        if (!config('app.log_scan')) {
            return;
        }

        $file = storage_path('logs/scan-log-' . Carbon::now()->toDateString() . '.csv');
        $title = ['code', 'status', 'message', 'date'];

        if (file_exists($file)) {
            $opened_file = fopen($file, 'a');
        } else {
            $opened_file = fopen($file, 'a');
            fputcsv($opened_file, $title);
        }

        fputcsv($opened_file, $data_to_write);
        fclose($opened_file);
    }
}
