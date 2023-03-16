<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\BookingTag;
use App\Models\Customer;
use App\Models\Guest;
use App\Models\GuestUpdate;
use App\Models\GuestVehicle;
use App\Models\GuestVehicleInsert;
use App\Models\GuestVehicleUpdate;
use App\Models\Inclusion;
use App\Models\Invoice;
use App\Models\Pass;
use App\Models\PassUpdate;
use Illuminate\Support\LazyCollection;
use App\Models\Tap;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CloudManualSync
{
    public function login()
    {

        $response = Http::post(config('app.cloud_sync.url') . '/api/login', [
            'email' => config('app.cloud_sync.login_email'),
            'password' => config('app.cloud_sync.login_password'),
            'portal' => config('app.cloud_sync.portal'),
            'login_type' => config('app.cloud_sync.login_type'),
        ]);

        $decoded_response = json_decode($response);



        if ($response->ok()) {
            Cache::put('cloudToken', $decoded_response->token);
        } else {
            Log::error('Cloud sync error: ' . json_encode($decoded_response->error));
            return response()->json(['error' => 401, 'message' => $decoded_response->error], 401);
        }

        return Cache::get('cloudToken');
    }

    public function login_token()
    {
        return Cache::get('cloudToken') ?? $this->login();
    }

    public function fetch_table_data()
    {
<<<<<<< HEAD
        $perDay = Carbon::now()->format('d');
        $filter_for_inserts_updates = [
            'bookings' => [
                'id' => Booking::where('created_at', '=', $perDay)->cursor()->pluck('id'),
                'updated_at' => Booking::cursor()->pluck('updated_at'),
            ],
            'booking_tags' => [
                'id' => BookingTag::withTrashed()->cursor()->pluck('id'),
                'updated_at' => BookingTag::withTrashed()->cursor()->pluck('updated_at'),
            ],
            'customers' => [
                'id' => Customer::withTrashed()->latest()->cursor()->pluck('id'),
                'updated_at' => Customer::withTrashed()->cursor()->pluck('updated_at'),
            ],
            'guests' => [
                'id' => Guest::withTrashed()->cursor()->pluck('id'),
                'updated_at' => Guest::withTrashed()->cursor()->pluck('updated_at'),
=======
        $perMonth = Carbon::now()->format('F');
        $filter_for_inserts_updates = [
            'bookings' => [
                'id' => Booking::whereMonth('created_at', $perMonth)->cursor()->pluck('id'),
                'updated_at' => Booking::whereMonth('updated_at', $perMonth)->cursor()->pluck('updated_at'),
            ],
            'booking_tags' => [
                'id' => BookingTag::withTrashed()->whereMonth('created_at', $perMonth)->cursor()->pluck('id')->chunk(100),
                'updated_at' => BookingTag::withTrashed()->whereMonth('updated_at', $perMonth)->cursor()->pluck('updated_at'),
            ],
            'customers' => [
                'id' => Customer::withTrashed()->whereMonth('created_at', $perMonth)->cursor()->pluck('id'),
                'updated_at' => Customer::withTrashed()->whereMonth('updated_at', $perMonth)->cursor()->pluck('updated_at'),
            ],
            'guests' => [
                'id' => Guest::withTrashed()->whereMonth('created_at', $perMonth)->cursor()->pluck('id'),
                'updated_at' => Guest::withTrashed()->whereMonth('updated_at', $perMonth)->cursor()->pluck('updated_at'),
>>>>>>> 7f31849f5b9fc7eadea245ab2dc4cf9632a4254e
                'update_data' => GuestUpdate::where('sync_id', 0)
                    ->get()
                    ->map(function ($item) {
                        return collect($item)->except(['sync_id', 'created_at'])->all();
                    }),
            ],
            'guest_vehicles' => [
<<<<<<< HEAD
                'id' => GuestVehicle::withTrashed()->cursor()->pluck('id'),
                'updated_at' => GuestVehicle::withTrashed()->cursor()->pluck('updated_at'),
=======
                'id' => GuestVehicle::withTrashed()->whereMonth('created_at', $perMonth)->cursor()->pluck('id'),
                'updated_at' => GuestVehicle::withTrashed()->whereMonth('updated_at', $perMonth)->cursor()->pluck('updated_at'),
>>>>>>> 7f31849f5b9fc7eadea245ab2dc4cf9632a4254e
                'update_data' => GuestVehicleUpdate::where('sync_id', 0)
                    ->get()
                    ->map(function ($item) {
                        return collect($item)->except(['sync_id', 'created_at'])->all();
                    }),
                'insert_data' => GuestVehicleInsert::where('sync_id', 0)
                    ->get()
                    ->map(function ($item) {
                        return collect($item)->except(['sync_id'])->all();
                    }),
            ],
            'inclusions' => [
<<<<<<< HEAD
                'id' => Inclusion::withTrashed()->cursor()->pluck('id'),
                'updated_at' => Inclusion::withTrashed()->cursor()->pluck('updated_at'),
            ],
            'invoices' => [
                'id' => Invoice::withTrashed()->cursor()->pluck('id'),
                'updated_at' => Invoice::withTrashed()->cursor()->pluck('updated_at'),
            ],
            'passes' => [
                'id' => Pass::withTrashed()->latest()->cursor()->pluck('id'),
                'updated_at' => Pass::withTrashed()->cursor()->pluck('updated_at'),
=======
                'id' => Inclusion::withTrashed()->whereMonth('created_at', $perMonth)->cursor()->pluck('id'),
                'updated_at' => Inclusion::withTrashed()->whereMonth('updated_at', $perMonth)->cursor()->pluck('updated_at'),
            ],
            'invoices' => [
                'id' => Invoice::withTrashed()->whereMonth('created_at', $perMonth)->cursor()->pluck('id'),
                'updated_at' => Invoice::withTrashed()->whereMonth('updated_at', $perMonth)->cursor()->pluck('updated_at'),
            ],
            'passes' => [
                'id' => Pass::withTrashed()->whereMonth('created_at', $perMonth)->cursor()->pluck('id'),
                'updated_at' => Pass::withTrashed()->whereMonth('updated_at', $perMonth)->cursor()->pluck('updated_at'),
>>>>>>> 7f31849f5b9fc7eadea245ab2dc4cf9632a4254e
                'update_data' => PassUpdate::where('sync_id', 0)
                    ->get()
                    ->map(function ($item) {
                        return collect($item)->except(['sync_id', 'created_at'])->all();
                    }),
            ],
            'taps' => [
                'insert_data' => Tap::where('sync_id', 0)
                    ->get()
                    ->map(function ($item) {
                        return collect($item)->except(['sync_id', 'scan'])->all();
                    }),
            ]
        ];

        $login_token = $this->login_token();
<<<<<<< HEAD
        // dd($login_token);
=======

>>>>>>> 7f31849f5b9fc7eadea245ab2dc4cf9632a4254e
        $query_url = config('app.cloud_sync.url') . '/api/auto-gate/gate-sync';
        $response = Http::withToken($login_token)->post($query_url, [
            'filter_for_inserts_updates' => json_encode($filter_for_inserts_updates),
        ]);


<<<<<<< HEAD
        // dd($response);
=======

>>>>>>> 7f31849f5b9fc7eadea245ab2dc4cf9632a4254e
        if ($response->ok()) {
            return $response->json();
        } else {
            Log::error('Cloud sync error in fetch_table_data: ' . json_encode($response->body()));
            return false;
        }
    }

    public function sync_table()
    {

        $response = $this->fetch_table_data();

        if (!$response) {
            return response()->json(['error' => 'Unknown error occured while syncing table']);
        }

        DB::transaction(function () use ($response) {
            $create_data = function ($key, $model) use ($response) {
                $collection = collect($response['data'][$key]);

                $collection->map(function ($item) use ($model) {

                    $collection = collect($item);
                    if (method_exists($model, 'trashed')) {
                        $model::withTrashed()->upsert(
                            $collection->all(),
                            $collection->only(['id'])->all(),
                            $collection->except(['id'])->all(),
                        );
                    } else {
                        $model::upsert(
                            $collection->all(),
                            $collection->only(['id'])->all(),
                            $collection->except(['id'])->all(),

                        );
                    }

                    return $item;
                })->chunk(100);
            };
            $update_data = function ($key, $model) use ($response) {
                $collection = LazyCollection::times($response['data'][$key]);

                $collection->map(function ($item) use ($model) {
                    $model::find($item['local_id'])
                        ->update(['sync_id' => $item['cloud_id']]);

                    return $item;
                });
            };

            $create_data('bookings', Booking::class);
            $create_data('booking_tags', BookingTag::class);
            $create_data('customers', Customer::class);
            $create_data('guests', Guest::class);
            $update_data('guest_updates', GuestUpdate::class);
            $create_data('guest_vehicles', GuestVehicle::class);
            $update_data('guest_vehicle_updates', GuestVehicleUpdate::class);
            $update_data('guest_vehicle_inserts', GuestVehicleInsert::class);
            $create_data('inclusions', Inclusion::class);
            $create_data('invoices', Invoice::class);
            $create_data('passes', Pass::class);
            $update_data('pass_updates', PassUpdate::class);
            $update_data('taps', Tap::class);
        });

        Cache::put('db_last_sync_date', Carbon::now());

        return $response;
    }

    public function update_guest_status($guest_id, $status)
    {
        $login_token = $this->login_token();
        $query_url = config('app.cloud_sync.url') . '/api/booking/guest/update/status';
        $response = Http::withToken($login_token)->put($query_url, [
            'guest_id' => $guest_id,
            'guest_status' => $status,
        ]);

        if ($response->ok()) {
            $data = $response->json();
            GuestUpdate::find($data['id'])->update(['sync_id' => $data['id']]);
            DB::table('guests')->where('id', $data['id'])->update(['status' => $data['status']]);
            return true;
        } else {
            Log::error('Cloud sync error in update_guest_status: ' . json_encode($response->body()));
            return false;
        }
    }
}
