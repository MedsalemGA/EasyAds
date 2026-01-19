<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'nom','numde_telephone','adressemail', 'password','wilaya', 'role',
    ];

    protected $hidden = [
        'password',
    ];

    // Specify the custom username field
    public function getAuthIdentifierName()
    {
        return 'adressemail';
    }

   
}
