<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\EmailVerification;
use App\Mail\VerificationCodeMail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;


class AuthController extends Controller
{
    // Register - Étape 1: Créer l'utilisateur et envoyer le code
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'adressemail' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'numde_telephone' => 'required|string|unique:users',
            'wilaya' => 'required|string|max:255',
            'role' => 'required|string|in:client,admin,seller',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Créer l'utilisateur (non vérifié)
        $user = User::create([
            'nom' => $request->nom,
            'adressemail' => $request->adressemail,
            'password' => Hash::make($request->password),
            'numde_telephone' => $request->numde_telephone,
            'wilaya' => $request->wilaya,
            'role' => $request->role,
        ]);

        // Générer et envoyer le code de vérification
        $verification = EmailVerification::createVerificationCode($request->adressemail);

        try {
            Mail::to($request->adressemail)->send(
                new VerificationCodeMail($verification->code, $request->nom)
            );
        } catch (\Exception $e) {
            // Si l'envoi échoue, supprimer l'utilisateur créé
            $user->delete();
            return response()->json([
                'error' => 'Erreur lors de l\'envoi de l\'email de vérification',
                'details' => $e->getMessage()
            ], 500);
        }

        return response()->json([
            'message' => 'Compte créé avec succès. Veuillez vérifier votre email.',
            'email' => $request->adressemail,
            'requires_verification' => true
        ], 201);
    }

    // Vérifier le code email
    public function verifyEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'adressemail' => 'required|email',
            'code' => 'required|string|size:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Vérifier le code
        $isValid = EmailVerification::verifyCode($request->adressemail, $request->code);

        if (!$isValid) {
            return response()->json([
                'error' => 'Code invalide ou expiré'
            ], 400);
        }

        // Récupérer l'utilisateur et générer le token Sanctum
        $user = User::where('adressemail', $request->adressemail)->first();

        if (!$user) {
            return response()->json(['error' => 'Utilisateur non trouvé'], 404);
        }

        // Créer un token Sanctum
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Email vérifié avec succès',
            'token' => $token,
            'token_type' => 'bearer',
            'user' => $user
        ], 200);
    }

    // Renvoyer le code de vérification
    public function resendVerificationCode(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'adressemail' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Vérifier que l'utilisateur existe
        $user = User::where('adressemail', $request->adressemail)->first();

        if (!$user) {
            return response()->json(['error' => 'Utilisateur non trouvé'], 404);
        }

        // Générer un nouveau code
        $verification = EmailVerification::createVerificationCode($request->adressemail);

        try {
            Mail::to($request->adressemail)->send(
                new VerificationCodeMail($verification->code, $user->nom)
            );
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de l\'envoi de l\'email',
                'details' => $e->getMessage()
            ], 500);
        }

        return response()->json([
            'message' => 'Code de vérification renvoyé avec succès'
        ], 200);
    }

    // Login
    public function login(Request $request)
    {
        $user = User::where('adressemail', $request->adressemail)->first();
        if (!$user) {
            return response()->json(['error' => 'Utilisateur non trouvé'], 404)
                ->header('Access-Control-Allow-Origin', 'http://localhost:4200')
                ->header('Access-Control-Allow-Credentials', 'true');
        }

        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Mot de passe incorrect'], 401)
                ->header('Access-Control-Allow-Origin', 'http://localhost:4200')
                ->header('Access-Control-Allow-Credentials', 'true');
        }
        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json(['token' => $token, 'user' => $user])
            ->header('Access-Control-Allow-Origin', 'http://localhost:4200')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin')
            ->header('Access-Control-Allow-Credentials', 'true');
    }


    // Logout - Sanctum
    public function logout(Request $request)
    {
        try {
            // Supprimer le token actuel de l'utilisateur
            $request->user()->currentAccessToken()->delete();

            return response()->json(['message' => 'Déconnecté avec succès']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de la déconnexion'], 500);
        }
    }

    // Get authenticated user - Sanctum
    public function me(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json(['error' => 'Utilisateur non authentifié'], 401);
            }

            return response()->json($user);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Token invalide'], 401);
        }
    }

    // Get user info (protected route) - Sanctum
    public function getallinfo(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json(['error' => 'Utilisateur non authentifié'], 401);
            }

            return response()->json([
                'id' => $user->id,
                'nom' => $user->nom,
                'adressemail' => $user->adressemail,
                'numde_telephone' => $user->numde_telephone,
                'wilaya' => $user->wilaya,
                'role' => $user->role,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de la récupération des informations'], 500);
        }
    }
    // Update user info (protected route) - Sanctum
    public function updateUserInfo(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return response()->json(['error' => 'Utilisateur non authentifié'], 401);
            }

            // Validation des données
            $validator = Validator::make($request->all(), [
                'nom' => 'sometimes|string|max:255',
                'adressemail' => 'sometimes|email|unique:users,adressemail,' . $user->id,
                'numde_telephone' => 'sometimes|string|max:20',
                'wilaya' => 'sometimes|string|max:255',
                'current_password' => 'required_with:new_password|string',
                'new_password' => 'sometimes|string|min:8|confirmed'
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Si l'utilisateur veut changer le mot de passe
            if ($request->has('new_password')) {
                if (!Hash::check($request->current_password, $user->password)) {
                    return response()->json(['error' => 'Mot de passe actuel incorrect'], 422);
                }
                $user->password = Hash::make($request->new_password);
            }

            // Mise à jour des autres champs
            if ($request->has('nom')) {
                $user->nom = $request->nom;
            }
            if ($request->has('adressemail')) {
                $user->adressemail = $request->adressemail;
                // Si l'email change, marquer comme non vérifié
               
            }
            if ($request->has('numde_telephone')) {
                $user->numde_telephone = $request->numde_telephone;
            }
            if ($request->has('wilaya')) {
                $user->wilaya = $request->wilaya;
            }

            $user->save();

            return response()->json([
                'message' => 'Informations mises à jour avec succès',
                'user' => [
                    'id' => $user->id,
                    'nom' => $user->nom,
                    'adressemail' => $user->adressemail,
                    'numde_telephone' => $user->numde_telephone,
                    'wilaya' => $user->wilaya,
                    'role' => $user->role,
                    
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de la mise à jour: ' . $e->getMessage()], 500);
        }
    }

    // Delete user account (protected route) - Sanctum
    public function deleteAccount(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json(['error' => 'Utilisateur non authentifié'], 401);
            }

            // Validation du mot de passe pour confirmation
            $validator = Validator::make($request->all(), [
                'password' => 'required|string'
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Vérifier le mot de passe
            if (!Hash::check($request->password, $user->password)) {
                return response()->json(['error' => 'Mot de passe incorrect'], 422);
            }

            // Supprimer tous les tokens de l'utilisateur
            $user->tokens()->delete();

            // Supprimer l'utilisateur
            $user->delete();

            return response()->json(['message' => 'Compte supprimé avec succès']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de la suppression du compte'], 500);
        }
    }
}
