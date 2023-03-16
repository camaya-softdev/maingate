<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Guest extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    public function booking()
    {
        return $this->belongsTo('App\Models\Booking', 'booking_reference_number', 'reference_number');
    }

    public function pass()
    {
        return $this->belongsTo(Pass::class, 'guest_reference_number', 'reference_number');
    }
}
