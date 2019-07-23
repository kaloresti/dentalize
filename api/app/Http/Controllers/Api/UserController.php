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
    public function login(){ 
        info($request->getContent());
        if(Auth::attempt(['email' => request('email'), 'password' => request('password')])){ 
            $user = Auth::user(); 
            $success['token'] =  $user->createToken('MyApp')-> accessToken; 
            return response()->json(['success' => true, 'data' => $success['token']], $this-> successStatus); 
        } 
        else{ 
            return response()->json(['error'=>'Unauthorised'], 401); 
        } 
    }
    
    /** 
     * Register api 
     * 
     * @return \Illuminate\Http\Response 
     */ 
    public function registerDoctor(Request $request) 
    { 
        info($request->getContent());
        $validator = Validator::make($request->all(), [ 
            'name' => 'required', 
            'email' => 'required|email', 
            'password' => 'required', 
            'c_password' => 'required|same:password',
            'cpf' => 'required',
            'cro' => 'required',
            'cro_uf' => 'required', 
        ]);

        if ($validator->fails()) { 
            return response()->json(['error'=>$validator->errors()], 401);            
        }
                
        // -- create user
        $input = $request->all(); 
        $input['password'] = bcrypt($input['password']); 
        $user = User::create($input); 
        $success['token'] =  $user->createToken('MyApp')->accessToken; 
        $success['name'] =  $user->name;

        // -- create doctor
        $createDoctor = [
            'name' => $input['name'],
            'cro' => $input['cro'],
            'cro_uf' => $input['cro_uf'],
            'cpf' => $input['cpf'],
            'users_id' => $user->id
        ];
        
        $doctor = Doctor::create($createDoctor);

        $doctor->token = $success['token'];

        return response()->json(['success'=>true, 'message' => "Cadastro efetuado com sucesso!" ,'data'=>$doctor], $this->successStatus); 
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
