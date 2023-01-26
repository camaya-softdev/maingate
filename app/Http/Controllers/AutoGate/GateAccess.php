<?php

/**
 * Copied file from NBE (filepath: app\HTTP\Controllers\AutoGate\GateAccess.php)
 * Modified to handle system requrirements (Added events to update kiosk display).
 * Please see readme file for the process flow
 * Please update this file if there was a new logic implemented in the file from NBE
 */

namespace App\Http\Controllers\AutoGate;

use App\Events\ScanEvent;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Booking;
use App\Models\Guest;
use App\Models\GuestUpdate;

use App\Models\GuestVehicleInsert;
use App\Models\GuestVehicleUpdate;
use App\Models\Invoice;
use App\Models\Pass;
use App\Models\PassUpdate;
use App\Models\SecurityCheck;
use App\Models\Tap;
use App\Services\CloudService;
use App\Services\ValidationLogService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use App\Models\Lot;
use App\Models\Billing;

class GateAccess extends Controller
{
    /**
     * Accepted parameters
     *      (String) required code: GUEST REFERENCE NUMBER, BOOKING REFERENCE NUMBER, CARD NUMBER
     *      (String) required interface: 'commercial_gate', 'main_gate', 'parking_gate'
     *      (String) required mode: 'entry', 'exit', 'access', 'consume'
     *
     *      (String) required secret_token: SECRET_TOKEN
     *      (Integer) required kiosk_id: Kiosk id
     *      (DateTime) required timestamp: DateTime YYYY-MM-DD HH:mm:ss [ISO_FORMAT]
     */

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(
        Request $request,
        CloudService $cloudService,
        ValidationLogService $scanLogService,
        $check_kiosk_data = true
    ) {
        // get data in cache
        $kiosk_data = Cache::get('kiosk_data');
        // check if there's another request
        if ($check_kiosk_data) {
            if ($kiosk_data) {
                $scanLogService->write_log([
                    $kiosk_data['code'] . '(' . @$request->code . ')',
                    'INVALID_REQUEST',
                    'Previous request is not yet validated',
                    Carbon::now()
                ]);

                return response()->json([
                    'status' => 'INVALID_REQUEST',
                    'status_message' => "Previous request is not yet validated",
                ], 400);
            }
        } else {
            if ($kiosk_data) {
                $request->merge($kiosk_data);
            } else {
                ScanEvent::dispatch('/');
                return;
            }
        }

        //
        $secret_token = 'CAMAYA9999';

        if (($secret_token !== $request->secret_token) || !isset($request->secret_token)) {
            $scanLogService->write_log([
                '',
                'INVALID_SECRET_TOKEN',
                'Secret token missing or not recognized',
                Carbon::now()
            ]);

            return response()->json([
                'status' => 'INVALID_SECRET_TOKEN',
                'status_message' => "Secret token missing or not recognized.",
            ], 400);
        }

        if (!$request->code) {
            $scanLogService->write_log([
                '',
                'CODE_INVALID',
                'Code is missing or not recognized',
                Carbon::now()
            ]);

            return response()->json([
                'status' => 'CODE_INVALID',
                'status_message' => 'Code is missing or not recognized',
            ], 400);
        }

        // revalidate code after n minutes
        $last_tap = Tap::where('code', $request->code)->orderBy('id', 'desc')->first();
        if ($last_tap && $request->path() != 'api/check-kiosk-data') {
            $tap_datetime = Carbon::create($last_tap->tap_datetime);
            $tap_datetime_with_config_sec = $tap_datetime->addMinutes(config('app.delayed_mins_to_validate_new_tap'));
            $current_datetime = Carbon::now();

            if ($tap_datetime_with_config_sec->greaterThan($current_datetime)) {
                $scanLogService->write_log([
                    $request->code,
                    'TAP_INVALID',
                    'Next tap is allowed after ' . $tap_datetime_with_config_sec->format('Y-m-d h:i:s'),
                    Carbon::now()
                ]);

                return response()->json([
                    'status' => 'TAP_INVALID',
                    'status_message' => 'Next tap is allowed after ' . $tap_datetime_with_config_sec->format('Y-m-d h:i:s'),
                ], 400);
            }
        }

        //quick fix for rfid checking
        //if we receive an rfid code return a sample user
        if (preg_match('/[0-9]{10}/', $request->code)) {
            //check if users has template
            $user = User::with('designee', 'autogate.template', 'autogate.template.background')
                ->with(['card' => function ($cardQ) use ($request) {
                    $cardQ->where('hoa_rfid_num', '=', $request->code)
                        ->where('hoa_rfid_reg_status', '=', 1)->first();
                }])
                ->whereHas('card', function ($q) use ($request) {
                    $q->where('hoa_rfid_reg_status', '=', 1)->where('hoa_rfid_num', '=', $request->code);
                })->whereHas('autogate', function ($autogateQuery) {
                    $autogateQuery->where(function ($startDateQuery) {
                        $startDateQuery->where('hoa_autogate_start', '<', Carbon::today()->toDateString())
                            ->orWhere('hoa_autogate_start', '=', Carbon::today()->toDateString());
                    })->where(function ($endDateQuery) {
                        $endDateQuery->where('hoa_autogate_end', '>', Carbon::today()->toDateString())
                            ->orWhere('hoa_autogate_end', '=', Carbon::today()->toDateString());
                    });
                })->first();

            if (!empty($user)) {
                $lot = Lot::where('user_id', $user->id)->where('hoa_subd_lot_default', 1)->first();
                $billing  = Billing::where('lot_id', $lot->id)->latest()->first();
                $tap = Tap::create([
                    'code' => $request->code,
                    'tap_datetime' => Carbon::now(),
                    'scan' => 'HOA',
                    'status' => 'valid',
                    'message' => 'RFID Valid',
                    'location' => $request->interface,
                    'kiosk_id' => $request->kiosk_id,
                    'type' => $request->mode, // entry, exit, consume
                ]);
                ScanEvent::dispatch('/welcome-hoa', '', [
                    'status' => 'OK',
                    // 'booking' => Booking::with(['guests', 'guest_vehicles', 'inclusions', 'customer', 'tags'])->first(),
                    'balance' => 1000,
                    'users' => $user,
                    'layout' => '',
                    'billing' => $billing,
                    // 'pass' => Pass::where('mode', $request->mode)->whereRaw('json_contains(interfaces, \'["main_gate"]\')')->first(),
                ]);


                return response()->json([
                    'status' => 'OK',
                    'status_message' => "Scan successful!",
                    // 'data' => [
                    //     'booking' => Booking::where('reference_number', $pass['booking_reference_number'])->with(['guests', 'guest_vehicles', 'inclusions', 'customer'])->first(),
                    //     'details' => $details,
                    //     'pass' => $pass
                    // ]
                ], 200);
            }

            //will be back to default rfid autogate template once the template is expired
            $userDefault = User::with('designee', 'autogate.template', 'autogate.template.background')
                ->with(['card' => function ($cardQ) use ($request) {
                    $cardQ->where('hoa_rfid_num', '=', $request->code)
                        ->where('hoa_rfid_reg_status', '=', 1)->first();
                }])
                ->whereHas('card', function ($q) use ($request) {
                    $q->where('hoa_rfid_reg_status', '=', 1)->where('hoa_rfid_num', '=', $request->code);
                })
                ->first();

            //display the default template
            if (!empty($userDefault)) {
                $lotDefault = Lot::select('id')->where('user_id', $userDefault->id)->first();
                $billingDefault = Billing::where('lot_id', $lotDefault->id)->first();
                $tap = Tap::create([
                    'code' => $request->code,
                    'tap_datetime' => Carbon::now(),
                    'scan' => 'HOA',
                    'status' => 'valid',
                    'message' => 'RFID Valid',
                    'location' => $request->interface,
                    'kiosk_id' => $request->kiosk_id,
                    'type' => $request->mode, // entry, exit, consume
                ]);
                ScanEvent::dispatch('/welcome-hoa', '', [
                    'status' => 'OK',
                    // 'booking' => Booking::with(['guests', 'guest_vehicles', 'inclusions', 'customer', 'tags'])->first(),
                    'balance' => 1000,
                    'billing' => $billingDefault,
                    'users' => $userDefault,
                    'layout' => '',
                    // 'pass' => Pass::where('mode', $request->mode)->whereRaw('json_contains(interfaces, \'["main_gate"]\')')->first(),
                ]);


                return response()->json([
                    'status' => 'OK',
                    'status_message' => "Scan successful!",
                ], 200);
            }

            $tap = Tap::create([
                'code' => $request->code,
                'tap_datetime' => Carbon::now(),
                'scan' => 'HOA',
                'status' => 'invalid',
                'message' => 'RFID Testing',
                'location' => $request->interface,
                'kiosk_id' => $request->kiosk_id,
                'type' => $request->mode, // entry, exit, consume
            ]);
            ScanEvent::dispatch(
                '/invalid-code',
                'RFID code not accepted. The code is not allowed to be used here or does not exist in our records.',
                [
                    'status' => 'CODE_INVALID',
                    'users' => '',
                    'layout' => '',
                    'details' => [
                        'code' => $request->code,
                        'tap_id' => $tap->id, //tap history
                    ],
                ]
            );

            $scanLogService->write_log([
                $request->code,
                'CODE_INVALID',
                'Code not accepted. The code is not allowed to be used here or does not exist in our records.',
                Carbon::now()
            ]);

            return response()->json([
                'status' => 'CODE_INVALID',
                'status_message' => 'Code not accepted. The code is not allowed to be used here or does not exist in our records.',
            ], 400);
        }

        // store request data in cache
        Cache::put('kiosk_data', $request->all());

        $code_type = null;
        $details = [];

        $explodedCode = explode('-', $request->code);

        $prefix = $explodedCode[0] ?? null;

        if (in_array($prefix, ['DT', 'ON'])) {
            // Booking code scanned
            $code_type = 'booking';
        } else if ($prefix == 'G') {
            // Guest code scanned
            $code_type = 'guest';
        } else {
            $code_type = 'card';
        }


        // Get pass based on interface used
        $pass = Pass::where('guest_reference_number', $request->code)
            ->where('mode', $request->mode)
            // ->orWhere('card_number', $request->code) // Implement for RFID
            ->whereRaw('json_contains(interfaces, \'["' . $request->interface . '"]\')')
            // ->orWhere('type', $request->pass_type)
            ->first();

        if (!$pass) {
            // Log the tap
            $tap = Tap::create([
                'code' => $request->code,
                'tap_datetime' => Carbon::now(),
                'status' => 'invalid',
                'message' => '',
                'location' => $request->interface,
                'kiosk_id' => $request->kiosk_id,
                'type' => $request->mode, // entry, exit, consume
            ]);

            // Update kiosk display
            ScanEvent::dispatch(
                '/invalid-code',
                'Code not accepted. The code is not allowed to be used here or does not exist in our records.',
                [
                    'status' => 'CODE_INVALID',
                    'users' => '',
                    'layout' => '',
                    'details' => [
                        'code' => $request->code,
                        'tap_id' => $tap->id,
                    ],
                ]
            );

            $scanLogService->write_log([
                $request->code,
                'CODE_INVALID',
                'Code not accepted. The code is not allowed to be used here or does not exist in our records.',
                Carbon::now()
            ]);

            return response()->json([
                'status' => 'CODE_INVALID',
                'status_message' => 'Code not accepted. The code is not allowed to be used here or does not exist in our records.',
            ], 400);
        }

        $booking = Booking::where('reference_number', $pass['booking_reference_number'])
            ->first();

        if ($booking && !in_array($booking['status'], ['confirmed'])) {
            // Log the tap
            $tap = Tap::create([
                'code' => $request->code,
                'tap_datetime' => Carbon::now(),
                'status' => 'valid_booking_not_confirmed',
                'message' => '',
                'location' => $request->interface,
                'kiosk_id' => $request->kiosk_id,
                'type' => $request->mode, // entry, exit, consume
            ]);

            // Update kiosk display
            ScanEvent::dispatch(
                '/invalid-code',
                'Code not accepted. Booking is not CONFIRMED.',
                [
                    'status' => 'CODE_VALID_WITH_ERROR',
                    'users' => '',
                    'layout' => '',
                    'details' => [
                        'code' => $request->code,
                        'tap_id' => $tap->id,
                    ],
                ]
            );

            $scanLogService->write_log([
                $request->code,
                'CODE_VALID_WITH_ERROR',
                'Code not accepted. Booking is not CONFIRMED.',
                Carbon::now()
            ]);

            return response()->json([
                'status' => 'CODE_VALID_WITH_ERROR',
                'status_message' => 'Code not accepted. Booking is not CONFIRMED.',
            ], 400);
        }

        /**
         * Check if $pass has already been consumed
         */
        if (
            $pass->category == 'consumable' &&
            $pass->status == 'consumed'
        ) {

            $tap = Tap::create([
                'code' => $request->code,
                'tap_datetime' => Carbon::now(),
                'status' => 'valid_not_allowed',
                'message' => '',
                'location' => $request->interface,
                'kiosk_id' => $request->kiosk_id,
                'type' => $request->mode, // entry, exit, consume
            ]);

            // Update kiosk display
            ScanEvent::dispatch(
                '/invalid-code',
                'This code is already been used or consumed completely.',
                [
                    'status' => 'CODE_CONSUMED',
                    'users' => '',
                    'layout' => '',
                    'details' => [
                        'code' => $request->code,
                        'tap_id' => $tap->id,
                    ],
                ]
            );

            $scanLogService->write_log([
                $request->code,
                'CODE_CONSUMED',
                'This code is already been used or consumed completely.',
                Carbon::now()
            ]);

            return response()->json([
                'status' => 'CODE_CONSUMED',
                'status_message' => 'This code is already been used or consumed completely.',
            ], 400);
        }

        /**
         * Check if $pass can already be used
         */
        if (Carbon::now() <= $pass->usable_at) {

            $tap = Tap::create([
                'code' => $request->code,
                'tap_datetime' => Carbon::now(),
                'status' => 'valid_not_yet_started',
                'message' => '',
                'location' => $request->interface,
                'kiosk_id' => $request->kiosk_id,
                'type' => $request->mode, // entry, exit, consume
            ]);

            // Update kiosk display
            ScanEvent::dispatch(
                '/invalid-code',
                'Your code is valid but not yet allowed to be used.',
                [
                    'status' => 'VALID_NOT_YET_ALLOWED',
                    'users' => '',
                    'details' => [
                        'code' => $request->code,
                        'tap_id' => $tap->id,
                    ],
                ]
            );

            $scanLogService->write_log([
                $request->code,
                'VALID_NOT_YET_ALLOWED',
                'Your code is valid but not yet allowed to be used.',
                Carbon::now()
            ]);

            return response()->json([
                'status' => 'VALID_NOT_YET_ALLOWED',
                'status_message' => 'Your code is valid but not yet allowed to be used.',
            ], 400);
        }

        /**
         * Check if $pass is expired
         */
        if (Carbon::now() > $pass->expires_at) {

            // Remove cached kiosk_data
            // if ($kiosk_data) {
            //     Cache::forget('kiosk_data');
            //     return;
            // }

            $tap = Tap::create([
                'code' => $request->code,
                'tap_datetime' => Carbon::now(),
                'status' => 'valid_expired',
                'message' => '',
                'location' => $request->interface,
                'kiosk_id' => $request->kiosk_id,
                'type' => $request->mode, // entry, exit, consume
            ]);

            // Update kiosk display
            ScanEvent::dispatch(
                '/invalid-code',
                'Your code is valid but it is expired already.',
                [
                    'status' => 'VALID_NOT_EXPIRED',
                    'users' => '',
                    'details' => [
                        'code' => $request->code,
                        'tap_id' => $tap->id,
                    ],
                ]
            );

            $scanLogService->write_log([
                $request->code,
                'VALID_NOT_EXPIRED',
                'Your code is valid but it is expired already.',
                Carbon::now()
            ]);

            return response()->json([
                'status' => 'VALID_NOT_EXPIRED',
                'status_message' => 'Your code is valid but it is expired already.',
            ], 400);
        }


        // Switch intefaces for further checking and details setting
        switch ($request->interface) {
            case 'commercial_gate':
            case 'main_gate':

                $exists = Booking::where('reference_number', $request->code)->exists();

                if ($code_type == 'booking' && $exists) {

                    $tap = Tap::create([
                        'code' => $request->code,
                        'tap_datetime' => Carbon::now(),
                        'status' => 'valid_not_allowed',
                        'message' => '',
                        'location' => $request->interface,
                        'kiosk_id' => $request->kiosk_id,
                        'type' => $request->mode, // entry, exit, consume
                    ]);

                    // Update kiosk display
                    ScanEvent::dispatch(
                        '/invalid-code',
                        'Please use your Guest Reference # for Main Gate',
                        [
                            'status' => 'CODE_NOT_ALLOWED',
                            'users' => '',
                            'details' => [
                                'code' => $request->code,
                                'tap_id' => $tap->id,
                            ],
                        ]
                    );

                    $scanLogService->write_log([
                        $request->code,
                        'CODE_NOT_ALLOWED',
                        'Please use your Guest Reference # for Main Gate',
                        Carbon::now()
                    ]);

                    return response()->json([
                        'status' => 'CODE_NOT_ALLOWED',
                        'status_message' => 'Please use your Guest Reference # for Main Gate',
                    ], 400);
                }

                $details = Guest::where('reference_number', $request->code)->with('booking')->first();

                /**
                 * Update guest status
                 */
                if ($details) {
                    // Guest::where('id', $details->id)
                    //     ->update([
                    //         'status' => 'checked_in',
                    //         'updated_at' => Carbon::now(),
                    //     ]);
                    // GuestUpdate::updateOrCreate(
                    //     ['id' => $details->id],
                    //     ['status' => 'on_premise']
                    // );
                    // $cloudService->update_guest_status($details->id, 'on_premise');
                }

                /*
                 * if reference number is not found sync database at least 2 times
                 * sir homer suggestions
                 */
                //first try
                if (!$details) {
                    $cloudService->sync_table();
                    $details = Guest::where('reference_number', $request->code)->with('booking')->first();

                    // if ($details) {
                    //     GuestUpdate::updateOrCreate(
                    //         ['id' => $details->id],
                    //         ['status' => 'on_premise']
                    //     );
                    //     $cloudService->sync_table($details->id, 'on_premise');
                    // }
                }
                //second try
                if (!$details) {
                    $cloudService->sync_table();
                    $details = Guest::where('reference_number', $request->code)->with('booking')->first();

                    // if ($details) {
                    //     GuestUpdate::updateOrCreate(
                    //         ['id' => $details->id],
                    //         ['status' => 'on_premise']
                    //     );
                    //     $cloudService->update_guest_status($details->id, 'on_premise');
                    // }
                }

                break;
        }


        /**
         * Check if record exists in database
         */
        if (!$details) {

            $tap = Tap::create([
                'code' => $request->code,
                'tap_datetime' => Carbon::now(),
                'status' => 'invalid',
                'message' => '',
                'location' => $request->interface,
                'kiosk_id' => $request->kiosk_id,
                'type' => $request->mode, // entry, exit, consume
            ]);

            // Update kiosk display
            ScanEvent::dispatch(
                '/invalid-code',
                'There\'s no record corresponding to QR Code.',
                [
                    'status' => 'CODE_INVALID',
                    'users' => '',
                    'details' => [
                        'code' => $request->code,
                        'tap_id' => $tap->id,
                    ],
                ]
            );

            $scanLogService->write_log([
                $request->code,
                'CODE_INVALID',
                'There\'s no record corresponding to QR Code.',
                Carbon::now()
            ]);

            return response()->json([
                'status' => 'CODE_INVALID',
                'status_message' => 'There\'s no record corresponding to QR Code.',
            ], 400);
        }


        /**
         * Create a log of tap
         */
        // create tap only if cache (kiosk_data) is not set
        if ($kiosk_data) {
            $tap = Tap::where('code', $request->code)
                ->orderBy('id', 'DESC')
                ->first();
        } else {
            $tap = Tap::create([
                'code' => $request->code,
                'tap_datetime' => Carbon::now(),
                'status' => 'valid',
                'message' => '',
                'location' => $request->interface,
                'kiosk_id' => $request->kiosk_id,
                'type' => $request->mode, // entry, exit, consume
                'pass_code' => $pass->pass_code, // entry, exit, consume
            ]);
        }

        /**
         * Update the $pass if necessary
         */

        if ($pass->category == 'consumable') {
            // Pass::where('id', $pass->id)
            //     ->update([
            //         'count' => $pass->count - 1, // Update count
            //         'status' => (($pass->count - 1) <= 0) ? 'consumed' : 'used',
            //     ]);

            PassUpdate::updateOrCreate(
                ['id' => $pass->id],
                [
                    'count' => $pass->count - 1, // Update count
                    'status' => (($pass->count - 1) <= 0) ? 'consumed' : 'used',
                ]
            );
        } else if ($pass->category == 'reusable') {
            // Pass::where('id', $pass->id)
            //     ->update([
            //         'status' => 'used',
            //         'updated_at' => Carbon::now(),
            //     ]);
            PassUpdate::updateOrCreate(
                ['id' => $pass->id],
                [
                    'count' => $pass->count,
                    'status' => 'used'
                ]
            );
        }

        $pass->refresh();

        // Fixed vehicle
        $booking_kiosk = Booking::where('reference_number', $pass['booking_reference_number'])
            ->with(['guests', 'guest_vehicles', 'inclusions', 'customer', 'tags'])
            ->first();
        $previous_security_check_data = SecurityCheck::where('booking_reference_number', $pass['booking_reference_number'])
            ->orderBy('id', 'desc')
            ->first();
        $booking_vehicle_ids = collect($booking_kiosk->guest_vehicles)->pluck('id');
        $additional_vehicles = GuestVehicleInsert::where('booking_reference_number', $pass['booking_reference_number'])
            ->orderBy('id')
            ->get();
        $vehicles_update = GuestVehicleUpdate::whereIn('id', $booking_vehicle_ids)
            ->get();

        if ($additional_vehicles) {
            $guest_vehicles = $booking_kiosk['guest_vehicles'];

            foreach ($additional_vehicles as $index => $additional_vehicle) {
                if (!$additional_vehicle->sync_id) {
                    if ($guest_vehicles) {
                        $additional_vehicle_array = $additional_vehicle->toArray();
                        $additional_vehicle_array['id'] = "additional-$index";
                        $guest_vehicles[] = $additional_vehicle_array;
                    } else {
                        $guest_vehicles = [$additional_vehicle];
                    }
                } else {
                    $previous_data_guest_vehicles = $previous_security_check_data->guest_vehicles;

                    foreach ($previous_data_guest_vehicles as $key => $previous_data_guest_vehicle_id) {
                        if ($previous_data_guest_vehicle_id == "additional-$index") {
                            $previous_data_guest_vehicles[$key] = $additional_vehicle->sync_id;
                        }
                    }

                    $previous_security_check_data->guest_vehicles = $previous_data_guest_vehicles;
                }
            }

            $booking_kiosk->guest_vehicles = $guest_vehicles;
        }

        if ($vehicles_update) {
            $guest_vehicles = $booking_kiosk['guest_vehicles'];

            foreach ($vehicles_update as $vehicle_update) {
                if (!$vehicle_update->sync_id) {
                    foreach ($guest_vehicles as $guest_vehicle) {
                        if ($guest_vehicle->id == $vehicle_update->id) {
                            $guest_vehicles->model = $vehicle_update->model;
                            $guest_vehicles->plate_number = $vehicle_update->plate_number;
                        }
                    }
                }
            }

            $booking_kiosk->guest_vehicles = $guest_vehicles;
        }

        // Update kiosk display
        ScanEvent::dispatch('/welcome', '', [
            'status' => 'OK',
            'users' => '',
            'layout' => '',
            'booking' => $booking_kiosk,
            'balance' => Invoice::where('booking_reference_number', $pass['booking_reference_number'])->sum('balance'),
            'details' => $details,
            'pass' => $pass,
            // 'tap_id' => $tap->id,
            'previous_security_check_data' => $previous_security_check_data
        ]);

        $scanLogService->write_log([
            $request->code,
            'OK',
            'Scan successful!',
            Carbon::now()
        ]);

        // store request data in cache
        // Cache::put('kiosk_data', $request->all());

        return response()->json([
            'status' => 'OK',
            'status_message' => "Scan successful!",
            // 'data' => [
            //     'booking' => Booking::where('reference_number', $pass['booking_reference_number'])->with(['guests', 'guest_vehicles', 'inclusions', 'customer'])->first(),
            //     'details' => $details,
            //     'pass' => $pass
            // ]
        ], 200);
    }
}
