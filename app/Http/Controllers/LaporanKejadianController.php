<?php

namespace App\Http\Controllers;

use App\Models\LaporanKejadian;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LaporanKejadianController extends Controller
{
    public function index()
    {
        $laporanKejadians = LaporanKejadian::with(['pengawal.user'])
            ->latest('fld_rpt_tarikhMasa')
            ->get();

        return Inertia::render('UrusLaporanKejadian/index', [
            'laporanKejadians' => $laporanKejadians,
        ]);
    }

/*    public function show(LaporanKejadian $laporanKejadian)
    {
        $laporanKejadian->load(['pengawal.user']);

        return Inertia::render('UrusLaporanKejadian/show', [
            'laporanKejadian' => $laporanKejadian,
        ]);
    }*/

    public function edit(LaporanKejadian $laporanKejadian)
    {
        $laporanKejadian->load(['pengawal.user']);

        return Inertia::render('UrusLaporanKejadian/edit', [
            'laporanKejadian' => $laporanKejadian,
        ]);
    }

    public function update(Request $request, LaporanKejadian $laporanKejadian)
    {
        $validated = $request->validate([
            'fld_rpt_kategori' => 'required|string|max:255',
            'fld_rpt_keterangan' => 'required|string',
            'fld_rpt_tarikhMasa' => 'required|date',
            'fld_rpt_status' => 'required|in:baru,dalam_siasatan,selesai',
        ]);

        $laporanKejadian->update($validated);

        return redirect()
            ->route('pentadbir.laporan-kejadian.show', $laporanKejadian)
            ->with('success', 'Laporan kejadian berjaya dikemaskini.');
    }

    public function destroy(LaporanKejadian $laporanKejadian)
    {
        if ($laporanKejadian->fld_rpt_urlGambar) {
            $pathGambar = public_path('laporanImej/' . $laporanKejadian->fld_rpt_urlGambar);
            if (file_exists($pathGambar)) {
                unlink($pathGambar);
            }
        }

        $laporanKejadian->delete();

        return redirect()
            ->route('pentadbir.laporan-kejadian.index')
            ->with('success', 'Laporan kejadian berjaya dipadam.');
    }
}

