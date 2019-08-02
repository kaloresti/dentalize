<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\User; 
use App\Doctor; 
use Illuminate\Support\Facades\Auth; 
use Validator;

class UserController extends Controller
{
    public $successStatus = 200;
    
    /** 
     * login api 
     * 
     * @return \Illuminate\Http\Response 
     */    
    public function login(Request $request){ 
        
        $input = json_decode($request->getContent());
        info($input->email);
        $validator = Validator::make((array) json_decode($request->getContent()), [  
            'email' => 'required|email', 
            'password' => 'required' 
        ]);
        //info($validator->errors());
        if ($validator->fails()) { 
            return response()->json(['error'=>$validator->errors()], 401);            
        }
        //info($validator->errors());
        if ($validator->fails()) { 
            return response()->json(['error'=>$validator->errors()], 401);            
        }

        $existeUser = User::where(['email' => $input->email, 'password' => bcrypt($input->password)])->get(); 
        info($existeUser);
        if(isset($existeUser->email)){ 
            info("Achei o usuário");
            $user = Auth::user(); 
            
            $success['token'] =  $user->createToken('MyApp')->accessToken; 
            $success['name'] = $user->name;
            $success['profile_type'] = $user->profile_type;

            return response()->json(['success' => true, 'data' => $success, $this->successStatus]); 
        } 
        else{ 
            return response()->json(['error'=>['email' => ['Dados não conferem com nenhum usuário cadastrado, tente novamente com outro e-mail e/ou senha.'] ]], 401);
        } 
    }
    
    /** 
     * Register api 
     * 
     * @return \Illuminate\Http\Response 
     */ 
    public function registerDoctor(Request $request) 
    { 
        //info((array) json_decode($request->getContent()));
        $validator = Validator::make((array) json_decode($request->getContent()), [ 
            'name' => 'required', 
            'email' => 'required|email', 
            'password' => 'required', 
            'c_password' => 'required|same:password',
            'cpf' => 'required|min:11|max:15',
            'cro' => 'required|min:4|max:10',
            'cro_uf' => 'required', 
        ]);
        
        //info($validator->errors());
        if ($validator->fails()) { 
            return response()->json(['error'=>$validator->errors()], 401);            
        }
                
        // -- create user
        $input = json_decode($request->getContent());
        
        // -- validação de duplicidade
        $user = User::where('email', $input->email)->get()[0];
        if(isset($user->id))
        {
            return response()->json(['error'=>['email' => ['Este e-mail já está cadastrado em nossa base de dados'] ]], 401);  
        }
        $user = User::where('cpf', $input->cpf)->get()[0];
        if(isset($user->id))
        {
            return response()->json(['error'=>['email' => ['Este CPF já está cadastrado em nossa base de dados'] ]], 401);  
        }
        $user = User::where('cro', $input->cro)->get()[0];
        if(isset($user->id))
        {
            return response()->json(['error'=>['email' => ['Este CRO já está cadastrado em nossa base de dados'] ]], 401);  
        }

        //error_log(print_r($input, true), 0);
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

        $doctor->token = $success['token'];
        $doctor->profile_type = $user->profile_type;
        
        return response()->json(['success'=>true, 'message' => "Cadastro efetuado com sucesso!" , 'data' => $doctor], $this->successStatus); 
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
