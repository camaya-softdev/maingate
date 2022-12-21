<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SecurityCheck extends Model
{
    use HasFactory;

    protected $guarded = [];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'checklists' => 'array',
        'additional_vehicles' => 'array',
        'additional_guests' => 'array',
        'action_taken' => 'array',
        'guest_vehicles' => 'array',
        'booking_guest_vehicles' => 'array',
    ];

    public function pass()
    {
        return $this->belongsTo(Pass::class, 'booking_reference_number', 'reference_number');
    }

    public function tap()
    {
        return $this->belongsTo(Tap::class);
    }
}
