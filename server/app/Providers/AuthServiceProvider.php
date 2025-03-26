<?php

namespace App\Providers;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Event;
use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\DB;

// use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        //
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot()
    {
        // $this->registerPolicies();

        // Event::listen(Login::class, function ($event) {
        //     // Get the user ID and session ID
        //     $userId = $event->user->id;
        //     $sessionId = session()->getId();

        //     Log::info('User logged in', [
        //         'user_id' => $userId,
        //         'current_session_id' => $sessionId
        //     ]);

        //     // ✅ Ensure session is stored before updating DB
        //     session()->save();

        //     // ✅ Double-check session exists before updating (retry logic)
        //     $attempts = 0;
        //     while ($attempts < 5) {
        //         if (DB::table('sessions')->where('id', $sessionId)->exists()) {
        //             break;
        //         }
        //         usleep(200000); // Wait 200ms before checking again
        //         $attempts++;
        //     }

        //     // ✅ Update the session with the user ID
        //     $updatedRows = DB::table('sessions')
        //         ->where('id', $sessionId)
        //         ->update(['user_id' => $userId, 'updated_at' => now()]);  // Update the user_id and timestamp

        //     Log::info('Updated session table', [
        //         'affected_rows' => $updatedRows
        //     ]);
        // });
    }

}
