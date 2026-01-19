
<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OffreController;

Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);

// Routes de vérification d'email
Route::post('verify-email', [AuthController::class, 'verifyEmail']);
Route::post('resend-verification-code', [AuthController::class, 'resendVerificationCode']);

// Routes publiques pour les offres
Route::get('offres', [OffreController::class, 'index']);
Route::get('offres/{id}', [OffreController::class, 'show']);
Route::get('stats', [OffreController::class, 'getStats']);
Route::get('category-stats', [OffreController::class, 'getCategoryStats']);

// Routes protégées par Sanctum
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::get('getallinfo', [AuthController::class, 'getallinfo']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('me', [AuthController::class, 'me']);
    Route::put('update-user-info', [AuthController::class, 'updateUserInfo']);
    Route::delete('delete-account', [AuthController::class, 'deleteAccount']);

    // Offres routes
    Route::post('offres', [OffreController::class, 'store']);
    Route::get('my-offres', [OffreController::class, 'myOffres']);
    Route::put('offres/{id}', [OffreController::class, 'update']);
    Route::delete('offres/{id}', [OffreController::class, 'destroy']);
    Route::get('getalloffers', [OffreController::class, 'getalloffers']);
});