<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();

        $common = [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
        ];

        if ($user->role === 'admin') {
            $user->load('admin');
            if ($user->admin === null) {
                abort(404);
            }

            return Inertia::render('Profile/AdminEdit', array_merge($common, [
                'admin' => $user->admin,
            ]));
        }

        if ($user->role === 'pentadbir') {
            $user->load('pentadbirSekolah');
            if ($user->pentadbirSekolah === null) {
                abort(404);
            }

            return Inertia::render('Profile/PentadbirEdit', array_merge($common, [
                'pentadbirSekolah' => $user->pentadbirSekolah,
            ]));
        }
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();

        if ($request->isEmailOnlyUpdate()) {
            return $this->updateUserEmailOnly($request, $user);
        }

        return match ($user->role) {
            'admin' => $this->updateAdminProfile($request, $user),
            'pentadbir' => $this->updatePentadbirProfile($request, $user),
        };
    }

    private function updateUserEmailOnly(ProfileUpdateRequest $request, $user): RedirectResponse
    {
        $validated = $request->validated();

        $user->fill(['email' => $validated['email']]);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return Redirect::route('profile.edit')->with('status', 'email-updated');
    }

    private function updateAdminProfile(ProfileUpdateRequest $request, $user): RedirectResponse
    {
        $user->loadMissing('admin');
        if ($user->admin === null) {
            abort(404);
        }

        $validated = $request->validated();

        DB::transaction(function () use ($validated, $user) {
            $user->fill([
                'name' => $validated['name'],
            ]);

            $user->save();

            $user->admin->update([
                'fld_adm_namaSekolah' => $validated['fld_adm_namaSekolah'],
                'fld_adm_latitud' => $validated['fld_adm_latitud'],
                'fld_adm_longitud' => $validated['fld_adm_longitud'],
            ]);
        });

        return Redirect::route('profile.edit');
    }

    private function updatePentadbirProfile(ProfileUpdateRequest $request, $user): RedirectResponse
    {
        $user->loadMissing('pentadbirSekolah');
        if ($user->pentadbirSekolah === null) {
            abort(404);
        }

        $validated = $request->validated();

        $detailPentadbir = $user->pentadbirSekolah;
        $namaImej = null;

        if ($request->hasFile('fld_ps_urlGambarWajah')) {
            if ($detailPentadbir->fld_ps_urlGambarWajah) {
                $pathGambarLama = public_path('pentadbirImej/'.$detailPentadbir->fld_ps_urlGambarWajah);
                if (file_exists($pathGambarLama)) {
                    unlink($pathGambarLama);
                }
            }

            $imej = $request->file('fld_ps_urlGambarWajah');

            $namaImej = $detailPentadbir->fld_ps_id.'_'.time().'.'.$imej->getClientOriginalExtension();

            $imej->move(public_path('pentadbirImej'), $namaImej);
        }

        DB::transaction(function () use ($validated, $user, $namaImej, $detailPentadbir) {
            $user->fill([
                'name' => $validated['name'],
            ]);

            $user->save();

            $updateData = [
                'fld_ps_status' => $validated['fld_ps_status'],
                'fld_ps_noTelefon' => $validated['fld_ps_noTelefon'],
                'fld_ps_noIC' => $validated['fld_ps_noIC'],
                'fld_ps_jabatan' => $validated['fld_ps_jabatan'],
            ];

            if ($namaImej !== null) {
                $updateData['fld_ps_urlGambarWajah'] = $namaImej;
            }

            $detailPentadbir->update($updateData);
        });

        return Redirect::route('profile.edit');
    }
}
