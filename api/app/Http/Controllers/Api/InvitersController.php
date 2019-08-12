<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth; 
use Illuminate\Support\Facades\DB;
use Validator;

use App\InvitersHelpers;
use App\InvitersDoctors;
use App\Helper;
use App\Officer;
use App\Doctor;

class InvitersController extends Controller
{
    public $successStatus = 200;

    public function listInvitesForMe(Request $request)
    {
        $user = Auth::user(); 
        $doctor = Doctor::where('users_id', $user->id)->get()[0];

        $invitesForMe = [];

        $input = json_decode($request->getContent());
    }
    
    public function listInvitesByMe(Request $request)
    {
        $user = Auth::user(); 
        $doctor = Doctor::where('users_id', $user->id)->get()[0];
        
        $input = json_decode($request->getContent());

        $invitesByMe = DB::table('inviters_helpers')
            ->join('helpers', 'helpers.id','inviters_helpers.helpers_id')
            ->join('doctors', 'doctors.id' , 'inviters_helpers.doctors_id')
            ->join('officers', 'officers.id' , 'inviters_helpers.officers_id')
            ->select(
                        'inviters_helpers.id as id',
                        'helpers.name as helper',
                        'doctors.name as doctor',
                        'officers.name as officer',
                        'inviters_helpers.created_at as cadastrado_em',
                        'inviters_helpers.accepted_at as aceito_em',
                        'inviters_helpers.rejected_at as rejeitado_em',
                        'inviters_helpers.status as status'
                    )
            ->where('inviters_helpers.doctors_id', $doctor->id)
            //->orderBy('')
            ->get();
        //info("Registros ".count($invitesByMe));        
        return response()->json(['success'=>true, 'message' => "Cadastro efetuado com sucesso!" , 'data' => $invitesByMe], $this->successStatus);
    }

    public function createInvite(Request $request)
    {
        $user = Auth::user(); 
        $doctor = Doctor::where('users_id', $user->id)->get()[0];

        $validator = Validator::make((array) json_decode($request->getContent()), [  
            'typeHelper' => 'required', 
            'officers_id' => 'required',
            'cpf' => 'required',
            
        ]);
        
        if ($validator->fails()) { 
            return response()->json(['error'=>['todos os campos são obrigatórios']], 401);            
        }

        $input = json_decode($request->getContent());

        if($doctor->cpf == $input->cpf)
        {
            return response()->json(['error'=> ["Você não pode enviar convites para si"]], 401);
        }

        if($input->typeHelper == 'auxiliar')
        {
            $helper = Helper::where('cpf', $input->cpf)->get();

            if(isset($helper[0]->id))
            {
                $existeBefore = InvitersHelpers::where([
                    ["doctors_id", '=', $doctor->id],
                    ["helpers_id", '=', $helper[0]->id],
                    ["officers_id", "=", $input->officers_id]
                    //["status", "=", 'pendente']
                ])->get();
                
                if(!isset($existeBefore[0]->helpers_id))
                {
                    $createInviteHelper = [
                        'officers_id' => $input->officers_id, 
                        'helpers_id' => $helper[0]->id, 
                        'doctors_id' => $doctor->id, 
                        'accepted_at' => null, 
                        'rejected_at' => null, 
                        'status' => 'pendente'
                    ];
    
                    $inviteHelper = InvitersHelpers::create($createInviteHelper);
    
                    return response()->json(['success'=>true, 'message' => "Cadastro efetuado com sucesso!" , 'data' => $createInviteHelper], $this->successStatus);

                }else {
                    return response()->json(['error'=> ["Existe um convite para este auxiliar."]], 401); 
                }
            } else{
                return response()->json(['error'=> ["Não econtramos auxiliares com este CPF."]], 401); 
            }
        } else {

            $doctorInvited = Doctor::where('cpf', $input->cpf)->get();
            if(isset($doctorInvited[0]->id))
            {
                $existeBefore = InvitersDoctors::where([
                    ["doctors_inviters_id", '=', $doctor->id],
                    ["doctors_inviteds_id", '=', $doctorInvited[0]->id],
                    ["officers_id", "=", $input->officers_id]
                    //["status", "=", 'pendente']
                ])->get();
                
                if(!isset($existeBefore[0]->doctors_inviteds_id))
                {
                    $createInviteDoctor = [
                        'officers_id' => $input->officers_id, 
                        'doctors_inviteds_id' => $doctorInvited[0]->id, 
                        'doctors_inviters_id' => $doctor->id, 
                        'accepted_at' => null, 
                        'rejected_at' => null, 
                        'status' => 'pendente'
                    ];

                    $inviteDoctor = InvitersDoctors::create($createInviteDoctor);

                    return response()->json(['success'=>true, 'message' => "Cadastro efetuado com sucesso!" , 'data' => $createInviteDoctor], $this->successStatus);
                } else {
                    return response()->json(['error'=> ["Existe um convite para este dentista."]], 401); 
                }
            } else{
                return response()->json(['error'=> ["Não econtramos odontólogos com este CPF."]], 401); 
            }
        }
    }

    public function cancelInvite(Request $request)
    {
        $user = Auth::user(); 
        $doctor = Doctor::where('users_id', $user->id)->get()[0];

        $input = json_decode($request->getContent());

        if($input->typeHelper == 'auxiliar')
        {
            DB::table('inviters_helpers')->where("id", $input->idInvite)
                ->update([
                    "status" => "cancelado"
                ]);
                return response()->json(['success'=>true, 'message' => "Cadastro efetuado com sucesso!" , 'data' => []], $this->successStatus);
        }

    }

    public function resendInvite(Request $request)
    {
        $user = Auth::user(); 
        $doctor = Doctor::where('users_id', $user->id)->get()[0];

        $input = json_decode($request->getContent());

        if($input->typeHelper == 'auxiliar')
        {
            DB::table('inviters_helpers')->where("id", $input->idInvite)
                ->update([
                    "status" => "pendente"
                ]);
                return response()->json(['success'=>true, 'message' => "Cadastro efetuado com sucesso!" , 'data' => []], $this->successStatus);
        }else {
            DB::table('inviters_doctors')->where("id", $input->idInvite)
            ->update([
                "status" => "pendente"
            ]);
            return response()->json(['success'=>true, 'message' => "Cadastro efetuado com sucesso!" , 'data' => []], $this->successStatus);
        }

    }
}
