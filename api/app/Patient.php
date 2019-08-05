<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    protected $table = "patients";

    protected $fillable = [
        "name", "postal_code", "uf", "city", "address", 'doctors_id',
        "number", "district", "complementation", "phone", "celphone", "email", "rg", "cpf", "burned_at", "plans_id"
    ];

    protected $dates = [
        "created_at",
        "updated_at",
        "burned_at"
    ];
}
