<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\CustomChecklist;
use App\Models\Invoice;
use App\Models\SecurityCheck;
use App\Models\Tap;
use Illuminate\Http\Request;

class TapController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        $taps = Tap::orderBy('tap_datetime', 'DESC')
            ->with(['security_check'])
            ->simplePaginate($request->limit);

        $taps->getCollection()
            ->transform(function ($item) {
                if (!isset($item->security_check->booking_reference_number)) {
                    return $item;
                }

                $item->security_check->booking = Booking::where('reference_number', $item->security_check->booking_reference_number)
                    ->with(['guests', 'guest_vehicles', 'inclusions', 'customer', 'tags'])
                    ->first();
                $item->security_check->balance = Invoice::where('booking_reference_number', $item->security_check->reference_number)->sum('balance');
                $custom_checklist_ids = collect($item->security_check->checklists['customChecklists'])->keys();
                $item->security_check->custom_checklists = CustomChecklist::withTrashed()->find($custom_checklist_ids);
                return $item;
            });

        return $taps;
    }
}
