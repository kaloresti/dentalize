<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Helper extends Model
{
    protected $table = "helpers";

    protected $fillable = [
        "name", "postal_code", "uf", "city", "address", "users_id",
        "number", "district", "complementation", "phone", "celphone", "email", "rg", "cpf", "burned_at"
    ];

    protected $dates = [
        "created_at",
        "updated_at",
        "burned_at"
    ];
}
