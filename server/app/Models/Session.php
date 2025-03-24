<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Session extends Model
{
    protected $table = 'sessions';

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = ['id', 'user_id', 'payload', 'last_activity'];

    // public $timestamps = false; // ❌ Disable timestamps

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}