<?php

namespace App\Services;

use App\Models\Autogate;
use App\Models\BackgroundImage;
use App\Models\Billing;
use App\Models\Message;
use App\Models\Card;
use App\Models\User;
use App\Models\Designee;
use App\Models\Lot;
use App\Models\Template;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CloudHoaService
{
    public function login()
    {

        $response = Http::post('https://apidevhoaportal.camayacoast.com/api/login/', [
            'email' => 'admin@camayacoast.com',
            'password' => 'secretCamaya',
        ]);

        $decoded_response = json_decode($response);

        if ($response->ok()) {
            Cache::put('cloudHOAToken', $decoded_response->token);
        } else {
            Log::error('Cloud sync error: ' . json_encode($decoded_response->error));
            return response()->json(['error' => 401, 'message' => $decoded_response->error], 401);
        }

        return Cache::get('cloudHOAToken');
    }

    public function login_token()
    {
        return Cache::get('cloudHOAToken') ?? $this->login();
    }

    public function fetch_table_data()
    {

        $filter_for_inserts_updates = [
            'autogates' => [
                'id' => Autogate::max('id'),
                'updated_at' => Autogate::max('updated_at'),
            ],
            'messages' => [
                'id' => Message::max('id'),
                'updated_at' => Message::max('updated_at'),
            ],
            'templates' => [
                'id' => Template::max('id'),
                'updated_at' => Template::max('updated_at'),
            ],
            'cards' => [
                'id' => Card::max('id'),
                'updated_at' => Card::max('updated_at'),
            ],
            'designees' => [
                'id' => Designee::max('id'),
                'updated_at' => Designee::max('updated_at'),
            ],
            'users' => [
                'id' => User::max('id'),
                'updated_at' => User::max('updated_at'),
            ],
            'background_images' => [
                'id' => BackgroundImage::max('id'),
                'updated_at' => BackgroundImage::max('updated_at')
            ],
            'billings' => [
                'id' => Billing::max('id'),
                'updated_at' => Billing::max('updated_at')
            ],
            'lots' => [
                'id' => Lot::max('id'),
                'updated_at' => Lot::max('updated_at')
            ]
        ];

        $login_token = $this->login_token();

        $query_url = 'https://apidevhoaportal.camayacoast.com/api/autogate/hoa-gate-sync/';
        $response = Http::withToken($login_token)->post($query_url, [
            'filter_for_inserts_updates' => json_encode($filter_for_inserts_updates),
        ]);
        if ($response->ok()) {
            return $response->json();
        } else {
            Log::error($response . json_encode($response->body()));
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

                    $model::updateOrCreate(
                        $collection->only(['id'])->all(),
                        $collection->except(['id'])->all(),
                    );

                    return $item;
                });
            };

            $create_data('autogates', Autogate::class);
            $create_data('cards', Card::class);
            $create_data('users', User::class);
            $create_data('designees', Designee::class);
            $create_data('messages', Message::class);
            $create_data('templates', Template::class);
            $create_data('background_images', BackgroundImage::class);
            $create_data('lots', Lot::class);
            $create_data('billings', Billing::class);
        });

        Cache::put('db_last_sync_date', Carbon::now());

        return $response;
    }
}
