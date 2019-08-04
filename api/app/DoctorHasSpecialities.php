<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DoctorHasSpecialities extends Model
{
    protected $table = "doctor_has_specialities";

    protected $fillable = [
        "doctors_id", "specialities_id"
    ];

}
