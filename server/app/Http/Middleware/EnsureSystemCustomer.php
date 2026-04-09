<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureSystemCustomer
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth()->user();

        if (! $user || ! $user->is_customer || $user->customer_type !== 'system') {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Only system customers can access this resource.'], 403);
            }

            abort(403, 'Only system customers can access this page.');
        }

        return $next($request);
    }
}

