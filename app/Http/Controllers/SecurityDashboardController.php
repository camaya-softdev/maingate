<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use App\Models\Autogate;
use App\Models\Pass;
use App\Models\SecurityCheck;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class SecurityDashboardController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        $filter_date = $request->date ?? Carbon::now()->toDateString();
        $filter_operator = $request->operator ?? '=';
        $date_column = 'usable_at';
        $interface = 'main_gate';
        $guests_today_total_count = 0;

        $todays_guests_reference_numbers = Pass::whereJsonContains('interfaces', $interface)
            ->whereDate($date_column, $filter_operator, $filter_date)
            ->join('bookings', 'reference_number', '=', 'booking_reference_number')
            ->where(function ($query) {
                $query->where('bookings.status', 'confirmed');
                // ->orWhere('bookings.status', 'pending');
            })

            ->get()
            ->pluck('reference_number');
        $guests_expected_count = count($todays_guests_reference_numbers);

        $guests_today_total_count = Guest::whereIn('booking_reference_number', $todays_guests_reference_numbers)
            ->count();

        $valid_guest_counter = 0;

        $total_hoa = Autogate::where(function ($startDateQuery) {
            $startDateQuery->where('hoa_autogate_start', '<', Carbon::today()->toDateString())
                ->orWhere('hoa_autogate_start', '=', Carbon::today()->toDateString());
        })->where(function ($endDateQuery) {
            $endDateQuery->where('hoa_autogate_end', '>', Carbon::today()->toDateString())
                ->orWhere('hoa_autogate_end', '=', Carbon::today()->toDateString());
        })->count();
        //total total on_premise
        Guest::select(['guests.id', 'guests.status'])
            ->whereIn('booking_reference_number', $todays_guests_reference_numbers)
            // ->where('guests.booking_reference_number', $item->booking_reference_number)
            //->join('passes', 'passes.guest_reference_number', '=', 'guests.reference_number')
            ->orderBy('id', 'desc')
            ->get()
            ->map(function ($guest) use (&$valid_guest_counter) {
                if (in_array($guest->status, ['on_premise'])) {
                    $valid_guest_counter++;
                }
            });
        $guests_validated_count = $valid_guest_counter;
        $entered_guest_counter = 0;
        //total checkedin
        Guest::select(['guests.id', 'guests.status'])
            ->whereIn('booking_reference_number', $todays_guests_reference_numbers)
            // ->where('guests.status', '===', 'checked_in')
            // ->where('guests.booking_reference_number', $item->booking_reference_number)
            //->join('passes', 'passes.guest_reference_number', '=', 'guests.reference_number')
            ->orderBy('guests.id', 'desc')
            ->get()
            ->map(function ($guest) use (&$entered_guest_counter) {
                if (in_array($guest->status, ['checked_in'])) {
                    $entered_guest_counter++;
                }
            });

        //total arriving
        $guests_not_entered_count = 0;
        Guest::select(['guests.id', 'guests.status'])
            ->whereIn('booking_reference_number', $todays_guests_reference_numbers)
            // ->where('guests.status', '===', 'checked_in')
            // ->where('guests.booking_reference_number', $item->booking_reference_number)
            //->join('passes', 'passes.guest_reference_number', '=', 'guests.reference_number')
            ->orderBy('guests.id', 'desc')
            ->get()
            ->map(function ($guest) use (&$guests_not_entered_count) {
                if (in_array($guest->status, ['arriving'])) {
                    $guests_not_entered_count++;
                }
            });

        //total no show
        $guests_no_show_count = 0;
        Guest::select(['guests.id', 'guests.status'])
            ->whereIn('booking_reference_number', $todays_guests_reference_numbers)
            // ->where('guests.status', '===', 'checked_in')
            // ->where('guests.booking_reference_number', $item->booking_reference_number)
            //->join('passes', 'passes.guest_reference_number', '=', 'guests.reference_number')
            ->orderBy('guests.id', 'desc')
            ->get()
            ->map(function ($guest) use (&$guests_no_show_count) {
                if (in_array($guest->status, ['no_show'])) {
                    $guests_no_show_count++;
                }
            });

        //total cancelled
        $guests_cancelled_count = 0;
        Guest::select(['guests.id', 'guests.status'])
            ->whereIn('booking_reference_number', $todays_guests_reference_numbers)
            // ->where('guests.status', '===', 'checked_in')
            // ->where('guests.booking_reference_number', $item->booking_reference_number)
            //->join('passes', 'passes.guest_reference_number', '=', 'guests.reference_number')
            ->orderBy('guests.id', 'desc')
            ->get()
            ->map(function ($guest) use (&$guests_cancelled_count) {
                if (in_array($guest->status, ['cancelled'])) {
                    $guests_cancelled_count++;
                }
            });

        $guests_entered_count = $entered_guest_counter;
        $guests_not_entered_count = $guests_not_entered_count;
        $guests_no_show_count = $guests_no_show_count;
        $guests_cancelled_count =  $guests_cancelled_count;
        $guests_today_total_count =  $guests_today_total_count -  $guests_no_show_count;
        // $guests_not_entered_count = $guests_expected_count - $guests_entered_count;

        $holding_area_guests_counter = 0;
        $holding_area_guests_counter = SecurityCheck::select('booking_reference_number')
            ->where('status', 'on-hold')
            ->count();
        $holding_area_guests_count = $holding_area_guests_counter;

        $guests_voided_count = SecurityCheck::select('booking_reference_number')
            ->where('status', 'voided')
            ->whereDate('created_at', Carbon::now()->toDateString())
            ->count();

        $last_sync_date = Cache::get('db_last_sync_date') ? Carbon::parse(Cache::get('db_last_sync_date')) : '';

        return [
            'success' => true,
            'data' => compact(
                'holding_area_guests_count',
                'guests_entered_count',
                'guests_expected_count',
                'guests_not_entered_count',
                'guests_validated_count',
                'guests_today_total_count',
                'guests_voided_count',
                'guests_no_show_count',
                'guests_cancelled_count',
                'last_sync_date',
                'total_hoa'
            )
        ];
    }
}
