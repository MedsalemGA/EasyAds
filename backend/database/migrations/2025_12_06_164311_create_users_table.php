<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
public function up()
{
    Schema::create('users', function (Blueprint $table) {
        $table->id();
        $table->string('nom');
        $table->string('role');
        $table->string('adressemail')->unique();
        $table->string('wilaya');
        $table->string('numde_telephone')->unique();
        $table->string('password');
        $table->timestamps();
    });
}

};
