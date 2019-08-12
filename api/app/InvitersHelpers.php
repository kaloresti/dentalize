<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class InvitersHelpers extends Model
{
    protected $table = "inviters_helpers";

    protected $fillable = [
        'officers_id', 'doctors_id', 'helpers_id', 'accepted_at', 'rejected_at', 'status'
    ];

    protected $dates = [
        "created_at",
        "updated_at",
        "rejected_at",
        "accepted_at"
    ];
}
