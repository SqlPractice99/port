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

        // if (!Auth::attempt($credentials)) {
        //     return response()->json(['message' => 'Invalid credentials'], 401);
        // }

        // Using the `attempt` method is not available with Sanctum, instead, use `Auth::login()`
        $user = User::where('username', $request->username)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

         // Log the user in using Sanctum (this does not use the default session-based login)
        Auth::guard('web')->login($user);  // This is for session-based authentication, not needed for token-based

        $user = Auth::user();

        // 1. Before regeneration, set user_id to a placeholder value
        session()->forget(['id']); // Remove specific session data
    session()->flush(); // Alternatively, you can use flush() to clear all session data
    // session()->save(); // Save session data before regenerating

        // Log the session data before regeneration (you can verify old session data)
        Log::info('Before regeneration, checking the User ID and Session ID', [
            'user_id' => session()->get('user_id'),
            'session_id' => session()->getId(),
        ]);

        // DB::table('sessions')
        // ->where('id', session()->getId()) // The old session will be the one before regeneration
        // ->delete(); // Remove old session

        $showSession = session()->all();
        // 2. Regenerate session to get a new session ID
        session()->regenerate();

        // Log the session data after regeneration (verify the new session data)
        Log::info('After regeneration, checking the User ID and Session ID', [
            'user_id' => session()->get('user_id'),
            'session_id' => session()->getId(),
        ]);

        // 3. Get the new session ID (after regeneration)
        $newSessionId = session()->getId();

        // 4. Ensure old session is not updated, and update only the new session
        // Find and remove the old session in the database (if needed)

        // 5. Now update the new session (after regeneration) with the correct user_id
        DB::table('sessions')
            ->where('id', $newSessionId)
            ->update(['user_id' => $user->id, 'testing' => '3']); // Update new session with user_id

        // 6. Ensure session data is saved again (force sync)
        session()->save();

        // Retrieve the new session from the database (after regeneration)
        $newSession = DB::table('sessions')->where('id', $newSessionId)->first();

        // 7. Return the response with session information
        return response()->json([
            'authenticated' => $user->id,
            'session_id' => $newSessionId,
            'session_user' => $newSession, // This should have the correct user_id now
            'user' => $user,
            'session details' => $showSession
        ]);
    }


    public function checkId() {
        $newSessionId = session()->getId();

        $userSession = DB::table('sessions')->where('id', $newSessionId)->first(); // Before regeneration
        return response()->json([
            'session_id' => $newSessionId,
            'session_user' => $userSession, // This will now have the correct user_id after the update
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