<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'nom' => 'Admin User',
                'adressemail' => 'admin@gmail.com',
                'password' => Hash::make('admin123'),
                'numde_telephone' => '0555111111',
                'wilaya' => 'Alger',
                'role' => 'admin',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Client User',
                'adressemail' => 'client@gmail.com',
                'password' => Hash::make('client123'),
                'numde_telephone' => '0555222222',
                'wilaya' => 'Oran',
                'role' => 'client',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Seller User',
                'adressemail' => 'seller@gmail.com',
                'password' => Hash::make('seller123'),
                'numde_telephone' => '0555333333',
                'wilaya' => 'Constantine',
                'role' => 'seller',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
