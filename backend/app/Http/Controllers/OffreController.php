<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Offre;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class OffreController extends Controller
{
    // Créer une nouvelle offre
    public function store(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json(['error' => 'Utilisateur non authentifié'], 401);
            }

            // Validation
            $validator = Validator::make($request->all(), [
                'titre' => 'required|string|max:255',
                'description' => 'required|string',
                'prix' => 'required|numeric|min:0',
                'categorie' => 'required|string',
                'wilaya' => 'required|string',
                'commune' => 'nullable|string',
                'etat' => 'required|in:neuf,bon,moyen,usage',
                'numde_telephone' => 'required|string',
                'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Gérer les images
            $imagePaths = [];
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('offres', 'public');
                    $imagePaths[] = $path;
                }
            }

            // Créer l'offre
            $offre = Offre::create([
                'user_id' => $user->id,
                'titre' => $request->titre,
                'description' => $request->description,
                'prix' => $request->prix,
                'categorie' => $request->categorie,
                'wilaya' => $request->wilaya,
                'commune' => $request->commune,
                'etat' => $request->etat,
                'statut' => 'active',
                'images' => $imagePaths,
                'numde_telephone' => $request->numde_telephone,
                'vues' => 0
            ]);

            return response()->json([
                'message' => 'Offre créée avec succès',
                'offre' => $offre
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la création de l\'offre',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Récupérer toutes les offres actives
    public function index()
    {
        try {
            $offres = Offre::with('user:id,nom,adressemail')
                ->where('statut', 'active')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json($offres);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de la récupération des offres'], 500);
        }
    }

    // Récupérer une offre par ID
    public function show($id)
    {
        try {
            $offre = Offre::with('user:id,nom,adressemail,numde_telephone')->findOrFail($id);

            // Incrémenter les vues
            $offre->increment('vues');

            return response()->json($offre);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Offre non trouvée'], 404);
        }
    }

    // Récupérer les offres de l'utilisateur connecté
    public function myOffres(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json(['error' => 'Utilisateur non authentifié'], 401);
            }

            $offres = Offre::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json($offres);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de la récupération de vos offres'], 500);
        }
    }

    // Mettre à jour une offre
    public function update(Request $request, $id)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json(['error' => 'Utilisateur non authentifié'], 401);
            }

            $offre = Offre::findOrFail($id);

            // Vérifier que l'utilisateur est le propriétaire
            if ($offre->user_id !== $user->id) {
                return response()->json(['error' => 'Non autorisé'], 403);
            }

            // Validation
            $validator = Validator::make($request->all(), [
                'titre' => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
                'prix' => 'sometimes|numeric|min:0',
                'categorie' => 'sometimes|string',
                'wilaya' => 'sometimes|string',
                'commune' => 'nullable|string',
                'etat' => 'sometimes|in:neuf,bon,moyen,usage',
                'statut' => 'sometimes|in:active,vendue,expiree,suspendue',
                'numde_telephone' => 'sometimes|string'
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $offre->update($request->all());

            return response()->json([
                'message' => 'Offre mise à jour avec succès',
                'offre' => $offre
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de la mise à jour'], 500);
        }
    }

    // Supprimer une offre
    public function destroy(Request $request, $id)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json(['error' => 'Utilisateur non authentifié'], 401);
            }

            $offre = Offre::findOrFail($id);

            // Vérifier que l'utilisateur est le propriétaire
            if ($offre->user_id !== $user->id) {
                return response()->json(['error' => 'Non autorisé'], 403);
            }

            // Supprimer les images
            if ($offre->images) {
                foreach ($offre->images as $imagePath) {
                    Storage::disk('public')->delete($imagePath);
                }
            }

            $offre->delete();

            return response()->json(['message' => 'Offre supprimée avec succès']);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de la suppression'], 500);
        }
    }
    public function getalloffers() {
        try {
            $offres = Offre::with('user:id,nom,adressemail')
                ->where('statut', 'active')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json($offres);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de la récupération des offres'], 500);
        }
    }

    // Récupérer les statistiques globales
    public function getStats()
    {
        try {
            $totalOffres = Offre::where('statut', 'active')->count();
            $totalUsers = \App\Models\User::count();
            $totalVues = Offre::sum('vues');

            return response()->json([
                'totalOffres' => $totalOffres,
                'totalUsers' => $totalUsers,
                'totalVues' => $totalVues
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de la récupération des statistiques'], 500);
        }
    }

    // Récupérer les statistiques par catégorie
    public function getCategoryStats()
    {
        try {
            $categories = [
                ['name' => 'Véhicules', 'icon' => 'fas fa-car'],
                ['name' => 'Immobilier', 'icon' => 'fas fa-home'],
                ['name' => 'Électronique', 'icon' => 'fas fa-laptop'],
                ['name' => 'Emploi', 'icon' => 'fas fa-briefcase'],
                ['name' => 'Services', 'icon' => 'fas fa-tools'],
                ['name' => 'Meubles', 'icon' => 'fas fa-couch'],
                ['name' => 'Vêtements', 'icon' => 'fas fa-tshirt'],
                ['name' => 'Sports & Loisirs', 'icon' => 'fas fa-futbol'],
                ['name' => 'Autres', 'icon' => 'fas fa-ellipsis-h']
            ];

            $categoryStats = [];
            foreach ($categories as $category) {
                $count = Offre::where('statut', 'active')
                    ->where('categorie', $category['name'])
                    ->count();

                $categoryStats[] = [
                    'name' => $category['name'],
                    'icon' => $category['icon'],
                    'count' => $count
                ];
            }

            return response()->json($categoryStats);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de la récupération des statistiques par catégorie'], 500);
        }
    }
}
