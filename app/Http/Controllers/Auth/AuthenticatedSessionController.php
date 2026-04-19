<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = $request->user();

        if ($user->role === 'admin') {
            return redirect()->route('admin.pentadbir.index');
        }

        if ($user->role === 'pentadbir') {
            if ($user->pentadbirSekolah) {
                $user->pentadbirSekolah()->update([
                    'fld_ps_status' => 'aktif',
                ]);
            }

            return redirect()->route('pentadbir.dashboard');
        }

        return redirect('/');
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $user = auth()->user();

        if ($user) {
            if ($user->role === 'pentadbir' && $user->pentadbirSekolah) {
                $user->pentadbirSekolah()->update([
                    'fld_ps_status' => 'tidak_aktif',
                ]);
            }

        }

        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
