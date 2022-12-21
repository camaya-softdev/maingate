<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GuestVehicle extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    public function pass()
    {
        return $this->belongsTo(Pass::class, 'booking_reference_number', 'booking_reference_number');
    }
}
