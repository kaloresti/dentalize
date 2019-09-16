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

        $invitedOfficers = DB::table('officers')
                    ->join('inviters_doctors', 'inviters_doctors.officers_id', '=', 'officers.id')
                    ->select('officers.id', 'officers.name')
                    ->where('inviters_doctors.doctors_inviteds_id', '=', $doctor->id)
                    ->get();
                    
        $officers = collect([$myOfficers, $invitedOfficers]);
        info(json_encode($officers));
        return response()->json(['success'=>true, 'message' => "Cadastro efetuado com sucesso!" , 'data' => $officers->all()], $this->successStatus);
    }

    public function loadDoctors(Request $request)
    {
        $user = Auth::user(); 

        $doctor = Doctor::where("users_id", $user->id)->get()[0];

        $input = json_decode($request->getContent());

        $doctors = DB::table('doctors')
                    ->join('')
                    ->select('officers.id', 'officers.name')
                    ->where('officers.doctors_id', '=', $doctor->id)
                    ->get();

        return response()->json(['success'=>true, 'message' => "Cadastro efetuado com sucesso!" , 'data' => $doctors], $this->successStatus);
    }
}
