<?php

use App\Http\Controllers\AutoGate\GateAccess;
use App\Http\Controllers\AutoGate\ScanGateAccess;
use App\Http\Controllers\AutoGate\OnHoldGateAccess;
use App\Http\Controllers\CustomChecklistController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\LogoutController;
use App\Http\Controllers\SecurityCheckController;
use App\Http\Controllers\SecurityCheckHoaController;
use App\Http\Controllers\SecurityDashboardController;
use App\Http\Controllers\TapController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\TransactionHoaController;
use App\Http\Controllers\VehicleController;
use App\Models\SecurityCheck;
use App\Services\ScanLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('login', LoginController::class)->name('login');
Route::get('logout', LogoutController::class);
Route::post('auto-gate/v1/gate-access', GateAccess::class);
Route::post('auto-gate/v1/scan-gate-access', ScanGateAccess::class);

Route::middleware(['auth:sanctum'])->group(function () {

    Route::get('guests', GuestController::class);
    Route::get('taps', TapController::class);
    Route::resource('custom-checklists', CustomChecklistController::class);
    Route::post('security-checks/{page?}', [SecurityCheckController::class, 'store']);

    Route::post('security-checks/clear-cache', [SecurityCheckController::class, 'clearScreen']);

    Route::post('security-checks-hoa/{page?}', [SecurityCheckHoaController::class, 'store']);
    Route::get('/security-checks-hoa', [SecurityCheckHoaController::class, 'index']);
    Route::resource('security-checks', SecurityCheckController::class)->except(['store', 'destroy']);
    Route::get('security-dashboard', SecurityDashboardController::class);
    Route::post('vehicles', [VehicleController::class, 'store']);
    Route::put('vehicles/{booking_reference_number?}', [VehicleController::class, 'update']);
    Route::get('on-hold/counter', function () {
        return SecurityCheck::whereNotIn('status', ['validated', 'invalid-code', 'voided'])->count();
    });
    Route::post('on-hold/gate-access', OnHoldGateAccess::class);
    Route::get('transactions', TransactionController::class);
    Route::get('hoa-transactions', TransactionHoaController::class);

    Route::get('check-kiosk-data', GateAccess::class)
        ->defaults('check_kiosk_data', false);

    Route::get('settings/kiosk-barrier-redirect-timer/{sec?}', function ($sec = true) {
        if (!Cache::has('kiosk_barrier_redirect_timer')) {
            return $sec ? 30 : 30000;
        }

        return $sec
            ? Cache::get('kiosk_barrier_redirect_timer', 30000) / 1000
            : Cache::get('kiosk_barrier_redirect_timer', 30000);
    });

    Route::put('settings/kiosk-barrier-redirect-timer', function (Request $request) {
        Cache::forever('kiosk_barrier_redirect_timer', $request->timer * 1000);
        return json_encode(['success' => true]);
    });
    Route::get('settings', function () {
        return json_encode([
            'kiosk_barrier_redirect_timer' => Cache::get('kiosk_barrier_redirect_timer', 30000) / 1000,
        ]);
    });
    Route::post('scan-log', function (Request $request, ScanLogService $scanLogService) {
        $scanLogService->write_log([
            $request->code,
            $request->status,
            $request->status_message,
            $request->timestamp,
        ]);

        return response()->json([
            'status' => 'success',
        ], 200);
    });
});
