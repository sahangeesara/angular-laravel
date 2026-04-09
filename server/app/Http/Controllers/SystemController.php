<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\System;

class SystemController extends Controller
{
    public function getByUserEmail(Request $request)
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $system = System::where('email', $user->email)->first();

        if (!$system) {
            return response()->json(['message' => 'No system record found for this user'], 404);
        }

        return response()->json($system);
    }
}

