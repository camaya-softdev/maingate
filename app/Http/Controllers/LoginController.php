<?php

namespace App\Http\Controllers;

use App\Events\LogoutEvent;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(LoginRequest $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            abort(403, 'Invalid Email or Password');
            return;
        }

        $userToken = $user->createToken('api')->plainTextToken;
        list($userTokenId, $userTokenValue) = explode('|', $userToken);

        $logoutExistingTokens = $user->tokens->filter(function ($value, $key) use ($userTokenId) {
            return $value->id != $userTokenId;
        })->pluck('id')->all();

        if ($logoutExistingTokens) {
            LogoutEvent::dispatch($logoutExistingTokens);

            $user->tokens->each(function ($token) use ($logoutExistingTokens) {
                if (in_array($token->id, $logoutExistingTokens)) {
                    $token->delete();
                }
            });
        }

        return response()->json([
            'token' => $userToken,
            'user' => $user,
            'loggedInOtherDevices' => count($user->tokens) > 1,
        ]);
    }
}
