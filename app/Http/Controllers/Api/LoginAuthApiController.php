<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Pengawal;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule;

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
                'location' => ['Tiada lokasi admin untuk semakan.'],
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
                'location' => ["Lokasi tidak sah. Jarak terdekat: {$distanceMeters}m (maks: {$allowedMeters}m)."],
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



    public function updateProfile(Request $request)
    {
        $user = $request->user();

        // 1. Validasi data yang dihantar dari React Native
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone' => 'nullable|string|max:20',
            'ic' => ['required', 'string', 'regex:/^\d{6}-\d{2}-\d{4}$/'],
        ]);

        // 2. Check jika email diubah
        $emailChanged = $user->email !== $request->email;

        // 3. Kemaskini jadual Users
        $user->name = $request->name;
        $user->email = $request->email;

        if ($emailChanged) {
            $user->email_verified_at = null; // Un-verify email
        }
        
        $user->save();

        // 4. Kemaskini jadual Pengawal (jika ada relation)
        if ($user->pengawal) {
            $user->pengawal->update([
                'fld_pgw_noTelefon' => $request->phone,
                'fld_pgw_noIC' => $request->ic,
            ]);
        }

        // 5. Hantar link secara automatik jika email bertukar
        if ($emailChanged) {
            // Ini akan panggil event standard Laravel untuk hantar email
            $user->sendEmailVerificationNotification(); 
        }

        // 6. Pulangkan response
        return response()->json([
            'message' => 'Profil berjaya dikemaskini.',
            'email_changed' => $emailChanged,
            'user' => $user,
        ], 200);
    }



    public function mePhoto(Request $request)
    {
        $user = $request->user();
        $pengawal = $user?->pengawal;
        $filename = $pengawal?->fld_pgw_urlGambarWajah;

        // 1. If no filename exists in DB, redirect to UI-Avatars immediately
        if (!$filename) {
            $name = urlencode($user->name ?? 'User');
            return redirect()->away("https://ui-avatars.com/api/?name={$name}&background=1e293b&color=fff");
        }

        // 2. Define the path inside the public folder
        // Since you said images are in public/pengawalImej/
        $pathInPublic = 'pengawalImej/' . $filename;
        $fullPath = public_path($pathInPublic);

        // 3. Check if file actually exists on the server
        if (file_exists($fullPath) && is_file($fullPath)) {
            return response()->file($fullPath);
        }

        // 4. Fallback if the database has a name but the file is missing from disk
        return response()->json(['message' => 'Fail gambar tidak wujud di server.'], 404);
    }



    public function verifyEmail(Request $request, $id, $hash)
    {
        // 1. Find the user manually (since they aren't logged in via session)
        $user = User::findOrFail($id);

        // 2. Double-check the hash matches their actual email
        if (! hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return response()->json(['message' => 'Pautan tidak sah atau telah luput.'], 403);
        }

        // 3. If already verified, just redirect them to success
        if ($user->hasVerifiedEmail()) {
            // Option A: Show a web page
            // return view('auth.email-verified-success'); 
            
            // Option B: Deep link back to your React Native app (e.g., myapp://email-verified)
            return redirect('myapp://email-verified'); 
        }

        // 4. Mark email as verified and trigger the Laravel event
        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        // 5. Redirect back to mobile app or success page
        return redirect('myapp://email-verified'); 
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

