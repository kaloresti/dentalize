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
Route::post('register_helper', 'API\UserController@registerHelper');

Route::get('list_plans', 'API\PlansController@listAll');
Route::get('list_specialities', 'API\SpecialitiesController@listAll');

Route::post('register_assistent', 'API\UserController@registerAssistent');

Route::group(['middleware' => 'auth:api'], function(){
    Route::post('details', 'API\UserController@details');

    Route::get('list_officers_for_doctors', 'API\OfficersController@listOfficersForDoctors');
    Route::post('register_officer', 'API\OfficersController@registerOfficer');

    Route::post('list_patients_for_doctors', 'API\PatientController@listPatientsForDoctors');
    Route::post('register_patient', 'API\PatientController@registerPatient');

    Route::post('list_invites_doctors_for_me', 'API\InvitersController@listInvitesDoctorToMe');
    Route::post('list_invites_helpers_for_me', 'API\InvitersController@listInvitesHelperToMe');
    Route::post('list_invites_by_me', 'API\InvitersController@listInvitesByMe');
    Route::post('create_invite', 'API\InvitersController@createInvite');
    Route::post('cancel_invite' , 'API\InvitersController@cancelInvite');
    Route::post('reject_invite' , 'API\InvitersController@rejectInvite');
    Route::post('resend_invite' , 'API\InvitersController@resendInvite');
    Route::post('accept_doctors_invite' , 'API\InvitersController@acceptDoctorsInvite');
    Route::post('accept_helpers_invite' , 'API\InvitersController@acceptHelpersInvite');

    Route::post('owner_clinical_consults/load_officers', 'API\ClinicalConsultsController@loadOfficers');
    Route::post('owner_clinical_consults/load_doctors', 'API\ClinicalConsultsController@loadDoctors');
    Route::post('owner_clinical_consults/load_create_consult', 'API\ClinicalConsultsController@loadCreateConsult');
    Route::post('owner_clinical_consults/create_consult', 'API\ClinicalConsultsController@createConsult');
    Route::post('owner_clinical_consults/load_consults', 'API\ClinicalConsultsController@loadConsults');
    Route::post('owner_clinical_consults/update_status', 'API\ClinicalConsultsController@updateStatus');

    Route::post('helper_clinical_consults/load_officers', 'API\ClinicalConsultsController@loadOfficersHelpers');
    Route::post('helper_clinical_consults/load_doctors', 'API\ClinicalConsultsController@loadDoctorsHelpers');
    Route::post('helper_clinical_consults/load_create_consult', 'API\ClinicalConsultsController@loadCreateConsultHelpers');
    Route::post('helper_clinical_consults/create_consult', 'API\ClinicalConsultsController@createConsultHelpers');
    Route::post('helper_clinical_consults/load_consults', 'API\ClinicalConsultsController@loadConsultHelpers');
    Route::post('helper_clinical_consults/update_status', 'API\ClinicalConsultsController@updateStatusHelpers');
});
