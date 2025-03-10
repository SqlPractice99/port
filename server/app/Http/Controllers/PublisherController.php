<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Tender;
use App\Models\Email;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class PublisherController extends Controller
{

    public function show()
    {
        $user = User::all();

        return response()->json([
            'status' => 'Success',
            'data' => $user
            ]
        );
    }

    // public function addTender(Request $request){

    //     $tender = new Tender;
    //     $tender->publisher_id = $request-> id;
    //     $tender->username = $request-> username;
    //     $tender->password = Hash::make($request->password);
    //     $tender->admin = 0;
    //     $tender->save();

    //     return response()->json([
    //         'status' => 'Success',
    //         'data' => $tender
    //     ]);
    // }

    // public function editTender(Request $request) {

    //     $tender = Tender::find($request->id);
    
    //     if ($tender) {
    //         if ($request->has('title')) {
    //             $tender->title = $request->title;
    //         }
        
    //         if ($request->has('date')) {
    //             $tender->date = $request->date;
    //         }
        
    //         if ($request->has('content')) {
    //             $tender->content = $request->content;
    //         }

    //         if ($request->has('tender_paper')) {
    //             $tender->tender_paper = $request->tender_paper;
    //         }

    //         if ($request->has('language')) {
    //             $tender->language = $request->language;
    //         }

    //         $tender->save();
        
    //         return response()->json([
    //             'status' => 'Success',
    //             'data' => $tender
    //         ]);
    //     }
    //     else { 
    //         return response()->json([
    //             'status' => 'Error',
    //             'data' => 'Tender with ID: ' . $request->id . ' not found.'
    //         ], 404);
    //     }
            
    // }
    
    // public function removeTender(Request $request) {
        
    //     $tender = Tender::where('id', $request->id);
        
    //     if ($tender) {
            
    //         $tender->delete();
    
    //         return response()->json([
    //             'status' => 'Success',
    //             'data' => 'Tender with ID: ' . $request->id . ' has been removed.'
    //         ]);
    //     } else {
    //         return response()->json([
    //             'status' => 'Error',
    //             'data' => 'Tender with ID: ' . $request->id . ' not found.'
    //         ], 404);
    //     }
    // }
    
    // public function getEmails() {
    //     $email = Email::all();

    //     return response()->json([
    //         'status' => 'Success',
    //         'data' => $email
    //     ]);
    // }
}