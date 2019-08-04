<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DentalPlan extends Model
{
    protected $table = "dental_plans";

    protected $fillable = [
        "name", "uf"
    ];

}
