<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\HoaTransaction;
use App\Models\User;

class TransactionHoaController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        $transactionHoa = HoaTransaction::with('user', 'user.card', 'user.autogate', 'user.designee')->orderBy('id', 'DESC')->simplePaginate($request->limit);
        return $transactionHoa;
    }
}
