<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class InvitersDoctors extends Model
{
    protected $table = "inviters_doctors";

    protected $fillable = [
        'officers_id', 
        'doctors_inviteds_id', 
        'doctors_inviters_id', 
        'accepted_at', 
        'rejected_at', 
        'status'
    ];

    protected $dates = [
        "created_at",
        "updated_at",
        "rejected_at",
        "accepted_at"
    ];
}
