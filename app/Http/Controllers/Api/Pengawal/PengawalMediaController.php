<?php

namespace App\Http\Controllers\Api\Pengawal;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PengawalMediaController extends Controller
{
    public function mePhoto(Request $request)
    {
        $user = $request->user();
        $pengawal = $user?->pengawal;
        $filename = $pengawal?->fld_pgw_urlGambarWajah;

        // If no filename exists in DB, redirect to UI-Avatars immediately
        if (! $filename) {
            $name = urlencode($user->name ?? 'User');
            return redirect()->away("https://ui-avatars.com/api/?name={$name}&background=1e293b&color=fff");
        }

        // Define the path inside the public folder
        $pathInPublic = 'pengawalImej/' . $filename;
        $fullPath = public_path($pathInPublic);

        // Check if file actually exists on the server
        if (file_exists($fullPath) && is_file($fullPath)) {
            return response()->file($fullPath);
        }

        // 4. Fallback if the database has a name but the file is missing from disk
        return response()->json(['message' => 'Fail gambar tidak wujud di server.'], 404);
    }
}

