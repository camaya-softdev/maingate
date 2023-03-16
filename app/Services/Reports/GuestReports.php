<?php

namespace App\Services\Reports;

use Carbon\Carbon;
use App\Models\Pass;
use App\Models\Guest;

class GuestReports
{
    public function guest_counts($operators, $bookingType, $tagName)
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

        $guestCount = Guest::whereIn('booking_reference_number', $todays_guests_reference_numbers)
            ->with('booking')
            ->whereHas('booking', function ($query) use ($operators, $bookingType, $tagName) {
                $query->where('type', $bookingType)
                    ->where('mode_of_transportation', $operators, 'camaya_transportation')
                    ->with('tags')
                    ->whereHas('tags', function ($bookingTags) use ($tagName) {
                        $bookingTags->whereIn('name', $tagName)
                            ->orWhereIn('name', $tagName);
                    });
            })->where(function ($guest) {
                $guest->where('status', 'checked_in')
                    ->orWhere('status', 'on_premise');
            })->count();

        return $guestCount;
    }
}
