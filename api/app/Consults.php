<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Laravel\Passport\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Consults extends Model
{
    use HasApiTokens, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $table = "consults";

    protected $fillable = [
        'doctors_id', 
        'patients_id', 
        'officers_id', 
        'procediments',
        'descriptions',
        'specialities_id',
        'plans_id',
        'started_at',
        'finished_at'
    ];
}
