<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class OfficersHasDentalPlans extends Model
{
    protected $table = "officers_has_dental_plans";

    protected $fillable = [
        "officers_id", "dental_plans_id"
    ];
}
