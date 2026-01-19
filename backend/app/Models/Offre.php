<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Offre extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'titre',
        'description',
        'prix',
        'categorie',
        'wilaya',
        'commune',
        'etat',
        'statut',
        'images',
        'numde_telephone',
        'vues'
    ];

    protected $casts = [
        'images' => 'array',
        'prix' => 'decimal:2',
        'vues' => 'integer'
    ];

    // Relation avec User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
