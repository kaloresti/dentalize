<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth; 
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;
use Validator;
use App\User; 
use App\Doctor; 
use App\Officer;
use App\DentalPlans;
use App\Patient;
use App\OfficersHasPatients;
use App\Consults;

class ClinicalConsultsController extends Controller
{
    public $successStatus = 200;

    public function loadOfficers(Request $request)
    {
        $user = Auth::user(); 

        $doctor = Doctor::where("users_id", $user->id)->get()[0];

        $myOfficers = DB::table('officers')
                    ->select('officers.id', 'officers.name')
                    ->where('officers.doctors_id', '=', $doctor->id)
                    ->get();

       /*  $invitedOfficers = DB::table('officers')
                    ->join('inviters_doctors', 'inviters_doctors.officers_id', '=', 'officers.id')
                    ->select('officers.id', 'officers.name')
                    ->where('inviters_doctors.doctors_inviteds_id', '=', $doctor->id)
                    ->get(); */
                    
        //$officers = collect([$myOfficers, $invitedOfficers]);
        
        //$arrayOfficers = $this->array_union($officers);
        
        //info(json_encode($arrayOfficers));
        
        return response()->json(['success'=>true, 'message' => "Cadastro efetuado com sucesso!" , 'data' => $myOfficers], $this->successStatus);
    }

    public function loadDoctors(Request $request)
    {
        $user = Auth::user(); 

        $doctor = Doctor::where("users_id", $user->id)->get()[0];

        $input = json_decode($request->getContent());

        $doctors = DB::table('doctors')
                    ->join('officers', 'officers.doctors_id', '=', 'doctors.id')
                    ->select('doctors.*')
                    ->where('officers.id', '=', $input->officers_id)
                    ->get();

        $invitedDoctors = DB::table('doctors')
            ->join('inviters_doctors', 'doctors.id', '=', 'inviters_doctors.doctors_inviteds_id')
            //->join('officers', 'officers.id', '=', 'inviters_doctors.officers_id')
            ->select('doctors.*')
            ->where('inviters_doctors.officers_id', '=', $input->officers_id)
            ->where('inviters_doctors.doctors_inviters_id', '=', $doctor->id)
                    ->get();

        $doctors = collect([$doctors, $invitedDoctors]);
        //info(json_encode($doctors));
        $arrayDoctors = $this->array_union($doctors);

        return response()->json(['success'=>true, 'message' => "Cadastro efetuado com sucesso!" , 'data' => $arrayDoctors], $this->successStatus);
    }

    public function loadCreateConsult(Request $request)
    {
        $user = Auth::user(); 

        //$doctor = Doctor::where("users_id", $user->id)->get()[0];
        $input = json_decode($request->getContent());

        $specialities = DB::table('specialities')
                    ->join('doctor_has_specialities', 'doctor_has_specialities.specialities_id', '=', 'specialities.id')
                    ->join('doctors', 'doctor_has_specialities.doctors_id', '=', 'doctors.id')
                    ->select('specialities.*')
                    ->where('doctors.id', '=', $input->doctors_id)
                    ->get();

        $plans = DB::table('dental_plans')
            ->join('officers_has_dental_plans', 'officers_has_dental_plans.dental_plans_id', '=', 'dental_plans.id')
            ->join('officers', 'officers.id', '=', 'officers_has_dental_plans.officers_id')
            ->select('dental_plans.*')
            ->where('officers.id', '=', $input->officers_id)
            ->get();

        $patients = DB::table('patients')
            ->join('officers_has_patients', 'officers_has_patients.patients_id', '=', 'patients.id')
            ->select('patients.*')
            ->where('officers_has_patients.officers_id', '=', $input->officers_id)
            ->get();

        $data = ['plans' => $plans, "specialities" => $specialities, "patients" => $patients];
        //info(json_encode($data));
        return response()->json(['success'=>true, 'message' => "Cadastro efetuado com sucesso!" , 'data' => $data], $this->successStatus);
    }

    public function createConsult(Request $request)
    {
        info("CRIAR CONSULTA");
        info(json_encode($request->all()));
        $validator = Validator::make((array) json_decode($request->getContent()), [ 
            'doctors_id' => 'numeric|min:1', 
            'patients_id' => 'numeric|min:1', 
            'officers_id' => 'numeric|min:1', 
            'procediments' => 'required|min:10',
            'started_at' => 'required',
            'finished_at' => 'required' 
        ]);

        if ($validator->fails()) { 
            return response()->json(['error'=>$validator->errors()], 401);            
        }
                
        $input = json_decode($request->getContent());

        $consult = Consults::create([
            'doctors_id' => $input->doctors_id, 
            'patients_id' => $input->patients_id, 
            'officers_id' => $input->officers_id, 
            'procediments' => $input->procediments,
            'started_at' => date('Y-m-d h:i:s', strtotime( $input->started_at )),
            'finished_at' => date('Y-m-d h:i:s', strtotime( $input->finished_at )),
            'descriptions' => $input->descriptions,
            'specialities_id' => $input->specialities_id,
            'plans_id' => $input->plans_id,
        ]);
        
        return response()->json(['success'=>true, 'message' => "Cadastro efetuado com sucesso!" , 'data' => $consult], $this->successStatus); 
    }

    function loadConsults(Request $request)
    {   
        $input = json_decode($request->getContent());
        info(json_encode($request->all()));
        $consults = DB::table('consults')
            ->join('patients', 'patients.id', '=', 'consults.patients_id')
            ->join('doctors', 'doctors.id', '=', 'consults.doctors_id')
            ->join('officers', 'officers.id', '=', 'consults.officers_id')
            ->leftJoin('dental_plans', 'dental_plans.id', '=', 'consults.plans_id')
            ->leftJoin('specialities', 'specialities.id', '=', 'consults.specialities_id')
            ->select('consults.*','officers.name as officer' ,'patients.name as patient', 'patients.celphone as celphone', 'patients.email as email', 'doctors.name as doctor')
            ->whereBetween('consults.started_at', [$input->startDate, $input->endDate])->get();
        info(json_encode($consults));
        return response()->json(['success'=>true, 'message' => "Cadastro efetuado com sucesso!" , 'data' => $consults], $this->successStatus); 
    }

    function array_union($collect)
    { 
        $return = [];

        foreach($collect as $col)
        {
            foreach($col as $c)
            {
                array_push($return, $c);
            }
        }

        return $return;
    }
}
