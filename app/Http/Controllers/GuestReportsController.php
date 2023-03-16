<?php

namespace App\Http\Controllers;

use App\Exports\GuestsReportDownloads;
use Maatwebsite\Excel\Facades\Excel;
use App\Services\Reports\GuestReports;

class GuestReportsController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */


    public function __invoke(GuestReports $reports)
    {
        return Excel::download(new GuestsReportDownloads($reports), 'guests_reports.xlsx');
    }
}
