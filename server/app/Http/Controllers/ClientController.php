<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Data;
use App\Models\Email;
use App\Models\Tender;
use App\Models\News;
use Illuminate\Http\Request;
use App\Mail\ContactMessage;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\Response;


class ClientController extends Controller
{

public function testImage () {
    // Create a blank image with a red background
    $img = Image::canvas(100, 100, '#ff0000');

    // Encode the image as PNG
    $encodedImage = $img->encode('png');

    // Save the encoded image to disk
    file_put_contents(public_path('test-image.png'), $encodedImage);

    return 'Image created and encoded successfully!';
}

    public function getData(Request $request)
    {
        $page = $request->input('page');
        $data = Data::where('page', $page)->get();

        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }

    public function getTenders(Request $request)
    {
        $language = $request->language;

        if (!$language) {
            return response()->json([
                'status' => 'error',
                'message' => 'Language parameter is required or invalid'
            ], 400);
        }

        $tenders = Tender::where('language', $language)
                    ->orderBy('created_at', 'desc')
                    ->get();

        return response()->json([
            'status' => 'success',
            'data' => $tenders
        ]);
    }

    public function getNews(Request $request)
    {
        // $language = $request->language;
        $language = $request->input('language', 'ar');
        
        if (!$language) {
            return response()->json([
                'status' => 'error',
                'message' => 'Language parameter is required or invalid'
            ], 400);
        }

        // $news = News::where('language', $language)
        //             ->orderBy('created_at', 'desc')
        //             ->get();

        // return response()->json([
        //     'status' => 'success',
        //     'data' => $news
        // ]);

        
        $perPage = $request->input('per_page', 6); // Default to 6 items
        $news = News::where('language', $language)->orderBy('created_at', 'desc')->paginate($perPage);
    
        return response()->json($news);
    }

    // public function sendMessage(Request $request)
    // {
    // // Validate incoming request data
    // $request->validate([
    //     'name' => 'required|string|max:255',
    //     'email' => 'required|email|max:255',
    //     'subject' => 'required|string|max:255',
    //     'message' => 'required|string',
    // ]);

    // // Save the message to the database
    // $message = new Email;

    // $name = $request->name ?? 'Default Name';
    // $email = $request->email ?? 'default@example.com';
    // $subject = $request->subject ?? 'No subject';
    // $messageContent = $request->message ?? 'No message content';

    // $message->name = $name;
    // $message->email = $email;
    // $message->subject = $subject;
    // $message->message = $messageContent;
    // $message->save();

    // try {
    //     // Define the image path
    //     $image = 'images/email_bg.png'; // Relative path to the image in the public directory

    //     Mail::to('h.s.h94@hotmail.com')
    //         ->send(new ContactMessage($name, $email, $subject, $messageContent, $image));

    //         return response()->json([
    //             'message' => 'Message sent successfully',
    //             'data' => $message
    //         ]);
    // } catch (\Exception $e) {
    //         \Log::error('Mailer error: ' . $e->getMessage());

    //     return response()->json([
    //         'message' => 'Failed to send the message',
    //         'error' => $e->getMessage()
    //     ], 500);
    // }    
    // }

    public function sendMessage(Request $request)
    {
        // Load the background image
        $image = imagecreatefrompng(public_path('images/emailform.png'));
    
        // Get image dimensions
        $imageWidth = imagesx($image);
        $imageHeight = imagesy($image);
    
        // Set the text color (black)
        $textColor = imagecolorallocate($image, 0, 0, 0);
    
        // Path to font files
        $boldFont = public_path('fonts/arialbd.ttf'); // Bold font for labels
        $regularFont = public_path('fonts/arial.ttf'); // Regular font for content
    
        // Initial font sizes
        $nameFontSize = 50;
        $emailFontSize = 44;
        $subjectFontSize = 44;
        $messageFontSize = 42;
    
        // Line height multiplier
        $lineHeightMultiplier = 1.5;
    
        // Function to wrap text
        function wrapText($image, $fontSize, $font, $text, $maxWidth) {
            $words = explode(' ', $text);
            $lines = [];
            $currentLine = '';
    
            foreach ($words as $word) {
                // Check if adding the word exceeds the max width
                $testLine = $currentLine ? "$currentLine $word" : $word;
                $textBox = imagettfbbox($fontSize, 0, $font, $testLine);
                $textWidth = $textBox[2] - $textBox[0];
    
                if ($textWidth <= $maxWidth) {
                    $currentLine = $testLine;
                } else {
                    $lines[] = $currentLine;
                    $currentLine = $word;
                }
            }
    
            // Add the last line
            if ($currentLine) {
                $lines[] = $currentLine;
            }
    
            return $lines;
        }
    
        // Function to calculate text width
        function calculateTextWidth($fontSize, $font, $text) {
            $textBox = imagettfbbox($fontSize, 0, $font, $text);
            return $textBox[2] - $textBox[0];
        }
    
        // Loop to adjust font size until text fits
        do {
            // Reset Y position for each iteration
            $y = 350;
    
            // Add "Name" label and content
            $label = "Name: ";
            $labelWidth = calculateTextWidth($nameFontSize, $boldFont, $label);
            imagettftext($image, $nameFontSize, 0, 50, $y, $textColor, $boldFont, $label);
    
            $nameLines = wrapText($image, $nameFontSize, $regularFont, $request->name, $imageWidth - 100 - $labelWidth);
            foreach ($nameLines as $line) {
                imagettftext($image, $nameFontSize, 0, 50 + $labelWidth + 10, $y, $textColor, $regularFont, $line);
                $y += $nameFontSize * $lineHeightMultiplier; // Increase line height
            }
    
            // Add "Email" label and content
            $label = "Email: ";
            $labelWidth = calculateTextWidth($emailFontSize, $boldFont, $label);
            imagettftext($image, $emailFontSize, 0, 50, $y, $textColor, $boldFont, $label);
    
            $emailLines = wrapText($image, $emailFontSize, $regularFont, $request->email, $imageWidth - 100 - $labelWidth);
            foreach ($emailLines as $line) {
                imagettftext($image, $emailFontSize, 0, 50 + $labelWidth + 10, $y, $textColor, $regularFont, $line);
                $y += $emailFontSize * $lineHeightMultiplier; // Increase line height
            }
    
            // Add "Subject" label and content
            $label = "Subject: ";
            $labelWidth = calculateTextWidth($subjectFontSize, $boldFont, $label);
            imagettftext($image, $subjectFontSize, 0, 50, $y, $textColor, $boldFont, $label);
    
            $subjectLines = wrapText($image, $subjectFontSize, $regularFont, $request->subject, $imageWidth - 100 - $labelWidth);
            foreach ($subjectLines as $line) {
                imagettftext($image, $subjectFontSize, 0, 50 + $labelWidth + 10, $y, $textColor, $regularFont, $line);
                $y += $subjectFontSize * $lineHeightMultiplier; // Increase line height
            }
    
            // Add "Message" label and content
            $label = "Message: ";
            $labelWidth = calculateTextWidth($messageFontSize, $boldFont, $label);
            imagettftext($image, $messageFontSize, 0, 50, $y, $textColor, $boldFont, $label);
    
            $messageLines = wrapText($image, $messageFontSize, $regularFont, $request->message, $imageWidth - 100 - $labelWidth);
            foreach ($messageLines as $line) {
                imagettftext($image, $messageFontSize, 0, 50 + $labelWidth + 10, $y, $textColor, $regularFont, $line);
                $y += $messageFontSize * $lineHeightMultiplier; // Increase line height
            }
    
            // Check if text exceeds image height
            if ($y > $imageHeight) {
                // Reduce font sizes
                $nameFontSize -= 2;
                $emailFontSize -= 2;
                $subjectFontSize -= 2;
                $messageFontSize -= 2;
    
                // Reset the image
                imagedestroy($image);
                $image = imagecreatefrompng(public_path('images/emailform.png'));
            } else {
                break; // Exit the loop if text fits
            }
        } while ($nameFontSize > 10); // Minimum font size to avoid too small text
    
        // Save the image to a temporary file
        $imagePath = storage_path('app/public/generated_image.jpg');
        imagejpeg($image, $imagePath);
    
        // Free up memory
        imagedestroy($image);
    
        try {
            // Define the image path
            $image = 'app/public/generated_image.jpg'; // Relative path to the image in the public directory
    
            Mail::to('sqlpractice99@gmail.com')
                ->send(new ContactMessage(
                    $request->name,
                    $request->email,
                    $request->subject,
                    $request->message,
                    $image
                ));
    
            return response()->json([
                'message' => 'Message sent successfully',
                'data' => $request->all(),
            ]);
        } catch (\Exception $e) {
            \Log::error('Mailer error: ' . $e->getMessage());
    
            return response()->json([
                'message' => 'Failed to send the message',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function share($slug)
    {
        $news = News::where('slug', $slug)->firstOrFail();
        return response()->json($news);
    }

    public function search(Request $request) {
        $language = $request->language;
        $title = $request->title;
    
        // Determine the column to search in based on the language
        $titleColumn = $language === 'en' ? 'enTitle' : 'title';
    
        $perPage = $request->input('per_page', 6);
        $news = News::where('language', $language)->orderBy('created_at', 'desc')->paginate($perPage);

        // Fetch news where the correct title column contains the search term (case-insensitive)
        $news = News::where('language', 'ar')
                    ->where($titleColumn, 'LIKE', "%{$title}%")
                    ->orderBy('created_at', 'desc')
                    ->paginate($perPage);
    
        return response()->json(['data' => $news]);
    }
    
    public function streamVideo($filename, Request $request)
    {
        $path = public_path("{$filename}");

        if (!file_exists($path)) {
            abort(404);
        }

        $fileSize = filesize($path);
        $headers = [
            'Content-Type' => 'video/mp4',
            'Accept-Ranges' => 'bytes',
        ];

        if ($request->header('Range')) {
            $range = $request->header('Range');
            preg_match('/bytes=(\d+)-(\d+)?/', $range, $matches);
            $start = intval($matches[1]);
            $end = isset($matches[2]) ? intval($matches[2]) : ($fileSize - 1);
            $length = $end - $start + 1;

            $file = fopen($path, 'rb');
            fseek($file, $start);

            $headers += [
                'Content-Range' => "bytes $start-$end/$fileSize",
                'Content-Length' => $length,
                'Cache-Control' => 'no-cache',
                'Connection' => 'keep-alive',
                'Pragma' => 'no-cache',
            ];

            return response()->stream(function () use ($file, $length) {
                $bufferSize = 8192; // 8KB chunks
                while (!feof($file) && $length > 0) {
                    $readSize = min($bufferSize, $length);
                    echo fread($file, $readSize);
                    flush(); // Ensure the buffer is sent to the client
                    $length -= $readSize;
                }
                fclose($file);
            }, 206, $headers);
        }

        return response()->file($path, $headers);
    }

    // public function sendEmail(Request $request)
    // {

    //     $request->validate([
    //         'name' => 'required|string|max:255',
    //         'email' => 'required|email|max:255',
    //         'subject' => 'required|string|max:255',
    //         'message' => 'required|string',
    //     ]);

    //     Mail::to('recipient@example.com')->send(new ContactFormMail(
    //         $request->name,
    //         $request->email,
    //         $request->subject,
    //         $request->message
    //     ));

    //     return response()->json(['message' => 'Email sent successfully!'], 200);
    // }
}
