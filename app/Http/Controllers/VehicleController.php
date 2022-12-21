<?php

namespace App\Http\Controllers;

use App\Http\Requests\PostVehicleRequest;
use App\Http\Requests\PutVehicleRequest;
use App\Models\GuestVehicleInsert;
use App\Models\GuestVehicleUpdate;
use Illuminate\Http\Request;

class VehicleController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(PostVehicleRequest $request)
    {
        return [
            'success' => (new GuestVehicleInsert)->fill($request->validated())->save(),
            // 'success' => true,
        ];
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(PutVehicleRequest $request, $booking_reference_number)
    {
        if ($booking_reference_number) {
            $guests_vehicles = GuestVehicleInsert::where('booking_reference_number', $booking_reference_number)
                ->orderBy('id')
                ->get();

            $index = str_replace('additional-', '', $request->id);

            foreach ($guests_vehicles as $key => $vehicle) {
                if ($index == $key) {
                    if ($vehicle->sync_id) {
                        $data = [
                            'id' => $vehicle->sync_id,
                            'model' =>  $request->model,
                            'plate_number' => $request->plate_number,
                        ];

                        $success = (new GuestVehicleUpdate())->fill($data)->save();
                    } else {
                        $success = (bool) GuestVehicleUpdate::find($vehicle->id)->update([
                            'model' =>  $request->model,
                            'plate_number' => $request->plate_number,
                        ]);
                    }
                }
            }
        } else {
            $success = (new GuestVehicleUpdate())->fill($request->validated())->save();
        }

        return [
            'success' => $success,
            // 'success' => true,
        ];
    }
}
