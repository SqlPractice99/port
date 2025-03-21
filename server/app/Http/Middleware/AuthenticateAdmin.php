<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthenticateAdmin
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        // if ($user && $user->admin == 1) {
            return $next($request);
        // }

        // if (!Auth::check() || Auth::user()->admin !== 1) {
        //     return response()->json(['message' => 'Unauthorized'], 403);
        // }

        return response()->json(['message' => 'Unauthorized'], 403);
    }
}