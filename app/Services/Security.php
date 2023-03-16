<?php

namespace App\Services;

use App\Models\Guest;
use App\Models\GuestUpdate;
use App\Jobs\OfflineValidation;
use App\Models\Transaction;

class Security
{

    public function ensure($request, $cloudService, $securityCheck)
    {
        // update checked guests status
        $checklists = $request->checklists;

        $guests_status = [];
        $status = 'arriving';
        collect($checklists['guests'])->map(function ($checked, $guestID) use ($cloudService, &$guests_status, $status) {

            if ($checked) {
                $guestUpdate = Guest::findOrFail($guestID);
                if ($guestUpdate->status === 'checked_in') {
                    GuestUpdate::updateOrCreate(
                        ['id' => $guestID],
                        ['status' => 'checked-in']
                    );
                    $status = 'checked-in';
                    OfflineValidation::dispatch($cloudService, $guestID, $status);
                    $guests_status[$guestID] = $status;
                }
                if ($guestUpdate->status === 'arriving' || $guestUpdate->status === 'on_premise') {
                    GuestUpdate::updateOrCreate(
                        ['id' => $guestID],
                        ['status' => 'on_premise']
                    );

                    $status = 'on_premise';
                    OfflineValidation::dispatch($cloudService, $guestID, $status);
                    // $cloudService->update_guest_status($guestID, 'on_premise');

                    $guests_status[$guestID] = $status;
                }
            } else {
                $guests_status[$guestID] = 'arriving';
            }
        });

        Transaction::create(
            [
                'security_check' => $securityCheck,
                'guests_status' => $guests_status,
            ]
        );

        return;
    }

    public function onhold($securityCheck)
    {
        Transaction::create(
            [
                'security_check' => $securityCheck,
                'guests_status' => 'on-hold',
            ]
        );
        return;
    }
}
