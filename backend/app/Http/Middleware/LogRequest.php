<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LogRequest
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        \Log::info('=== REQUEST MIDDLEWARE ===');
        \Log::info('URL: ' . $request->fullUrl());
        \Log::info('Method: ' . $request->method());
        \Log::info('All Headers: ', $request->headers->all());
        \Log::info('Authorization Header: ' . $request->header('Authorization'));
        \Log::info('Bearer Token: ' . $request->bearerToken());

        $response = $next($request);

        \Log::info('Response Status: ' . $response->status());

        return $response;
    }
}
