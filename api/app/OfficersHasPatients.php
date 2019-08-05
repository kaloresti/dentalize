<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class OfficersHasPatients extends Model
{
    protected $table = "officers_has_patients";

    protected $fillable = [
        "officers_id", "patients_id", "doctors_id"
    ];

}
