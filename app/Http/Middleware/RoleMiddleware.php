<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (!$request->user() || !in_array($request->user()->role, $roles)) {
            if ($request->user()) {
                return match($request->user()->role) {
                    'admin' => redirect()->route('admin.dashboard'),
                    'siswa' => redirect()->route('student.dashboard'),
                    'pembimbing' => redirect()->route('admin.dashboard'),
                    default => redirect()->route('login'),
                };
            }
            return redirect()->route('login');
        }

        return $next($request);
    }
}
