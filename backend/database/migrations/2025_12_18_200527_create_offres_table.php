<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('offres', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('titre');
            $table->text('description');
            $table->decimal('prix', 10, 2);
            $table->string('categorie');
            $table->string('wilaya');
            $table->string('commune')->nullable();
            $table->enum('etat', ['neuf', 'bon', 'moyen', 'usage'])->default('bon');
            $table->enum('statut', ['active', 'vendue', 'expiree', 'suspendue'])->default('active');
            $table->json('images')->nullable();
            $table->string('numde_telephone');
            $table->integer('vues')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offres');
    }
};
