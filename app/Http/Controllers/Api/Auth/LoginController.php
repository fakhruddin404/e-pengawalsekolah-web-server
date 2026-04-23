<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
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

        // get user by email
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

        // get pengawal record
        $pengawal = $user->pengawal;
        if (! $pengawal) {
            throw ValidationException::withMessages([
                'login' => ['Rekod pengawal tidak dijumpai.'],
            ]);
        }

        $allowedMeters = (int) env('PENGAWAL_LOGIN_MAX_DISTANCE_METERS', 200);

        // get lat/long of admins
        $admins = Admin::query()->get([
            'fld_adm_id',
            'fld_adm_namaSekolah',
            'fld_adm_latitud',
            'fld_adm_longitud',
        ]);
        if ($admins->isEmpty()) {
            throw ValidationException::withMessages([
                'location' => ['Tiada lokasi sekolah untuk semakan.'],
            ]);
        }
        // sorting lat/long data and kira the distance between pengawal and admin
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

        // check if the distance is within the allowed meters
        if ($distanceMeters === null || $distanceMeters > $allowedMeters || $matchedAdmin === null) {
            $distanceMeters ??= 0;
            throw ValidationException::withMessages([
                'location' => ["Lokasi tidak sah. Anda berada {$distanceMeters}m dari lokasi sekolah(Jarak yang dibenarkan adalah {$allowedMeters}m)."],
            ]);
        }
        // delete existing token
        $user->tokens()->where('name', 'mobile-pengawal')->delete();
        // create new token
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
                'email_verified_at' => $user->email_verified_at,
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
                'fld_adm_latitud' => $matchedAdmin->fld_adm_latitud,
                'fld_adm_longitud' => $matchedAdmin->fld_adm_longitud,
            ],
            'distance_meters' => $distanceMeters,
            'allowed_meters' => $allowedMeters,
        ]);
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

