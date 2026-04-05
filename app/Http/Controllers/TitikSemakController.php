<?php

namespace App\Http\Controllers;

use App\Models\LokasiTitikSemak;
use Illuminate\Http\Request;
use Illuminate\Support\Str; // Tambah ini untuk fungsi Str::random()
use Inertia\Inertia;
use SimpleSoftwareIO\QrCode\Facades\QrCode; // Pastikan anda dah install pakej ini

class TitikSemakController extends Controller
{
    /**
     * Paparkan senarai titik semak di halaman Index
     */
    public function index()
    {
        $titikSemaks = LokasiTitikSemak::latest()->get();
            
        // Gunakan huruf kecil untuk selaras dengan nama fail index.jsx
        return Inertia::render('UrusTitikSemak/index', [ 
            'titikSemaks' => $titikSemaks
        ]);
    }

    /**
     * Paparkan borang tambah titik semak (CREATE)
     */
    public function create()
    {
        $nextId = LokasiTitikSemak::generateLTSId();
        
        // Gunakan huruf kecil untuk selaras dengan nama fail create.jsx
        return Inertia::render('UrusTitikSemak/create', [
            'nextId' => $nextId
        ]);
    }

    /**
     * Simpan data titik semak ke dalam database (STORE)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'fld_loc_id' => 'required|string|unique:lokasi_titik_semaks,fld_loc_id|max:255',
            'fld_loc_nama' => 'required|string|max:255',
            'fld_loc_latitud' => 'required|numeric', 
            'fld_loc_longitud' => 'required|numeric', 
            'fld_loc_status' => 'required|in:aktif,tidak_aktif',
        ]);

        // Jana kod rahsia rawak (30 aksara) untuk imej QR
        $validated['fld_loc_kodQR'] = Str::random(30);

        // Tukar status string ('aktif' / 'tidak_aktif') kepada boolean (1 / 0) untuk database
        $validated['fld_loc_status'] = $validated['fld_loc_status'] === 'aktif' ? 1 : 0;

        // Simpan semua data ke database (termasuk status dan kod QR)
        LokasiTitikSemak::create($validated);

        return redirect()->route('pentadbir.titik-semak.index')
            ->with('success', 'Titik semak lokasi rondaan berjaya ditambah.');
    }

    /**
     * Padam data titik semak (DELETE)
     */
    public function destroy($id)
    {
        // Cari data berdasarkan fld_loc_id dan padam
        $titikSemak = LokasiTitikSemak::findOrFail($id);
        $titikSemak->delete();

        return redirect()->route('pentadbir.titik-semak.index')
            ->with('success', 'Titik semak berjaya dipadam.');
    }

    /**
     * Paparkan view Cetak QR Code
     */
    public function cetakQR($id)
    {
        $titikSemak = LokasiTitikSemak::findOrFail($id);
        
        // Data berbentuk JSON untuk dibaca oleh aplikasi mudah alih
        $qrData = json_encode([
            'id' => $titikSemak->fld_loc_id,
            'secret' => $titikSemak->fld_loc_kodQR
        ]);

        // Jana imej QR berbentuk SVG (untuk dirender dengan cantik ketika print)
        $qrSvg = (string) QrCode::format('svg')
                  ->size(300)
                  ->margin(0)
                  ->generate($qrData);
                  
        return Inertia::render('UrusTitikSemak/PrintQR', [
            'titikSemak' => $titikSemak,
            'qrSvg' => $qrSvg
        ]);
    }
}