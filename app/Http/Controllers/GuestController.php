<?php

namespace App\Http\Controllers;

use App\Models\Pass;
use Carbon\Carbon;
use Illuminate\Http\Request;

class GuestController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        /**
         * Expecting GET parameters or resolve to default
         * @param date String (default: date today in format YYYY-MM-DD)
         * @param operator String (default: =)
         */
        $filter_date = $request->date ?? Carbon::now()->toDateString();
        $filter_operator = $request->operator ?? '=';
        $date_column = 'usable_at';
        $interface = 'main_gate';

        return Pass::whereJsonContains('interfaces', $interface)
            ->whereDate($date_column, $filter_operator, $filter_date)
            ->join('bookings', 'reference_number', '=', 'booking_reference_number')
            ->where(function($query) {
                $query->where('bookings.status', 'confirmed')
                ->orWhere('bookings.status', 'pending');
            })
            ->with(['booking.customer', 'booking.tags', 'guests', 'guest_vehicles', 'security_check'])
            ->get();
    }
}
