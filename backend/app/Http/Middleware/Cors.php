<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Cors
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Définir les headers CORS
        $headers = [
            'Access-Control-Allow-Origin' => 'http://localhost:4200',
            'Access-Control-Allow-Methods' => 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
            'Access-Control-Allow-Headers' => 'Content-Type, Authorization, X-Requested-With, Accept, Origin, X-CSRF-TOKEN, X-Requested-With',
            'Access-Control-Allow-Credentials' => 'true',
        ];

        // Gérer les requêtes OPTIONS (preflight)
        if ($request->getMethod() === "OPTIONS") {
            return response('', 200, $headers);
        }

        // Continuer avec la requête
        $response = $next($request);

        // Ajouter les headers CORS à TOUTES les réponses (succès ET erreurs)
        foreach ($headers as $key => $value) {
            $response->headers->set($key, $value);
        }

        return $response;
    }
}
