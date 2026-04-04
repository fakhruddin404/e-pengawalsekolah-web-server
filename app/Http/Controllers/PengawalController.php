<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Pengawal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class PengawalController extends Controller
{

    public function index()
    {
        $pengawals = User::with('pengawal')
            ->where('role', 'pengawal')
            ->latest()
            ->get();
            
        return Inertia::render('UrusPengawal/index', [
            'pengawals' => $pengawals
        ]);
    }

    public function create()
    {
        $nextId = Pengawal::generatePgwId();

        return Inertia::render('UrusPengawal/create', [
            'nextId' => $nextId
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'fld_pgw_noTelefon' => 'required|string',
            'fld_pgw_noIC' => ['required', 'string', 'regex:/^\d{6}-\d{2}-\d{4}$/'],
            'fld_pgw_id' => 'required|string|unique:pengawals',
            'fld_pgw_status' => 'required|in:aktif,tidak_aktif',
            'fld_pgw_urlGambarWajah' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $namaImej = null;
        if ($request->hasFile('fld_pgw_urlGambarWajah')) {
            $imej = $request->file('fld_pgw_urlGambarWajah');
            
            // Cipta nama fail yang unik (Contoh: PGW-005_1710000000.jpg)
            $namaImej = $validated['fld_pgw_id'] . '_' . time() . '.' . $imej->getClientOriginalExtension();

            $imej->move(public_path('pengawalImej'), $namaImej);
        }

        DB::transaction(function () use ($validated, $namaImej) {
            // 1. Simpan ke jadual users
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 'pengawal',
            ]);

            // 2. Simpan ke jadual pengawals
            $user->pengawal()->create([
                'fld_pgw_id' => $validated['fld_pgw_id'],
                'fld_pgw_noTelefon' => $validated['fld_pgw_noTelefon'],
                'fld_pgw_noIC' => $validated['fld_pgw_noIC'],
                'fld_pgw_status' => $validated['fld_pgw_status'],
                'fld_pgw_statusSemasa' => 'tidak_bertugas', // Default
                'fld_pgw_urlGambarWajah' => $namaImej,
            ]);
        });

        return redirect()->route('pentadbir.pengawal.index')->with('success', 'Pengawal berjaya ditambah.');
    }

    /**
     * Paparkan borang edit pengawal sedia ada (EDIT)
     */
    public function edit(User $pengawal)
    {
        $pengawal->load('pengawal');

        return Inertia::render('UrusPengawal/edit', [
            'pengawal' => $pengawal
        ]);
    }

    /**
     * Kemaskini data pengawal dalam database (UPDATE)
     */
    public function update(Request $request, User $pengawal)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $pengawal->id,
            'fld_pgw_noTelefon' => 'required|string',
            'fld_pgw_noIC' => ['required', 'string', 'regex:/^\d{6}-\d{2}-\d{4}$/'],
            'fld_pgw_status' => 'required|in:aktif,tidak_aktif',
            'fld_pgw_urlGambarWajah' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $detailPengawal = $pengawal->pengawal;
        $namaImej = null;

        if ($request->hasFile('fld_pgw_urlGambarWajah')) {

            if ($detailPengawal->fld_pgw_urlGambarWajah) {
                $pathGambarLama = public_path('pengawalImej/' . $detailPengawal->fld_pgw_urlGambarWajah);
                if (file_exists($pathGambarLama)) {
                    unlink($pathGambarLama);
                }
            }

            $imej = $request->file('fld_pgw_urlGambarWajah');

            $namaImej = $detailPengawal->fld_pgw_id . '_' . time() . '.' . $imej->getClientOriginalExtension();

            $imej->move(public_path('pengawalImej'), $namaImej);
        }

        DB::transaction(function () use ($request, $validated, $pengawal, $namaImej) {
            $detailPengawal = $pengawal->pengawal;

            // 1. Update jadual users
            $pengawal->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
            ]);

            // 2. Sediakan data untuk jadual pengawal
            $updateData = [
                'fld_pgw_status' => $validated['fld_pgw_status'],
                'fld_pgw_noTelefon' => $validated['fld_pgw_noTelefon'],
                'fld_pgw_noIC' => $validated['fld_pgw_noIC'],
            ];

            // 3. Jika ada nama imej baru, masukkan ke dalam array update
            if ($namaImej !== null) {
                $updateData['fld_pgw_urlGambarWajah'] = $namaImej;
            }

            // 4. Update jadual pengawal
            $pengawal->pengawal()->update($updateData);
        });

        return redirect()->route('pentadbir.pengawal.index')->with('success', 'Maklumat pengawal berjaya dikemaskini.');
    }

    /**
     * Padam data pengawal (DELETE / DESTROY)
     */
    public function destroy(User $pengawal)
    {

        $pengawal->delete();

        return redirect()->route('pentadbir.pengawal.index')->with('success', 'Pengawal berjaya dipadam.');
    }
}