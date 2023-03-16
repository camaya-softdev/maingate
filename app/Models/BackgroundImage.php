<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BackgroundImage extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function template()
    {
        return $this->hasOne(Template::class);
    }
}
