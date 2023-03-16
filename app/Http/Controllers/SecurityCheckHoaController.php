<?php

namespace App\Http\Controllers;

use App\Models\HoaTransaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use App\Events\ScanEvent;
use App\Models\Lot;
use App\Models\Billing;
use Carbon\Carbon;

class SecurityCheckHoaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return HoaTransaction::orderBy('id', 'DESC')->get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, $page = '')
    {

        $securityCheck = $request;
        if ($securityCheck->status === 'on-hold') {
            HoaTransaction::create([
                'status' => $securityCheck->status,
                'code' => $securityCheck->code,
                'user_id' => $securityCheck->user_id
            ]);

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
                $user = User::with('designee',  'autogate.template', 'autogate.template.background')
                    ->with(['card' => function ($cardQ) use ($request) {
                        $cardQ->where('hoa_rfid_num', '=', $request->code)
                            ->where('hoa_rfid_reg_status', '=', 1)->first();
                    }])
                    ->whereHas('card', function ($q) use ($request) {
                        $q->where('hoa_rfid_reg_status', '=', 1)->where('hoa_rfid_num', '=', $request->code);
                    })->first();

                $lot = Lot::where('user_id', $user->id)->where('hoa_subd_lot_default', 1)->first();
                $billing  = Billing::where('lot_id', $lot->id)->latest()->first();
                $page = '/valid-code-hoa';
                ScanEvent::dispatch($page, '', [
                    'users' => $user,
                    'billing' => $billing,
                    'lot' => $lot
                ]);
                Cache::forget('kiosk_data');
            }


            HoaTransaction::create([
                'status' => $securityCheck->status,
                'code' => $securityCheck->code,
                'user_id' => $securityCheck->user_id,
                'notes' => $securityCheck->notes
            ]);

            return [
                // 'success' => (new SecurityCheck)->fill($request->validated())->save(),
                'success' => true,
            ];
        }

        return [
            'success' => false
        ];
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\TransactionHoa  $transactionHoa
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\TransactionHoa  $transactionHoa
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\TransactionHoa  $transactionHoa
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
