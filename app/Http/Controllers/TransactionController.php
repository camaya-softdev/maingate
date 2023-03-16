<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\CustomChecklist;
use App\Models\Invoice;
use App\Models\Tap;
use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        $transactions = Transaction::orderBy('id', 'DESC')
            ->simplePaginate($request->limit);

        $transactions->getCollection()
            ->transform(function ($item) {
                $item->tap = Tap::find($item->security_check['tap_id']);

                if (!isset($item->security_check['booking_reference_number'])) {
                    return $item;
                }

                $item->booking = Booking::where('reference_number', $item->security_check['booking_reference_number'])
                    ->with(['guests', 'guest_vehicles', 'inclusions', 'customer', 'tags'])
                    ->first();
                $item->balance = Invoice::where('booking_reference_number', $item->security_check['reference_number'])->sum('balance');
                $custom_checklist_ids = collect($item->security_check['checklists']['customChecklists'])->keys();
                $item->custom_checklists = CustomChecklist::withTrashed()->find($custom_checklist_ids);
                return $item;
            });

        return $transactions;
    }
}
