<?php

namespace App\Http\Controllers\Api\Profile;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\File;

class ProfileController extends Controller
{
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        // 1. Validasi data yang dihantar dari React Native
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone' => 'nullable|string|max:20',
            'ic' => ['required', 'string', 'regex:/^\d{6}-\d{2}-\d{4}$/'],
            'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        // user data
        $emailChanged = $user->email !== $request->email;
        $user->name = $request->name;
        $user->email = $request->email;

        if ($emailChanged) {
            $user->email_verified_at = null; // Un-verify email
        }
        $user->save();

        // pengawal data
        if ($request->hasFile('photo')) {
            $file = $request->file('photo');
            
            // Generate a unique filename: e.g., 123_1672531200.jpg
            $filename = $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            
            // Path: public/pengawalImej
            $destinationPath = public_path('pengawalImej');
    
            // Create folder if not exists
            if (!File::isDirectory($destinationPath)) {
                File::makeDirectory($destinationPath, 0777, true, true);
            }
    
            // Delete OLD photo from disk if it exists
            if ($user->pengawal && $user->pengawal->fld_pgw_urlGambarWajah) {
                $oldFilePath = $destinationPath . '/' . $user->pengawal->fld_pgw_urlGambarWajah;
                if (File::exists($oldFilePath)) {
                    File::delete($oldFilePath);
                }
            }
    
            // Move the NEW photo to the folder
            $file->move($destinationPath, $filename);
    
            // Update the filename in the database
            if ($user->pengawal) {
                $user->pengawal->fld_pgw_urlGambarWajah = $filename;
            }
        }

        if ($user->pengawal) {
            $user->pengawal->update([
                'fld_pgw_noTelefon' => $request->phone,
                'fld_pgw_noIC' => $request->ic,
            ]);
        }

        // Hantar link secara automatik jika email bertukar
        if ($emailChanged) {
            // laravel event
            $user->sendEmailVerificationNotification();
        }

        // response
        return response()->json([
            'message' => 'Profil berjaya dikemaskini.',
            'email_changed' => $emailChanged,
            'user' => $user ->load($user->pengawal),
        ], 200);
    }
}

