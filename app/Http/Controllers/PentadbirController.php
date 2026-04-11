<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\PentadbirSekolah;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class PentadbirController extends Controller
{

    public function index()
    {
        $pentadbirs = User::with('pentadbirSekolah')
            ->where('role', 'pentadbir')
            ->latest()
            ->get();
            
        return Inertia::render('UrusPentadbir/index', [
            'pentadbirs' => $pentadbirs
        ]);
    }

    public function create()
    {
        $nextId = PentadbirSekolah::generatePsId();

        return Inertia::render('UrusPentadbir/create', [
            'nextId' => $nextId
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'fld_ps_noTelefon' => 'required|string',
            'fld_ps_noIC' => ['required', 'string', 'regex:/^\d{6}-\d{2}-\d{4}$/'],
            'fld_ps_id' => 'required|string|unique:pentadbir_sekolahs',
            'fld_ps_jabatan' => 'required|string',
            'fld_ps_status' => 'required|in:aktif,tidak_aktif',
            'fld_ps_urlGambarWajah' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $namaImej = null;
        if ($request->hasFile('fld_ps_urlGambarWajah')) {
            $imej = $request->file('fld_ps_urlGambarWajah');
            
            // Cipta nama fail yang unik (Contoh: PS-005_1710000000.jpg)
            $namaImej = $validated['fld_ps_id'] . '_' . time() . '.' . $imej->getClientOriginalExtension();

            $imej->move(public_path('pentadbirImej'), $namaImej);
        }

        DB::transaction(function () use ($validated, $namaImej) {
            // 1. Simpan ke jadual users
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 'pentadbir',
            ]);

            // 2. Simpan ke jadual pentadbir_sekolahs
            $user->pentadbirSekolah()->create([
                'fld_ps_id' => $validated['fld_ps_id'],
                'fld_ps_noTelefon' => $validated['fld_ps_noTelefon'],
                'fld_ps_noIC' => $validated['fld_ps_noIC'],
                'fld_ps_jabatan' => $validated['fld_ps_jabatan'],
                'fld_ps_status' => $validated['fld_ps_status'],
                'fld_ps_urlGambarWajah' => $namaImej,
            ]);
        });

        return redirect()->route('admin.pentadbir.index')->with('success', 'Pentadbir berjaya ditambah.');
    }

    /**
     * Paparkan borang edit pentadbir sedia ada (EDIT)
     */
    public function edit(User $pentadbir)
    {
        $pentadbir->load('pentadbirSekolah');

        return Inertia::render('UrusPentadbir/edit', [
            'pentadbir' => $pentadbir
        ]);
    }

    /**
     * Kemaskini data pentadbir dalam database (UPDATE)
     */
    public function update(Request $request, User $pentadbir)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $pentadbir->id,
            'fld_ps_noTelefon' => 'required|string',
            'fld_ps_noIC' => ['required', 'string', 'regex:/^\d{6}-\d{2}-\d{4}$/'],
            'fld_ps_jabatan' => 'required|string',
            'fld_ps_status' => 'required|in:aktif,tidak_aktif',
            'fld_ps_urlGambarWajah' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $detailPentadbir = $pentadbir->pentadbirSekolah;
        $namaImej = null;

        if ($request->hasFile('fld_ps_urlGambarWajah')) {

            if ($detailPentadbir->fld_ps_urlGambarWajah) {
                $pathGambarLama = public_path('pentadbirImej/' . $detailPentadbir->fld_ps_urlGambarWajah);
                if (file_exists($pathGambarLama)) {
                    unlink($pathGambarLama);
                }
            }

            $imej = $request->file('fld_ps_urlGambarWajah');

            $namaImej = $detailPentadbir->fld_ps_id . '_' . time() . '.' . $imej->getClientOriginalExtension();

            $imej->move(public_path('pentadbirImej'), $namaImej);
        }

        DB::transaction(function () use ($request, $validated, $pentadbir, $namaImej) {
            // 1. Update jadual users
            $pentadbir->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
            ]);

            // 2. Sediakan data untuk jadual pentadbir
            $updateData = [
                'fld_ps_status' => $validated['fld_ps_status'],
                'fld_ps_noTelefon' => $validated['fld_ps_noTelefon'],
                'fld_ps_noIC' => $validated['fld_ps_noIC'],
                'fld_ps_jabatan' => $validated['fld_ps_jabatan'],
            ];

            // 3. Jika ada nama imej baru, masukkan ke dalam array update
            if ($namaImej !== null) {
                $updateData['fld_ps_urlGambarWajah'] = $namaImej;
            }

            // 4. Update jadual pentadbir
            $pentadbir->pentadbirSekolah()->update($updateData);
        });

        return redirect()->route('admin.pentadbir.index')->with('success', 'Maklumat pentadbir berjaya dikemaskini.');
    }

    /**
     * Padam data pentadbir (DELETE / DESTROY)
     */
    public function destroy(User $pentadbir)
    {
        $pentadbir->delete();

        return redirect()->route('admin.pentadbir.index')->with('success', 'Pentadbir berjaya dipadam.');
    }
}
