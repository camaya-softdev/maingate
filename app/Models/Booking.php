<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function customer()
    {
        return $this->hasMany('App\Models\Customer', 'id', 'customer_id')->whereNull('deleted_at');
    }

    public function guests()
    {
        return $this->hasMany('App\Models\Guest', 'booking_reference_number', 'reference_number')->whereNull('deleted_at');
    }

    public function guest_vehicles()
    {
        return $this->hasMany('App\Models\GuestVehicle', 'booking_reference_number', 'reference_number');
    }

    public function inclusions()
    {
        return $this->hasMany('App\Models\Inclusion', 'booking_reference_number', 'reference_number');
    }

    public function pass()
    {
        return $this->hasMany(Pass::class, 'booking_reference_number', 'reference_number');
    }

    public function tags()
    {
        return $this->hasMany(BookingTag::class, 'booking_id', 'id');
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class, 'booking_reference_number', 'reference_number');
    }
}
