<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('login', 'API\UserController@login');
Route::post('register_doctor', 'API\UserController@registerDoctor');
Route::post('register_officer', 'API\OfficersController@registerOfficer');
Route::get('list_officers_for_doctors/{doctors_id}', 'API\OfficersController@listOfficersForDcotors');

Route::get('list_plans', 'API\PlansController@listAll');
Route::get('list_specialities', 'API\SpecialitiesController@listAll');

Route::post('register_assistent', 'API\UserController@registerAssistent');

Route::group(['middleware' => 'auth:api'], function(){
    Route::post('details', 'API\UserController@details');
});