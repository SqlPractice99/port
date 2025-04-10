<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Data;
use App\Models\Tender;
use App\Models\Email;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{

    public function display()
    {
        $user = User::all();

        return response()->json(
            [
                'status' => 'Success',
                'data' => $user
            ]
        );
    }

    // public function shu()
    // {
    //     return response()->json(
    //         [
    //             'status' => 'Success',
    //             'data' => 'wowww'
    //         ]
    //     );
    // }

    // public function addPublisher(Request $request)
    // {
    //     $request->validate([
    //         'firstName' => 'required|string|max:255',
    //         'lastName' => 'required|string|max:255',
    //         'username' => 'required|string|max:255|unique:users',
    //         'password' => 'required|string|min:6',
    //     ]);

    //     $user = new User;
    //     $user->first_name = $request->firstName;
    //     $user->last_name = $request->lastName;
    //     $user->username = $request->username;
    //     $user->password = Hash::make($request->password);
    //     $user->admin = 0;
    //     $user->save();

    //     return response()->json([
    //         'status' => 'Success',
    //         'data' => $user
    //     ]);
    // }

    // public function removePublisher(Request $request)
    // {
    //     $remove = User::where('username', $request->username)->first();

    //     if ($remove) {

    //         if ($remove->admin == 0) {

    //             $remove->delete();

    //             return response()->json([
    //                 'status' => 'Success',
    //                 'data' => 'Publisher with username: ' . $request->username . ' has been removed.'
    //             ]);
    //         } else {

    //             return response()->json([
    //                 'status' => 'Error',
    //                 'data' => 'You cannot remove an admin user.'
    //             ], 403);
    //         }
    //     } else {

    //         return response()->json([
    //             'status' => 'Error',
    //             'data' => 'Publisher with username: ' . $request->username . ' not found.'
    //         ], 404);
    //     }
    // }

    function addData(Request $request)
    {
        $data = new Data;

        $request->validate([
            'page' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'sub_title' => 'nullable|string|max:255',
            'content' => 'required|string',
            'language' => 'required|string|max:10',
            'image' => 'nullable|image|mimes:jpg,jpeg,png',
            'tender_paper' => 'nullable|file',
        ]);

        if ($request->hasFile('image')) {
            $originalName = $request->file('image')->getClientOriginalName();
            $request->file('image')->move(public_path('images'), $originalName);
            $data->image = 'images/' . $originalName;
        }

        if ($request->hasFile('tender_paper')) {
            $originalName = $request->file('tender_paper')->getClientOriginalName();
            $request->file('tender_paper')->move(public_path('materials'), $originalName);
            $data->tender_paper = 'materials/' . $originalName;
        }

        $data->page = $request->page;
        $data->title = $request->title;
        $data->sub_title = $request->has('sub_title') ? $request->sub_title : null;
        $data->language = $request->language;
        $data->content = $request->content;

        $data->save();

        return response()->json([
            'message' => 'Posted',
            'data' => $data
        ]);
    }

    public function addTender(Request $request)
    {

        $request->validate([
            'title' => 'required|string',
            'sub_title' => 'nullable|string|max:255',
            'language' => 'required|string|max:10',
            'image' => 'nullable|image|mimes:jpg,jpeg,png',
            'tender_paper' => 'nullable|file',
        ]);

        $tender = new Tender;

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $extension = $file->getClientOriginalExtension();
            $filename = $originalName;
            $destination = public_path('images');

            $counter = 1;
            while (file_exists($destination . '/' . $filename . '.' . $extension)) {
                $filename = $originalName . ' (' . $counter . ')';
                $counter++;
            }

            $file->move($destination, $filename . '.' . $extension);
            $tender->image = 'images/' . $filename . '.' . $extension;
        }

        if ($request->hasFile('tender_paper')) {
            $file = $request->file('tender_paper');
            $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $extension = $file->getClientOriginalExtension();
            $filename = $originalName;
            $destination = public_path('materials');

            $counter = 1;
            while (file_exists($destination . '/' . $filename . '.' . $extension)) {
                $filename = $originalName . ' (' . $counter . ')';
                $counter++;
            }

            $file->move($destination, $filename . '.' . $extension);
            $tender->tender_paper = 'materials/' . $filename . '.' . $extension;
        }


        $tender->publisher_id = auth()->id();
        $tender->title = $request->title;
        $tender->sub_title = $request->sub_title;
        $tender->language = $request->language;
        $tender->save();

        return response()->json([
            'status' => 'Success',
            'data' => $tender
        ]);
    }

    public function addNews(Request $request)
    {

        $request->validate([
            'title' => 'required|string',
            'enTitle' => 'required|string',
            'content' => 'required|string',
            'enContent' => 'required|string',
            'language' => 'required|string|max:10',
            'coverImg' => 'required|image|mimes:jpg,jpeg,png',
            'images.*' => 'nullable|mimes:jpeg,png,jpg,gif,mp4,mov,avi,wmv|max:50000',
            'newImages.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:5000', // 5MB limit
            // 'tender_paper' => 'nullable|file',
        ]);

        $news = new News;

        $imagePaths = [];

        // if ($request->hasFile('images')) {
        //     $file = $request->file('images');
        //     $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        //     $extension = $file->getClientOriginalExtension();
        //     $filename = $originalName;
        //     $destination = public_path('images');

        //     // Check for filename collision and increment the filename
        //     $counter = 1;
        //     while (file_exists($destination . '/' . $filename . '.' . $extension)) {
        //         $filename = $originalName . $counter;
        //         $counter++;
        //     }

        //     // Move the file and save the path
        //     $file->move($destination, $filename . '.' . $extension);
        //     $news->image = 'images/' . $filename . '.' . $extension;  // Save the single image path
        // }

        // Handle multiple image uploads (for 'images')
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $originalName = pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME);
                $extension = $image->getClientOriginalExtension();
                $filename = $originalName;
                $destination = public_path('images');

                // Check for filename collision and increment the filename
                $counter = 1;
                while (file_exists($destination . '/' . $filename . '.' . $extension)) {
                    $filename = $originalName . ' (' . $counter . ')';
                    $counter++;
                }

                // Move the image and save the path
                $image->move($destination, $filename . '.' . $extension);

                // Push the image path to the array, ensuring proper path format
                $imagePaths[] = 'images/' . $filename . '.' . $extension;
            }
        }

        if ($request->hasFile('coverImg')) {
            $file = $request->file('coverImg');
            $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $extension = $file->getClientOriginalExtension();
            $filename = $originalName;
            $destination = public_path('images');

            $counter = 1;
            while (file_exists($destination . '/' . $filename . '.' . $extension)) {
                $filename = $originalName . ' (' . $counter . ')';
                $counter++;
            }

            $file->move($destination, $filename . '.' . $extension);
            $news->coverImg = 'images/' . $filename . '.' . $extension;
        }

        // if ($request->hasFile('image')) {
        //     $file = $request->file('image');
        //     $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        //     $extension = $file->getClientOriginalExtension();
        //     $filename = $originalName;
        //     $destination = public_path('images');

        //     $counter = 1;
        //     while (file_exists($destination . '/' . $filename . '.' . $extension)) {
        //         $filename = $originalName . $counter;
        //         $counter++;
        //     }

        //     $file->move($destination, $filename . '.' . $extension);
        //     $news->image = 'images/' . $filename . '.' . $extension;
        // }

        // if ($request->hasFile('tender_paper')) {
        //     $file = $request->file('tender_paper');
        //     $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        //     $extension = $file->getClientOriginalExtension();
        //     $filename = $originalName;
        //     $destination = public_path('materials');

        //     $counter = 1;
        //     while (file_exists($destination . '/' . $filename . '.' . $extension)) {
        //         $filename = $originalName . $counter;
        //         $counter++;
        //     }

        //     $file->move($destination, $filename . '.' . $extension);
        //     $tender->tender_paper = 'materials/' . $filename . '.' . $extension;
        // }


        $news->publisher_id = auth()->id();
        $news->title = $request->title;
        $news->enTitle = $request->enTitle;
        $news->content = $request->content;
        $news->enContent = $request->enContent;
        $news->language = $request->language;
        $news->image = json_encode($imagePaths);
        // echo var_dump($imagePaths);


        if (!empty($imagePaths)) {
            $news->image = json_encode($imagePaths);  // Store the image paths in JSON format
        }

        $news->image = json_encode($imagePaths, JSON_UNESCAPED_SLASHES);
        
        $news->save();

        return response()->json([
            'status' => 'Success',
            'data' => $news
        ]);
    }

    public function editTender(Request $request)
    {

        $tender = Tender::find($request->id);

        if ($tender) {
            if ($request->has('title')) {
                $tender->title = $request->title;
            }

            if ($request->has('date')) {
                $tender->date = $request->date;
            }

            if ($request->has('content')) {
                $tender->content = $request->content;
            }

            if ($request->has('tender_paper')) {
                $tender->tender_paper = $request->tender_paper;
            }

            if ($request->has('language')) {
                $tender->language = $request->language;
            }

            $tender->save();

            return response()->json([
                'status' => 'Success',
                'data' => $tender
            ]);
        } else {
            return response()->json([
                'status' => 'Error',
                'data' => 'Tender with ID: ' . $request->id . ' not found.'
            ], 404);
        }
    }

    public function removeTender(Request $request)
    {

        $tender = Tender::where('id', $request->id);

        if ($tender) {

            $tender->delete();

            return response()->json([
                'status' => 'Success',
                'data' => 'Tender with ID: ' . $request->id . ' has been removed.'
            ]);
        } else {
            return response()->json([
                'status' => 'Error',
                'data' => 'Tender with ID: ' . $request->id . ' not found.'
            ], 404);
        }
    }

    public function editNews(Request $request)
    {
        $news = News::find($request->id);

        // return response()->json([
        //     'status' => 'Error',
        //     'data' => $request->all()
        // ], 404);

        if ($news) {
            if ($request->has('title') && $news->title !== $request->title) {
                $news->title = $request->title;
            }

            if ($request->has('enTitle') && $news->enTitle !== $request->enTitle) {
                $news->enTitle = $request->enTitle;
            }

            if ($request->has('content') && $news->content !== $request->content) {
                $news->content = $request->content;
            }

            if ($request->has('enContent') && $news->enContent !== $request->enContent) {
                $news->enContent = $request->enContent;
            }

            if ($request->hasFile('coverImg')) {
                // Delete old cover image if exists
                if ($news->coverImg && file_exists(public_path($news->coverImg))) {
                    unlink(public_path($news->coverImg));
                }
        
                // Upload new cover image
                $coverImg = $request->file('coverImg');
                $coverImgName = time() . '_' . $coverImg->getClientOriginalName();
                $coverImg->move(public_path('images'), $coverImgName);
                $news->coverImg = 'images/' . $coverImgName;
            }

            if (!$news) {
                return response()->json([
                    'status' => 'Error',
                    'data' => 'News with ID: ' . $request->id . ' not found.'
                ], 404);
            }
        
            // Get existing images from the database
            $imagePaths = json_decode($news->image, true) ?? [];
        
            // Get the order from imageArray (frontend)
            $requestedOrder = $request->imageArray ?? $imagePaths; 
        
            // Handle new image uploads
            $newImagePaths = [];
            if ($request->hasFile('newImages')) {
                foreach ($request->file('newImages') as $image) {
                    $imageName = time() . '_' . $image->getClientOriginalName();
                    $image->move(public_path('images'), $imageName);
                    $newImagePaths[] = 'images/' . $imageName;
                }
            }
        
            // Final array to maintain correct order
            $finalImagePaths = [];
            $newImageIndex = 0; // Track index for new images
        
            foreach ($requestedOrder as $index => $image) {
                if (str_starts_with($image, 'images/')) {
                    // Existing image, keep in order
                    $finalImagePaths[] = $image;
                } elseif ($newImageIndex < count($newImagePaths)) {
                    // Replace "new" placeholder or empty slot with an uploaded image
                    $finalImagePaths[] = $newImagePaths[$newImageIndex++];
                }
            }
        
            // If any new images are left, append them at the end (failsafe)
            $finalImagePaths = array_merge($finalImagePaths, array_slice($newImagePaths, $newImageIndex));
        
            // Save the final ordered images to the database
            $news->image = json_encode($finalImagePaths, JSON_UNESCAPED_SLASHES);
            $news->save();

            return response()->json([
                'status' => 'Success',
                'data' => $news
            ]);

        } else {
            return response()->json([
                'status' => 'Error',
                'data' => 'News with ID: ' . $request->id . ' not found.'
            ], 404);
        }
    }


    public function editData(Request $request)
    {
        $items = $request->input('items'); // Get all items

        if (!$items || !is_array($items)) {
            return response()->json(['status' => 'Error', 'message' => 'Invalid data format']);
        }

        $updatedRecords = [];

        foreach ($items as $item) {
            if (!isset($item['id'])) {
                continue; // Skip if no ID is provided
            }

            $existingItem = Data::find($item['id']);

            if ($existingItem) {
                if (isset($item['title'])) {
                    $existingItem->title = $item['title'];
                }
                if (isset($item['arTitle'])) {
                    $existingItem->arTitle = $item['arTitle'];
                }
                if (isset($item['sub_title'])) {
                    $existingItem->sub_title = $item['sub_title'];
                }
                if (isset($item['arSub_title'])) {
                    $existingItem->arSub_title = $item['arSub_title'];
                }
                if (isset($item['content'])) {
                    $existingItem->content = $item['content'];
                }
                if (isset($item['arContent'])) {
                    $existingItem->arContent = $item['arContent'];
                }

                // Check for image file by ID key
                // $imageKey = 'image_' . $item['id'];
                if ($request->hasFile('image')) {
                    return response()->json([
                        'status' => 'Sucssssssssscess'
                    ]);
                    $file = $request->file('image');
                    $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                    $file->move(public_path('images'), $filename);
                    $existingItem->image = 'images/' . $filename;
                }

            $existingItem->save();
            $updatedRecords[] = $existingItem;
            }
        }

        return response()->json([
            'status' => 'Success',
            'message' => count($updatedRecords) . ' records updated',
            'updated' => $request->all()
        ]);

        // $data = Data::find($request->id);

        // if ($data) {
        //     if ($request->has('sub_title') && $data->sub_title !== $request->sub_title) {
        //         $data->sub_title = $request->sub_title;
        //     }

        //     if ($request->has('content') && $data->content !== $request->content) {
        //         $data->content = $request->content;
        //     }

        //     $data->save();

        //     return response()->json([
        //         'status' => 'Success',
        //         'data' => $data
        //     ]);
        // } else {
        //     return response()->json([
        //         'status' => 'Error',
        //         'data' => 'Data with ID: ' . $request->id . ' not found.'
        //     ]);
        // }
    }

    public function getEmails()
    {
        $email = Email::all();

        return response()->json([
            'status' => 'Success',
            'data' => $email
        ]);
    }
}
