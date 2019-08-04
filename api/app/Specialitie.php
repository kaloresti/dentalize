<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Specialitie extends Model
{
    protected $table = "specialities";

    protected $fillable = [
        "name"
    ];
}
