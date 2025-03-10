<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Message</title>
    <style>
        .name, .email, .subject, .message {
            font-size: 14px;
        }
    </style>
</head>
<body>
<body>


    <div class="container">

        <div class="text-overlay">
            <p class="name"><strong>Name:</strong> {{ $name }}</p>
            <p class="email"><strong>Email:</strong> {{ $email }}</p>
            <p class="subject"><strong>Subject:</strong> {{ $subject }}</p>
            <p class="message"><strong>Message:</strong> {{ $messageContent }}</p>
        </div>

        <br>

        <img src="{{ $message->embed(storage_path($image)) }}" alt="Generated Image" style="max-width: 80%;">
</body>
</html>