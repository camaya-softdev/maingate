<?php

namespace App\Exports;


use Maatwebsite\Excel\Concerns\FromView;
use Illuminate\Contracts\View\View;
use App\Services\GuestReports;

class GuestsReportDownloads implements FromView
{
    /**
     * @return \Illuminate\Support\Collection
     */
    private $report;

    public function __construct($report)
    {
        $this->report = $report;
    }
    public function view(): View
    {
        $otherTags = [
            'ESLCC-AFV',
            'ESLCC-CSV',
            'Cvoucher',
            '1Bataan ITS - Employee',
            'DEV1- Employee',
            'ESLCC - Employee',
            'ESLCC - Employee/Guest',
            'ESTLC - Employee',
            'ESTVC - Employee',
            'Orion Sky - Employee',
            'People Plus - Employee',
            'SLA - Employee',
            'DS18 - Employee',
            'DS18-Events/Guests',
            'DEV1-Events/Guests',
            'ESLCC-GC',
            'ESLCC-Guest',
            'ESLCC-Events/Guests',
            'ESLCC-FOC',
            'ESTLC - Guest',
            'ESTVC-GC',
            'ESTVC - Guest',
            'ESTVC-Events/Guests',
            'Golf Member',
            'House Use',
            'Magic Leaf - Events/Guests',
            'TA - Rates',
            'Orion Sky',
            'Orion Sky - Guest',
            'SLA - Events/Guests',
            'VIP Guest'
        ];
        $commercialTags = [
            'Commercial',
            'Commercial - Admin',
            'Commercial - Corre',
            'Commercial - Golf',
            'Commercial - Promo',
            'Commercial - walk - in',
            'Commercial - (Website)',
            'Corporate FIT',
            'Corporate Sales',
            'DTT - Walk in',
            'OTA - Klook'
        ];
        $realEstatetags = [
            'ESLCC - Employee',
            'ESLCC - Sales Agent',
            'ESLCC - Sales Client',
            'RE - Golf',
            'SDMB - Sales Director Marketing Budget',
            'Thru Agent - Paying',
            'Walk-in- Sales Agent',
            'Walk-in - Sales Client',
            'ESLCC - HOA',
            'HOA',
            'HOA - Access Stub',
            'HOA - AF Unit Owner',
            'HOA - Client',
            'HOA - Gate Access',
            'HOA - Golf',
            'HOA - Member',
            'HOA - Paying Promo',
            'HOA - Voucher',
            'HOA - walk - in',
            'HOA - Sales Director Marketing Budget',
            'Property owner (Non-member)',
            'Property owner (HOA-member)',
            'Property owner (Dependants)',
            'Property owner (Guests)'
        ];

        $reDtLandCount = $this->report->guest_counts('!=', 'DT', $realEstatetags);
        $realOnLandCount =  $this->report->guest_counts('!=', 'ON', $realEstatetags);
        $realDtFerrydCount = $this->report->guest_counts('=', 'DT', $realEstatetags);
        $realOnFerryCount = $this->report->guest_counts('=', 'ON', $realEstatetags);

        $comDtLandCount =  $this->report->guest_counts('!=', 'DT', $commercialTags);
        $comOnLandCount =  $this->report->guest_counts('!=', 'ON', $commercialTags);
        $comDtFerryCount =  $this->report->guest_counts('=', 'DT', $commercialTags);
        $comOnFerryCount =  $this->report->guest_counts('=', 'ON', $commercialTags);

        $othersDtLandCount = $this->report->guest_counts('!=', 'DT', $otherTags);
        $othersOnLandCount = $this->report->guest_counts('!=', 'ON', $otherTags);
        $othersDtFerryCount = $this->report->guest_counts('=', 'DT', $otherTags);
        $othersOnFerryCount = $this->report->guest_counts('=', 'ON', $otherTags);

        $dtLandSubTotal =  $reDtLandCount + $comDtLandCount +  $othersDtLandCount;
        $dtFerrySubTotal = $realDtFerrydCount + $comDtFerryCount + $othersDtFerryCount;
        $onLandSubTotal = $realOnLandCount + $comOnLandCount +  $othersOnLandCount;
        $onFerrySubtotal = $realOnFerryCount +  $comOnFerryCount + $othersOnFerryCount;
        return view('guests', compact(
            'reDtLandCount',
            'realOnLandCount',
            'realDtFerrydCount',
            'realDtFerrydCount',
            'realOnFerryCount',
            'comDtLandCount',
            'comOnLandCount',
            'comDtFerryCount',
            'comOnFerryCount',
            'othersDtLandCount',
            'othersOnLandCount',
            'othersDtFerryCount',
            'othersOnFerryCount',
            'dtLandSubTotal',
            'dtFerrySubTotal',
            'onLandSubTotal',
            'onFerrySubtotal'
        ));
    }
}
