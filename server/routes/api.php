<?php

// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\AuthController;
// use App\Http\Controllers\AdminController;
// use App\Http\Controllers\PublisherController;
// use App\Http\Controllers\ClientController;
// use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;
// use App\Http\Controllers\SocketController;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\PublisherController;
use App\Http\Controllers\ClientController;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

// ✅ CSRF Cookie (Laravel already handles it internally)
Route::get('sanctum/csrf-cookie', function (Request $request) {
    return response()->json(['message' => 'CSRF cookie set']);
});

// ✅ Add Sanctum middleware for stateful authentication
Route::middleware([EnsureFrontendRequestsAreStateful::class])->group(function () {
    
    // Authentication routes
    Route::get('debug-auth', [AuthController::class, 'debugAuth']);
    Route::get('checkId', [AuthController::class, 'checkId']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('request', [AuthController::class, 'handleRequest']);
    Route::post('register', [AuthController::class, 'register']);
    Route::get('logout', [AuthController::class, 'logout']);

    Route::post('decrypt', [AuthController::class, 'decryptToken']);

    Route::middleware('auth:sanctum')->get('/test-auth', function (Request $request) {
        return response()->json(['message' => 'Authenticated', 'user' => $request->user()]);
    });

    // Route::middleware('auth:sanctum')->get('/userrr', function (Request $request) {
    //     return response()->json([
    //         'user' => $request->user(),
    //         'token' => $request->bearerToken(),
    //         'authenticated' => $request->user() ? true : false
    //     ]);
    // });
    
    // Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    //     return response()->json($request->user());
    // });
    
    Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
        return response()->json([
            'session_id' => session()->getId(),  // 🔥 Check if session is being read
            'cookies' => request()->cookies->all(), // 🔥 Debug cookies
            'auth_user' => Auth::user(), // 🔥 Check authenticated user
            'is_authenticated' => Auth::check(), // 🔥 Should return true
            'cookies' => $request->cookies->all(),
            'headers' => $request->headers->all(),
            'user' => auth()->user()
        ]);
    });
    
    // ✅ Protected Routes (Require Authentication)
    Route::middleware(['auth:sanctum'])->group(function () {
        // Route::get('logout', [AuthController::class, 'logout']);
        // Route::get('user', [AuthController::class, 'user']);
        Route::get('/hi', function(){
            return 'helloooow';
        });

        // ✅ Admin Routes
        Route::middleware(['auth', 'auth.admin'])->group(function () {
            Route::post('addData', [AdminController::class, 'addData']);
            Route::post('addTender', [AdminController::class, 'addTender']);
            Route::post('addNews', [AdminController::class, 'addNews']);
            Route::post('editData', [AdminController::class, 'editData']);
            Route::post('editTender', [AdminController::class, 'editTender']);
            Route::post('editNews', [AdminController::class, 'editNews']);
            Route::post('removeTender', [AdminController::class, 'removeTender']);
            Route::post('removeNews', [AdminController::class, 'removeNews']);
            Route::post('emails', [AdminController::class, 'getEmails']);
        });
    });

    // ✅ Public Client Routes
    Route::post('data', [ClientController::class, 'getData']);
    Route::post('tenders', [ClientController::class, 'getTenders']);
    Route::post('news', [ClientController::class, 'getNews']);
    Route::get('videos/{filename}', [ClientController::class, 'streamVideo'])->where('filename', '.*');
    Route::post('search', [ClientController::class, 'search']);
    Route::get('testImage', [ClientController::class, 'testImage']);
    Route::post('sendMessage', [ClientController::class, 'sendMessage']);

    // ✅ Unauthorized Redirect
    Route::get("unauthorized", [AuthController::class, "unauthorized"])->name("yyyyyyy");
});










// Route::group(["middleware" => "auth:sanctum"], function () {
//     // Route::get('socket', [SocketController::class, 'socket']);

//     Route::get('logout', [AuthController::class, 'logout']);
//     Route::get('user', [AuthController::class, 'user']);

//     Route::group(["middleware" => ["auth", "auth.admin"]], function () {
//         // Route::post('addPublisher', [AdminController::class, 'addPublisher']);
//         // Route::post('removePublisher', [AdminController::class, 'removePublisher']);
//         // Route::get('display', [AdminController::class, 'display']);
//         // Route::get('shu', [AdminController::class, 'shu']);
//         Route::post('addData', [AdminController::class, 'addData']);
//         Route::post('addTender', [AdminController::class, 'addTender']);
//         Route::post('addNews', [AdminController::class, 'addNews']);
//         Route::post('editData', [AdminController::class, 'editData']);
//         Route::post('editTender', [AdminController::class, 'editTender']);
//         Route::post('editNews', [AdminController::class, 'editNews']);
//         Route::post('removeTender', [AdminController::class, 'removeTender']);
//         Route::post('removeNews', [AdminController::class, 'removeNews']);
//         Route::post('emails', [AdminController::class, 'getEmails']);
//     });

//     // Route::group(["middleware" => "auth.publisher"], function () {
//     //     Route::post('addTender', [PublisherController::class, 'addTender']);
//     //     Route::post('removeTender', [PublisherController::class, 'removeTender']);
//     //     Route::post('editTender', [PublisherController::class, 'editTender']);
//     //     Route::post('emails', [PublisherController::class, 'getEmails']);
//     //     Route::get('show', [PublisherController::class, 'show']);
//     // });
// });

// // Route::get('show', [PublisherController::class, 'show']);
// Route::post('data', [ClientController::class, 'getData']);
// Route::post('tenders', [ClientController::class, 'getTenders']);
// Route::post('news', [ClientController::class, 'getNews']);
// Route::get('videos/{filename}', [ClientController::class, 'streamVideo'])->where('filename', '.*');
// Route::post('search', [ClientController::class, 'search']);
// // Route::get('news/{slug}', [NewsController::class, 'share'])->name('news.share');
// // Route::post('sendEmail', [ClientController::class, 'sendEmail']);
// Route::get('testImage', [ClientController::class, 'testImage']);
// Route::post('sendMessage', [ClientController::class, 'sendMessage']);
// Route::post('tenders', [ClientController::class, 'getTenders']);
// Route::get("unauthorized", [AuthController::class, "unauthorized"])->name("unauthorized");
// Route::post('login', [AuthController::class, 'login']);
// Route::post('register',[AuthController::class,'register']);
// // Route::post('hi',[AuthController::class,'hi']);

// Route::get('sanctum/csrf-cookie', function () {
//     return response()->json(['message' => 'CSRF cookie set']);
// });

// // Route::get('shu', [AdminController::class, 'shu']);
// // Route::post('image', [SupervisorController::class, 'image']);

// Route::post('/hi', function(){
//     return 'helloooow';
// });