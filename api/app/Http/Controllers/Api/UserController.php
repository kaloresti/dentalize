<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth; 
use Validator;
use Illuminate\Support\Facades\Hash;

use App\User; 
use App\Doctor; 
use App\DoctorHasSpecialities;
use App\Helper;

class UserController extends Controller
{
    public $successStatus = 200;
    
    /** 
     * login api 
     * 
     * @return \Illuminate\Http\Response 
     */    
    public function login(Request $request){ 
        /* info("LOGIN");
        info($request->getContent());
        $testeSenha = json_decode($request->getContent());
        info("senha encryptada: ".bcrypt($testeSenha->password)); */

        $input = json_decode($request->getContent());
        
        $validator = Validator::make((array) json_decode($request->getContent()), [  
            'email' => 'required|email', 
            'password' => 'required' 
        ]);
        
        if ($validator->fails()) { 
            return response()->json(['error'=>$validator->errors()], 401);            
        }

        $senhaDigitada = ($input->password);
        $existeUser = User::where('email' , $input->email)->get(); 
        
        if(isset($existeUser[0]->email)){ 
        
            if(password_verify($senhaDigitada, $existeUser[0]->password)){
                //$user = Auth::user(); 
                $success['token'] =  $existeUser[0]->createToken('MyApp')->accessToken; 
                $success['name'] = $existeUser[0]->name;
                $success['profile_type'] = $existeUser[0]->profile_type;
                //$user->token = $success['token'];
    
                return response()->json(['success' => true, 'data' => $success, $this->successStatus]);
            }else {
                return response()->json(['error'=>['email' => ['Dados não conferem com algum usuário cadastrado, tente novamente com outro e-mail e/ou senha.'] ]], 401);
            } 
        } 
        else{ 
            return response()->json(['error'=>['email' => ['Dados não conferem com algum usuário cadastrado, tente novamente com outro e-mail e/ou senha.'] ]], 401);
        } 
    }
    
    /** 
     * Register api 
     * 
     * @return \Illuminate\Http\Response 
     */ 
    public function registerDoctor(Request $request) 
    { 
        info("REGISTER_DOCTOR");
        info($request->getContent());
        $testeSenha = json_decode($request->getContent());
        info("senha encryptada: ".bcrypt($testeSenha->password));
        
        $validator = Validator::make((array) json_decode($request->getContent()), [ 
            'name' => 'required', 
            'email' => 'required|email', 
            'password' => 'required', 
            'c_password' => 'required|same:password',
            'cpf' => 'required|min:11|max:15',
            'cro' => 'required|min:4|max:10',
            'cro_uf' => 'required', 
        ]);

        if ($validator->fails()) { 
            return response()->json(['error'=>$validator->errors()], 401);            
        }
                
        $input = json_decode($request->getContent());
        
        // -- validação de duplicidade
        $user = User::where('email', $input->email)->get();
        if(isset($user[0]->id))
        {
            return response()->json(['error'=>['email' => ['Este e-mail já está cadastrado em nossa base de dados'] ]], 401);  
        }
        $user = Doctor::where('cpf', $input->cpf)->get();
        if(isset($user[0]->id))
        {
            return response()->json(['error'=>['email' => ['Este CPF já está cadastrado em nossa base de dados'] ]], 401);  
        }
        $user = Doctor::where('cro', $input->cro)->get();
        if(isset($user[0]->id))
        {
            return response()->json(['error'=>['email' => ['Este CRO já está cadastrado em nossa base de dados'] ]], 401);  
        }

        $input->password = bcrypt($input->password); 
        $user = User::create([
            "name" => $input->name,
            "password" => $input->password,
            "email" => $input->email,
            "profile_type" => 'odontologo'
        ]); 
        $success['token'] =  $user->createToken('MyApp')->accessToken; 
        $success['name'] =  $user->name;

        // -- create doctor
        $createDoctor = [
            'name' => $input->name,
            'cro' => $input->cro,
            'cro_uf' => $input->cro_uf,
            'cpf' => $input->cpf,
            'users_id' => $user->id
        ];
        
        $doctor = Doctor::create($createDoctor);

        // -- relacionamento entre dentistas e especialidades
        $specialities = $input->specialities;

        foreach($specialities as $specialitie)
        {
            DoctorHasSpecialities::create([
                "doctors_id" => $doctor->id,
                "specialities_id" => $specialitie
            ]);
        }

        $doctor->token = $success['token'];
        $doctor->profile_type = $user->profile_type;
        
        return response()->json(['success'=>true, 'message' => "Cadastro efetuado com sucesso!" , 'data' => $doctor], $this->successStatus); 
    }
    
    public function registerHelper(Request $request)
    {
        //info($request->getContent());
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
            //'plans_id' => 'required|min:1',
            //'officers_id' => 'required|min:1',
        ]);
        if ($validator->fails()) { 
            return response()->json(['error'=>$validator->errors()], 401);            
        }
                
        $input = json_decode($request->getContent());
        
        // -- validação de duplicidade
        $user = User::where('email', $input->email)->get();
        if(isset($user[0]->id))
        {
            return response()->json(['error'=>['email' => ['Este e-mail já está cadastrado em nossa base de dados'] ]], 401);  
        }
        $user = Doctor::where('cpf', $input->cpf)->get();
        if(isset($user[0]->id))
        {
            return response()->json(['error'=>['email' => ['Este CPF já está cadastrado em nossa base de dados'] ]], 401);  
        }

        $input->password = bcrypt($input->password); 
        $user = User::create([
            "name" => $input->name,
            "password" => $input->password,
            "email" => $input->email,
            "profile_type" => 'auxiliar'
        ]); 
        $success['token'] =  $user->createToken('MyApp')->accessToken; 
        $success['name'] =  $user->name;

        $createHelper = Helper::create([
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
            "users_id" => $user->id
            //'plans_id' => $input->plans_id,
        ]);

        $createHelper->token = $success['token'];
        $createHelper->profile_type = $user->profile_type;
        
        return response()->json(['success'=>true, 'message' => "Cadastro efetuado com sucesso!" , 'data' => $createHelper], $this->successStatus); 
    }
    /** 
     * details api 
     * 
     * @return \Illuminate\Http\Response 
     */ 
    public function details() 
    { 
        $user = Auth::user(); 
        return response()->json(['success' => $user], $this-> successStatus); 
    } 
}
