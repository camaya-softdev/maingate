<?php

namespace App\Exports;

use App\Models\Guest;
use Maatwebsite\Excel\Concerns\FromView;
use Illuminate\Contracts\View\View;
use Carbon\Carbon;
use App\Models\Pass;
use App\Services\GuestReports;

class GuestsReports implements FromView
{
    /**
     * @return \Illuminate\Support\Collection
     */

    private $reports;

    public function __construct(GuestReports $reports)
    {
        $this->reports = $reports;
    }

    public function view(): View
    {
        $filter_date =  Carbon::now()->toDateString();
        $filter_operator = '=';
        $date_column = 'usable_at';
        $interface = 'main_gate';


        $todays_guests_reference_numbers = Pass::whereJsonContains('interfaces', $interface)
            ->whereDate($date_column, $filter_operator, $filter_date)
            ->join('bookings', 'reference_number', '=', 'booking_reference_number')
            ->where(function ($query) {
                $query->where('bookings.status', 'confirmed')
                    ->orWhere('bookings.status', 'pending');
            })

            ->get()
            ->pluck('reference_number');

        $realEstate = Guest::whereIn('booking_reference_number', $todays_guests_reference_numbers)
            ->join('bookings', 'reference_number', '=', 'booking_reference_number')
            ->where(function ($query) {
                $query->join('booking_tags', 'booking_id', 'id')
                    ->where(function ($bookingTags) {
                        $bookingTags->where('name', '=', 'ESLCC - Employee')
                            ->orWhere('name', '=', 'ESLCC - Sales Agent')
                            ->orWhere('name', '=', 'ESLCC - Sales Client')
                            ->orWhere('name', '=', 'RE - Golf')
                            ->orWhere('name', '=', 'SDMB - Sales Director Marketing Budget')
                            ->orWhere('name', '=', 'Thru Agent - Paying')
                            ->orWhere('name', '=', 'Walk-in- Sales Agent')
                            ->orWhere('name', '=', 'Walk-in - Sales Client')
                            ->orWhere('name', '=', 'ESLCC - HOA')
                            ->orWhere('name', '=', 'HOA')
                            ->orWhere('name', '=', 'HOA - Access Stub')
                            ->orWhere('name', '=', 'HOA - AF Unit Owner')
                            ->orWhere('name', '=', 'HOA - Client')
                            ->orWhere('name', '=', 'HOA - Gate Access')
                            ->orWhere('name', '=', 'HOA - Golf')
                            ->orWhere('name', '=', 'HOA - Member')
                            ->orWhere('name', '=', 'HOA - Paying Promo')
                            ->orWhere('name', '=', 'HOA - Voucher')
                            ->orWhere('name', '=', 'HOA - walk - in')
                            ->orWhere('name', '=', 'HOA - Sales Director Marketing Budget')
                            ->orWhere('name', '=', 'Property owner (Non-member)')
                            ->orWhere('name', '=', 'Property owner (HOA-member)')
                            ->orWhere('name', '=', 'Property owner (Dependants)')
                            ->orWhere('name', '=', 'Property owner (Guests)');
                    });
            })->count();
        dd($realEstate);
        return $realEstate;
    }
}
