<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pass extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    public function booking()
    {
        return $this->hasOne(Booking::class, 'reference_number', 'booking_reference_number');
    }

    public function guests()
    {
        return $this->hasOne(Guest::class, 'reference_number', 'guest_reference_number');
    }

    public function guest_vehicles()
    {
        return $this->hasMany(GuestVehicle::class, 'booking_reference_number', 'booking_reference_number');
    }

    public function security_check()
    {
        return $this->hasMany(SecurityCheck::class, 'booking_reference_number', 'booking_reference_number');
    }
}
