<?php

namespace App\Http\Controllers\Api\Auth;

use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;

class EmailVerificationController extends Controller
{
    public function verifyEmail(Request $request, string $id, string $hash)
    {
        // Find the user manually
        $user = User::findOrFail($id);

        // Double-check the hash matches their actual email
        if (! hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return response()->json(['message' => 'Pautan tidak sah atau telah luput.'], 403);
        }

        // If already verified, just redirect them to success
        if ($user->hasVerifiedEmail()) {
            // Option A: Show a web page
            // return view('auth.email-verified-success');

            // Option B: Deep link back to your React Native app (e.g., epsmobile://email-verified)
            return redirect('epsmobile://email-verified');
        }

        // Mark email as verified and trigger the Laravel event
        if ($user->markEmailAsVerified()) {
            // update user verified_at
            event(new Verified($user));
        }

        // Redirect back to mobile app or success page
        $userAgent = $request->header('User-Agent');

        // Semak jika User-Agent mengandungi kata kunci peranti mudah alih
        $isMobile = preg_match('/(android|iphone|ipad|mobile)/i', $userAgent);

        if ($isMobile) {
            // Jika di TELEFON: Tolak masuk ke Apps semula
            return redirect('epsmobile://email-verified');
        }

        // Jika di LAPTOP/WEB: Tunjukkan paparan mesej berjaya yang cantik
        return response()->sendContent("
                <div style='text-align: center; padding-top: 50px; font-family: sans-serif;'>
                    <h1 style='color: #2d3748;'>Email Berjaya Disahkan! ✅</h1>
                    <p style='color: #4a5568;'>Akaun anda kini aktif. Sila buka aplikasi di telefon anda untuk log masuk semula.</p>
                    <div style='margin-top: 20px; color: #718096; font-size: 0.9em;'>
                        Anda boleh menutup tab browser ini sekarang.
                    </div>
                </div>
            ");
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
}

