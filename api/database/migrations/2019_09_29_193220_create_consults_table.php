<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateConsultsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('consults', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer("officers_id");
            $table->integer("patients_id");
            $table->integer("doctors_id");
            $table->integer("specialities_id")->nullable();
            $table->integer("plans_id")->nullable();
            $table->string("procediments");
            $table->string("descriptions")->nullable();
            $table->dateTime("started_at");
            $table->dateTime("finished_at");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('consults');
    }
}
