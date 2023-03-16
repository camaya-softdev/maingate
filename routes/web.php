<?php

use App\Events\ScanEvent;
use App\Http\Controllers\GuestReportsController;
use Illuminate\Support\Facades\Route;
use App\Services\CloudService;
use App\Services\CloudHoaService;
use App\Services\CloudManualSync;
use Illuminate\Support\Facades\Cache;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/ws/{page?}', function ($page = '/') {
    ScanEvent::dispatch($page);
    return json_encode(['success' => true]);
});

Route::get('/ws-with-timer/{page?}', function ($page = '/') {
    $sleep = Cache::get('kiosk_barrier_redirect_timer', 30000) / 1000;
    sleep($sleep - 1);

    $kiosk_data = Cache::get('kiosk_data');
    if (!$kiosk_data) {
        ScanEvent::dispatch($page);
    }

    return json_encode(['success' => true]);
});

Route::get('/sync-table', function (CloudManualSync $cloudService) {
    $return = $cloudService->sync_table();
    return $return;
});

Route::get('/download-guest-reports', GuestReportsController::class);

Route::get('/hoa-sync-table', function (CloudHoaService $cloudHoaService) {
    $return = $cloudHoaService->sync_table();
    return $return;
});

Route::get('/{path?}', function () {
    return view('default');
});
