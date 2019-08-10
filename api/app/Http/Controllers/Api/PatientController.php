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
use App\Patient;
use App\OfficersHasPatients;


class PatientController extends Controller
{
    public $successStatus = 200;

    public function registerPatient(Request $request)
    {
        $user = Auth::user(); 

        $doctor = Doctor::where("users_id", $user->id)->get()[0];

        $input = json_decode($request->getContent());

        $validator = Validator::make((array) json_decode($request->getContent()), [  
            'name' => 'required', 
            'postal_code' => 'required',
            'uf' => 'required',
            'city' => 'required',
            'district' => 'required',
            'number' => 'required',
            'celphone' => 'required',
            'email' => 'required|email',
            'rg' => 'required',
            'cpf' => 'required',
            'burned_at' => 'required',
            'plans_id' => 'required|min:1',
            'officers_id' => 'required|min:1',
        ]);
        
        if ($validator->fails()) { 
            return response()->json(['error'=>$validator->errors()], 401);            
        }

        $existeCpf = Pacient::where("cpf", $input->cpf)->get();

        if(isset($existeCpf[0]->id))
        {
            $eMeuPaciente = OfficersHasPacients::where(["pacients_id" => $existeCpf[0]->id, "doctors_id" => $doctor->id])->get();

            if(isset($eMeuPaciente[0]->doctors_id))
            {
                return response()->json(['error'=> ["Este paciente já está vinculado a você."]], 401); 
            }
        }

        if(!isset($existeCpf[0])) {
            $createPatient = Patient::create([
                'name' => $input->name, 
                'postal_code' => $input->postal_code, 
                'uf' => $input->uf, 
                'city' => $input->city, 
                'district' => $input->district, 
                'address' => $input->address,
                'number' => $input->number, 
                'celphone' => $input->celphone, 
                'phone' => $input->phone,
                'email' => $input->email, 
                'rg' => $input->rg, 
                'cpf' => $input->cpf, 
                'burned_at' => date('Y-m-d', strtotime($input->burned_at)) ,
                'plans_id' => $input->plans_id,
            ]);

            $idPatients = $createPatient->id;

        } else {
            $idPatients = $existeCpf[0]->id;
        }
        
        $createOfficersHasPatient = OfficersHasPatients::create([
            "officers_id" => $input->officers_id,
            "doctors_id" => $doctor->id,
            "patients_id" => $idPatients
        ]);

        return response()->json(['success'=>true, 'message' => "Cadastro efetuado com sucesso!" , 'data' => $createPatient], $this->successStatus); 
    }

    public function listPatientsForDoctors(Request $request)
    {
        $user = Auth::user(); 

        $doctor = Doctor::where("users_id", $user->id)->get()[0];

        $input = json_decode($request->getContent());

        $patients = DB::table("patients")
                        ->join("officers_has_patients", "patients.id", "=", "officers_has_patients.patients_id")
                        //->where("officers_has_patients.officers_id", $input->officers_id)
                        ->where("officers_has_patients.doctors_id", $doctor->id)
                        ->get();                                                                                                                                                                                                                         
        
        return response()->json(['success'=>true, 'message' => "Cadastro efetuado com sucesso!" , 'data' => $patients], $this->successStatus);
    }
}
