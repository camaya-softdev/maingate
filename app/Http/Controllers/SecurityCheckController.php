<?php

namespace App\Http\Controllers;

use App\Events\ScanEvent;
use App\Http\Requests\SecurityCheckRequest;
use App\Jobs\OfflineValidation;
use App\Models\Booking;
use App\Models\CustomChecklist;
use App\Models\Guest;
use App\Models\GuestUpdate;
use App\Models\Invoice;
use App\Models\SecurityCheck;
use App\Models\Transaction;
use App\Services\CloudService;
use App\Services\Security;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class SecurityCheckController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    protected $security;
    public function __construct(Security $security)
    {
        $this->security = $security;
    }
    public function index()
    {
        return SecurityCheck::whereNotIn('status', ['validated', 'invalid-code', 'voided'])->get()->map(function ($item, $key) {
            $item->booking = Booking::where('reference_number', $item->booking_reference_number)
                ->with(['guests', 'guest_vehicles', 'inclusions', 'customer', 'tags'])
                ->first();
            $item->transaction = Transaction::where('security_check->tap_id', $item->tap_id)->first();
            $item->balance = Invoice::where('booking_reference_number', $item->reference_number)->sum('balance');
            $custom_checklist_ids = collect($item->checklists['customChecklists'])->keys();
            $item->custom_checklists = CustomChecklist::withTrashed()->find($custom_checklist_ids);
            return $item;
        });
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Request\CustomChecklistRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(SecurityCheckRequest $request, CloudService $cloudService, $page = '')
    {
        $securityCheck = SecurityCheck::create($request->validated());

        if ($securityCheck->status === 'on-hold') {
            $this->security->onhold($securityCheck);

            if ($page) {
                ScanEvent::dispatch($page);
                Cache::forget('kiosk_data');
            }
            return [
                // 'success' => (new SecurityCheck)->fill($request->validated())->save(),
                'success' => true,
            ];
        } else {
            if ($page) {
                ScanEvent::dispatch($page);
                Cache::forget('kiosk_data');
            }
            // update checked guests status
            $this->security->ensure($request, $cloudService, $securityCheck);

            return [
                // 'success' => (new SecurityCheck)->fill($request->validated())->save(),
                'success' => true,
            ];
        }

        //for tablet and mobile phone qrcode scanner onhold
        if ($page = 'scanner-holding-area') {
            $this->security->onhold($securityCheck);

            if ($page) {

                Cache::forget('kiosk_data');
                return;
            }
            return [
                // 'success' => (new SecurityCheck)->fill($request->validated())->save(),
                'success' => true,
            ];
        }


        //for tablet and mobile phone qrcode scanner valid
        if ($page = 'scanner-valid-code') { {
                if ($page) {

                    Cache::forget('kiosk_data');
                    return;
                }
                // update checked guests status
                $this->security->ensure($request, $cloudService, $securityCheck);

                return [
                    // 'success' => (new SecurityCheck)->fill($request->validated())->save(),
                    'success' => true,
                ];
            }
        }
        return [
            'success' => false
        ];

        // Transaction::create(
        //     [
        //         'security_check' => $securityCheck,
        //         'guests_status' => $guests_status,
        //     ]
        // );
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Request\CustomChecklistRequest  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(SecurityCheckRequest $request, $id)
    {
        $success = SecurityCheck::find($id)->update($request->validated());

        if ($success) {
            $guests_status = [];

            if (SecurityCheck::find($id)->status === 'validated') {
                // get guests status
                $checklists = SecurityCheck::find($id)->checklists;
                if ($checklists) {
                    collect($checklists['guests'])->map(function ($checked, $guestID) use (&$guests_status) {
                        if ((bool) $checked) {
                            $guests_status[$guestID] = 'on_premise';
                        } else {
                            $guests_status[$guestID] = 'arriving';
                        }

                        return $checked;
                    });
                }
            }

            Transaction::create(
                [
                    'security_check' => SecurityCheck::find($id),
                    'guests_status' => $guests_status,
                ]
            );

            return [
                'success' => true
            ];
        }

        return [
            'success' => false
        ];
    }

    public function clearScreen()
    {
        ScanEvent::dispatch("/guest");
        Cache::forget('kiosk_data');
        return [
            'success' => true
        ];
    }
}
