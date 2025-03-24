<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Auth\Events\Login;

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

        $tokenParts = explode("|", $decryptedToken);
        $actualDecryptedToken = $tokenParts[1]; // The token after '|'

        $storedToken = $request->session()->token();
        // Return the tokens in the response
        return response()->json([
            'decryptedToken' => $actualDecryptedToken,
            'storedToken' => $storedToken
        ]);
    }



    public function login(Request $request)
    {
        $credentials = $request->validate([
            'username' => 'required',
            'password' => 'required'
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = Auth::user();
        $sessionId = session()->getId(); // ✅ Keep the same session ID

        Log::info('User logged in', [
            'user_id' => $user->id,
            'session_id' => $sessionId
        ]);

        // ✅ Store user_id in the current session
        session()->put('user_id', $user->id);
        session()->save(); // ✅ Ensure session is written

        // ✅ Ensure session exists in DB before updating
        $attempts = 0;
        while ($attempts < 5) { 
            if (DB::table('sessions')->where('id', $sessionId)->exists()) {
                break;
            }
            usleep(200000); // Wait 200ms before checking again
            $attempts++;
        }

        // ✅ Update the session in the database with user_id
        DB::table('sessions')
            ->where('id', $sessionId)
            ->update([
                'user_id' => $user->id,
                'updated_at' => now() // Track when session was updated
            ]);

        Log::info('Updated session table', [
            'affected_rows' => DB::table('sessions')->where('id', $sessionId)->count()
        ]);

        return response()->json([
            'authenticated' => Auth::check(),
            'session_id' => session()->getId(), // ✅ Should remain the same
            'auth_user' => Auth::user(),
            'is_authenticated' => Auth::check(),
            'user' => auth()->user(),
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

//     public function logout(Request $request)
// {
//     $sessionId = session()->getId(); // Get current session ID

//     // Delete session from database
//     DB::table('sessions')->where('id', $sessionId)->delete();

//     Auth::logout();
//     $request->session()->invalidate(); // Destroy session data
//     $request->session()->regenerateToken(); // Regenerate CSRF token

//     return response()->json(['message' => 'Logged out successfully']);
// }


    // public function user(Request $request)
    // {
    //     return response()->json($request->user());
    // }

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