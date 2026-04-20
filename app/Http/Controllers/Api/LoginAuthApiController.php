<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginAuthApiController extends Controller
{
    public function login(Request $request)
    {
        // Aliases so clients may send email/latitude/longitude instead of login/lat/long
        $request->merge([
            'login' => $request->input('login') ?: $request->input('email'),
            'lat' => $request->input('lat', $request->input('latitude')),
            'long' => $request->input('long', $request->input('longitude')),
        ]);

        $validated = $request->validate([
            // Accept either a real email OR a pengawal ID (e.g. PGW-001)
            'login' => ['required', 'string'],
            'password' => ['required', 'string', 'min:6'],
            'lat' => ['required', 'numeric', 'between:-90,90'],
            'long' => ['required', 'numeric', 'between:-180,180'],
        ]);

        $login = (string) $validated['login'];

        /** @var User|null $user */
        $user = User::query()
            ->where('email', $login)
            ->first();

        if (! $user) {
            $user = User::query()
                ->whereHas('pengawal', function ($q) use ($login) {
                    $q->where('fld_pgw_id', $login);
                })
                ->first();
        }

        if (! $user || ! Hash::check($validated['password'], (string) $user->password)) {
            throw ValidationException::withMessages([
                'login' => ['ID/Email atau kata laluan tidak sah.'],
            ]);
        }

        if (! $user->isPengawal()) {
            throw ValidationException::withMessages([
                'login' => ['Akaun ini bukan pengawal.'],
            ]);
        }

        $pengawal = $user->pengawal;
        if (! $pengawal) {
            throw ValidationException::withMessages([
                'login' => ['Rekod pengawal tidak dijumpai.'],
            ]);
        }

        $allowedMeters = (int) env('PENGAWAL_LOGIN_MAX_DISTANCE_METERS', 200);

        $admins = Admin::query()->get(['fld_adm_id', 'fld_adm_namaSekolah', 'fld_adm_latitud', 'fld_adm_longitud']);
        if ($admins->isEmpty()) {
            throw ValidationException::withMessages([
                'location' => ['Tiada lokasi admin untuk semakan.'],
            ]);
        }

        $distanceMeters = null;
        $matchedAdmin = null;
        foreach ($admins as $candidate) {
            $d = $this->haversineMeters(
                (float) $validated['lat'],
                (float) $validated['long'],
                (float) $candidate->fld_adm_latitud,
                (float) $candidate->fld_adm_longitud,
            );

            if ($distanceMeters === null || $d < $distanceMeters) {
                $distanceMeters = $d;
                $matchedAdmin = $candidate;
            }
        }

        if ($distanceMeters === null || $distanceMeters > $allowedMeters || $matchedAdmin === null) {
            $distanceMeters ??= 0;
            throw ValidationException::withMessages([
                'location' => ["Lokasi tidak sah. Jarak terdekat: {$distanceMeters}m (maks: {$allowedMeters}m)."],
            ]);
        }
        // kene baiki maybe
        $user->tokens()->where('name', 'mobile-pengawal')->delete();
        $token = $user->createToken('mobile-pengawal')->plainTextToken;

        $hasPhoto = (string) ($pengawal->fld_pgw_urlGambarWajah ?? '') !== '';

        return response()->json([
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
            'pengawal' => [
                'fld_pgw_id' => $pengawal->fld_pgw_id,
                'nama' => $pengawal->displayName() ?: $user->name,
                'photo_url' => $hasPhoto ? url('/api/pengawal/me/photo') : null,
                'fld_pgw_noTelefon' => $pengawal->fld_pgw_noTelefon,
                'fld_pgw_noIC' => $pengawal->fld_pgw_noIC,
                'fld_pgw_status' => $pengawal->fld_pgw_status,
                'fld_pgw_statusSemasa' => $pengawal->fld_pgw_statusSemasa,
            ],
            'admin_location' => [
                'fld_adm_id' => $matchedAdmin->fld_adm_id,
                'fld_adm_namaSekolah' => $matchedAdmin->fld_adm_namaSekolah,
                'fld_adm_latitud' => $matchedAdmin->fld_adm_latitud,
                'fld_adm_longitud' => $matchedAdmin->fld_adm_longitud,
            ],
            'distance_meters' => $distanceMeters,
            'allowed_meters' => $allowedMeters,
        ]);
    }

    public function mePhoto(Request $request)
    {
        $user = $request->user();
        $pengawal = $user?->pengawal;
        $pathOrUrl = (string) ($pengawal?->fld_pgw_urlGambarWajah ?? '');

        if ($pathOrUrl === '') {
            return response()->json(['message' => 'Tiada gambar pengawal.'], 404);
        }

        // If already an absolute URL, redirect to it.
        if (Str::startsWith($pathOrUrl, ['http://', 'https://'])) {
            return redirect()->away($pathOrUrl);
        }

        // If it's a public path like /storage/..., try serving from public/
        $publicRelative = ltrim($pathOrUrl, '/');
        $publicFull = public_path($publicRelative);
        if (is_file($publicFull)) {
            return response()->file($publicFull);
        }

        // Otherwise try Laravel's public disk (storage/app/public/*)
        $diskPath = preg_replace('#^storage/#', '', $publicRelative) ?? $publicRelative;
        if (Storage::disk('public')->exists($diskPath)) {
            $tmpFull = Storage::disk('public')->path($diskPath);
            if (is_file($tmpFull)) {
                return response()->file($tmpFull);
            }
        }

        return response()->json(['message' => 'Gambar tidak dijumpai.'], 404);
    }

    public function sendEmailVerification(Request $request)
    {
        $user = $request->user();
        if (! $user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        if (method_exists($user, 'hasVerifiedEmail') && $user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email sudah disahkan.'], 200);
        }

        if (method_exists($user, 'sendEmailVerificationNotification')) {
            $user->sendEmailVerificationNotification();
        }

        return response()->json(['message' => 'Pautan pengesahan telah dihantar.'], 200);
    }

    private function haversineMeters(float $lat1, float $lon1, float $lat2, float $lon2): int
    {
        $earthRadius = 6371000.0;

        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) ** 2
            + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dLon / 2) ** 2;

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return (int) round($earthRadius * $c);
    }
}

