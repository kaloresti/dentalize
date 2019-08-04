<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth; 
use Validator;

use App\User; 
use App\DentalPlan; 

class PlansController extends Controller
{
    public $successStatus = 200;

    public function listAll()
    {
        return response()->json(['success'=>true, 'message' => "Dados resgatados com sucesso!" , 'data' => DentalPlan::all()], $this->successStatus);
    }
}
