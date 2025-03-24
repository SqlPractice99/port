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
        $this->registerPolicies();

        Event::listen(Login::class, function ($event) {
            // session()->save(); // ✅ Ensure session is stored

            $userId = $event->user->id;
            $sessionId = session()->getId();

            Log::info('User logged in', [
                'user_id' => $userId,
                'current_session_id' => $sessionId
            ]);

            // ✅ Update only the current session
            DB::table('sessions')
                ->where('id', $sessionId) // Only update this session
                ->update(['user_id' => $userId]);

            Log::info('Updated session table', [
                'affected_rows' => DB::table('sessions')->where('id', $sessionId)->count()
            ]);
        });
    }

}
