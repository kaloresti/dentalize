<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Officer extends Model
{
    protected $table = "officers";

    protected $fillable = [
        "name", "postal_code", "uf", "city", "address", 'doctors_id',
        "number", "district", "complementation", "phone", "celphone", "email", "hours_open_id"
    ];

}
