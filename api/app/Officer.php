<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Officer extends Model
{
    protected $table = "officers";

    protected $fillable = [
        "name", "postal_code", "uf", "city", "address", 'doctors_id', "unique_code_cfo",
        "number", "district", "complementation", "phone", "celphone", "email", "hours_open_id", "unique_code_cfo"
    ];

    static function rules()
    {
        return [  
            'name' => 'required', 
            'postal_code' => 'required',
            'unique_code_cfo' => 'required',
            'uf' => 'required',
            'city' => 'required',
            'district' => 'required',
            'number' => 'required',
            'celphone' => 'required',
            'email' => 'required|email',
            'unique_code_cfo' => 'required'
        ];
    }

}
