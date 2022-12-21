<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tap extends Model
{
    use HasFactory;

    protected $guarded = [
        'id'
    ];

    public function security_check()
    {
        return $this->hasOne(SecurityCheck::class);
    }
}
