<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register (Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|min:6',
        ]);

        $user = User::create([
            ...$data,
            'password' => bcrypt($data['password'])
        ]);
        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json(['token' => $token], 201);
    }

    public function login (Request $request)
    {
        $data = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required'
        ]);

        if (!Auth::attempt($data)) {
            return response()->json(['message' => 'identifiants invalide'], 401);
        }
        $token = auth()->user()->createToken('auth_token')->plainTextToken;
        return response()->json(['token' => $token], 200);
    }

}
