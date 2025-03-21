<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use Illuminate\Support\Facades\Crypt;

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

    public function debugAuth(Request $request)
{
    return response()->json([
        'user' => auth()->user(),
        'token' => $request->session()->token(),
        'authenticated' => auth()->check()
    ]);
}

    // In your controller or middleware
public function decryptToken(Request $request)
{
    // Get the CSRF token from the request headers
    $xsrfToken = $request->header('X-XSRF-TOKEN');

    // Decrypt the received token
    try {
        $decryptedToken = Crypt::decryptString($xsrfToken);
    } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
        // Handle decryption failure
        return response()->json(['error' => 'Invalid token'], 401);
    }

    // $tokenParts = explode("|", $decryptedToken);
    // $actualDecryptedToken = $tokenParts[1]; // The token after '|'

    $storedToken = $request->session()->token();
    // Return the tokens in the response
    return response()->json([
        'decryptedToken' => $decryptedToken,
        'storedToken' => $storedToken
    ]);
}



    public function login(Request $request)
    {

        // Log the CSRF token from the request header
        // Log::warning('CSRF Token: ');
    //    Log::warning('CSRF Token: ' . $request->header('X-XSRF-TOKEN'));

        // Log the CSRF token from the session (if available)
    //    Log::warning('Session CSRF Token: ' . csrf_token());

        $credentials = $request->validate([
            'username' => 'required',
            'password' => 'required'
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Regenerate session to prevent session fixation attacks
        $request->session()->regenerate();

        // ✅ Get authenticated user
        $user = Auth::user();

        // ✅ Generate Sanctum Token
        $token = $user->createToken('auth-token')->plainTextToken;

        // ✅ Return user + token
        return response()->json([
            'user' => $user,
            'token' => $token,
            'authenticated' => true
        ]);
    }

    public function logout(Request $request) {
        // Logout user from session-based authentication
        auth()->guard('web')->logout();
    
        // Invalidate the session
        $request->session()->invalidate();
    
        // Regenerate CSRF token
        $request->session()->regenerateToken();
    
        return response()->json(['message' => 'Logged out successfully']);
    }    

    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    // public function login(Request $request)
    // {
    //     $request->validate([
    //         'username' => 'required|string',
    //         'password' => 'required|string',
    //     ]);

    //     $credentials = $request->only('username', 'password');

    //     $token = Auth::attempt($credentials);

    //     if (!$token) {
    //         return response()->json([
    //             'status' => 'error',
    //             'message' => 'Unauthorized',
    //         ], 401);
    //     }

    //     $user = Auth::user();
    //     $user -> token = $token;

    //     return response()->json([
    //             'status' => 'Success',
    //             'data' => $user,
    //             'token' => $token,
    //     ])->cookie('token', $token, 60, null, null, true, true); // httpOnly and secure
    // }

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

    // public function logout()
    // {
    //     Auth::logout();
    //     return response()->json([
    //         'status' => 'success',
    //         'message' => 'Successfully logged out',
    //     ]);
    // }

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