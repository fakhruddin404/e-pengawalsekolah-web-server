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
            
        // Gunakan huruf besar untuk nama fail jika di React failnya adalah Index.jsx
        return Inertia::render('UrusTitikSemak/Index', [ 
            'titikSemaks' => $titikSemaks
        ]);
    }

    /**
     * Paparkan borang tambah titik semak (CREATE)
     */
    public function create()
    {
        $nextId = LokasiTitikSemak::generateLTSId();
        
        // Gunakan huruf besar untuk nama fail jika di React failnya adalah Create.jsx
        return Inertia::render('UrusTitikSemak/Create', [
            'nextId' => $nextId
        ]);
    }

    /**
     * Simpan data titik semak ke dalam database (STORE)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            // Guna nama table yang betul: lokasi_titik_semaks
            'fld_loc_id' => 'required|string|unique:lokasi_titik_semaks,fld_loc_id|max:255',
            'fld_loc_nama' => 'required|string|max:255',
            'fld_loc_latitud' => 'required|numeric',  // Ejaan dibetulkan
            'fld_loc_longitud' => 'required|numeric', // Ejaan dibetulkan
            'fld_loc_status' => 'required|in:aktif,tidak_aktif',
        ]);

        // Jana kod rahsia rawak (30 aksara) untuk imej QR
        $validated['fld_loc_kodQR'] = Str::random(30);

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
     * Fungsi khas untuk memuat turun Kod QR
     */
    public function muatTurunQR($id)
    {
        $titikSemak = LokasiTitikSemak::findOrFail($id);
        
        // Jana imej QR menggunakan kod rahsia dari database
        $qrImage = QrCode::format('png')
                  ->size(300)
                  ->margin(1)
                  ->generate($titikSemak->fld_loc_kodQR);
                  
        $fileName = 'QR_' . $titikSemak->fld_loc_id . '.png';
        
        return response($qrImage)
            ->header('Content-type', 'image/png')
            ->header('Content-Disposition', 'attachment; filename="' . $fileName . '"');
    }
}