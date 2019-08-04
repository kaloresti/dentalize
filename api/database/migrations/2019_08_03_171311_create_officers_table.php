<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOfficersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('officers', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->string('postal_code');
            $table->string('uf');
            $table->string('city');
            $table->string('address');
            $table->string('number');
            $table->string('district');
            $table->string('complementation')->nullable();
            $table->string('phone')->nullable();
            $table->string('celphone');
            $table->string('email');
            $table->integer('hours_open_id');
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
        Schema::dropIfExists('officers');
    }
}
