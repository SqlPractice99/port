<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{

    // public function __construct()
    // {
    //     $this->middleware('auth:api', ['except' => ['login','register']]);
    // }

    public function display()
    {
        $user = User::all();

        return response()->json([
            'status' => 'Success',
            'data' => $user
            ]
        );
    }

    public function unauthorized(){
        return response()->json([
            'status'=>'Error',
            'message'=>'Unauthorized',
        ],200);
    }

    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $credentials = $request->only('username', 'password');

        $token = Auth::attempt($credentials);

        if (!$token) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 401);
        }

        $user = Auth::user();
        $user -> token = $token;

        return response()->json([
                'status' => 'Success',
                'data' => $user,
                'token' => $token,
        ])->cookie('token', $token, 60, null, null, true, true); // httpOnly and secure
    }

    // public function register(Request $request){
    //     $request->validate([
    //         'firstName' => 'required|string|max:255',
    //         'lastName' => 'required|string|max:255',
    //         'username' => 'required|string|max:255|unique:users',
    //         'password' => 'required|string|min:6',
    //     ]);

    //     $user = new User;
    //     $user->first_name = $request-> firstName;
    //     $user->last_name = $request-> lastName;
    //     $user->username = $request-> username;
    //     $user->password = Hash::make($request->password);
    //     $user->admin = 1;
    //     $user->save();

    //     $token = Auth::login($user);
    //     $user->token = $token;

    //     return response()->json([
    //         'status' => 'Success',
    //         'message' => 'User created successfully',
    //         'data' => $user,
    //         ]
    //     );
    // }

    public function logout()
    {
        Auth::logout();
        return response()->json([
            'status' => 'success',
            'message' => 'Successfully logged out',
        ]);
    }

    public function refresh()
    {
        $user = Auth::user();
        $user->token = Auth::refresh();

        return response()->json([
            'status'=>'success',
            'data'=>$user
        ]);
    }

}