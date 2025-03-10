<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContactMessage extends Mailable
{
    public $name;
    public $email;
    public $subject;
    public $messageContent;
    public $image;

    public function __construct($name, $email, $subject, $messageContent, $image)
    {
        $this->name = $name;
        $this->email = $email;
        $this->subject = $subject;
        $this->messageContent = $messageContent;
        $this->image = $image;

    }

    public function build()
    {

        return $this->view('emails.contact')  // Adjust to your actual view
                    ->with([
                        'name' => $this->name,
                        'email' => $this->email,
                        'subject' => $this->subject,
                        'messageContent' => $this->messageContent,
                        'image' => $this->image,
                    ])
                    ->subject($this->subject);
    }
}
