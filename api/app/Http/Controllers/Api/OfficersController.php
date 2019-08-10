<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth; 
use Illuminate\Support\Facades\DB;
use Validator;
use App\User; 
use App\Doctor; 
use App\Officer;
use App\DentalPlans;
use App\OfficersHasDentalPlans;
use App\DoctorHasSpecialities;

class OfficersController extends Controller
{
    public $successStatus = 200;

    public function registerOfficer(Request $request)
    {
        $user = Auth::user(); 

        $doctor = Doctor::where("users_id", $user->id)->get()[0];

        $input = json_decode($request->getContent());
        
        $validator = Validator::make((array) json_decode($request->getContent()), Officer::rules());
        
        if ($validator->fails()) { 
            return response()->json(['error'=>$validator->errors()], 401);            
        }

        $existeOfficer = Officer::where("unique_code_cfo", $input->unique_code_cfo)->get();
        if(isset($existeOfficer[0]->id))
        {
            return response()->json(['error'=> ["Este consultório já está cadastrado, contate o responsável para obter mais informações."]], 401);
        }

        $createOfficers = Officer::create([
            "doctors_id" => $doctor->id,
            "name" => $input->name,
            "email" => $input->email,
            'postal_code' =>  $input->postal_code,
            'uf' =>  $input->uf,
            'city' =>  $input->city,
            'district' =>  $input->district,
            'address' =>  $input->address,
            'number' =>  $input->number,
            'celphone' =>  $input->celphone,
            'email' =>  $input->email,
            'unique_code_cfo' => $input->unique_code_cfo,
            "hours_open_id" => 1
        ]);

        foreach($input->plans as $plan)
        {
            OfficersHasDentalPlans::create([
                "officers_id" => $createOfficers->id,
                "dental_plans_id" => $plan
            ]);
        }

        return response()->json(['success'=>true, 'message' => "Cadastro efetuado com sucesso!" , 'data' => $createOfficers], $this->successStatus); 
    }

    public function listOfficersForDoctors()
    {
        $user = Auth::user(); 

        $doctor = Doctor::where("users_id", $user->id)->get()[0];
                    
        $officers = Officer::where("doctors_id", $doctor->id)->get(); 

        return response()->json(['success'=>true, 'message' => "Dados resgatados com sucesso!" , 'data' =>  $officers], $this->successStatus);
    }
}
