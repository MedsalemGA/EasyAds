<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class EmailVerification extends Model
{
    protected $fillable = [
        'adressemail',
        'code',
        'expires_at',
        'is_verified'
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'is_verified' => 'boolean'
    ];

    /**
     * Vérifier si le code est expiré
     */
    public function isExpired(): bool
    {
        return Carbon::now()->greaterThan($this->expires_at);
    }

    /**
     * Générer un code de vérification à 6 chiffres
     */
    public static function generateCode(): string
    {
        return str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    }

    /**
     * Créer ou mettre à jour un code de vérification
     */
    public static function createVerificationCode(string $email): self
    {
        // Supprimer les anciens codes non vérifiés pour cet email
        self::where('adressemail', $email)
            ->where('is_verified', false)
            ->delete();

        // Créer un nouveau code valide pour 15 minutes
        return self::create([
            'adressemail' => $email,
            'code' => self::generateCode(),
            'expires_at' => Carbon::now()->addMinutes(15),
            'is_verified' => false
        ]);
    }

    /**
     * Vérifier un code
     */
    public static function verifyCode(string $email, string $code): bool
    {
        $verification = self::where('adressemail', $email)
            ->where('code', $code)
            ->where('is_verified', false)
            ->first();

        if (!$verification) {
            return false;
        }

        if ($verification->isExpired()) {
            return false;
        }

        // Marquer comme vérifié
        $verification->update(['is_verified' => true]);

        return true;
    }
}
