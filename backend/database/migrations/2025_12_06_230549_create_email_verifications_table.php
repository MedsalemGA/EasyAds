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
        Schema::create('email_verifications', function (Blueprint $table) {
            $table->id();
            $table->string('adressemail')->index();
            $table->string('code', 6); // Code à 6 chiffres
            $table->timestamp('expires_at'); // Date d'expiration du code
            $table->boolean('is_verified')->default(false);
            $table->timestamps();

            // Index pour améliorer les performances de recherche
            $table->index(['adressemail', 'code']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('email_verifications');
    }
};
