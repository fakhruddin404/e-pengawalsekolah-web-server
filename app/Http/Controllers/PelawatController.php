<?php

namespace App\Http\Controllers;

use App\Models\Pelawat;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PelawatController extends Controller
{
    public function index()
    {
        $pelawats = Pelawat::latest()->get();
            
        return Inertia::render('UrusPelawat/index', [
            'pelawats' => $pelawats
        ]);
    }

    public function edit(Pelawat $pelawat)
    {
        return Inertia::render('UrusPelawat/edit', [
            'pelawat' => $pelawat
        ]);
    }

    public function update(Request $request, Pelawat $pelawat)
    {
        $validated = $request->validate([
            'fld_vis_statusSenaraiHitam' => 'required|boolean',
        ]);

        $namaImej = null;

        if ($request->hasFile('fld_vis_urlGambarWajah')) {
            if ($pelawat->fld_vis_urlGambarWajah) {
                $pathGambarLama = public_path('pelawatImej/' . $pelawat->fld_vis_urlGambarWajah);
                if (file_exists($pathGambarLama)) {
                    unlink($pathGambarLama);
                }
            }

            $imej = $request->file('fld_vis_urlGambarWajah');
            $namaImej = $pelawat->fld_vis_id . '_' . time() . '.' . $imej->getClientOriginalExtension();
            $imej->move(public_path('pelawatImej'), $namaImej);
        }

        $updateData = [
            'fld_vis_statusSenaraiHitam' => $validated['fld_vis_statusSenaraiHitam'],
        ];

        $pelawat->update($updateData);

        return redirect()->route('pentadbir.pelawat.index')->with('success', 'Status senarai hitam pelawat berjaya dikemaskini.');
    }

    public function destroy(Pelawat $pelawat)
    {
        if ($pelawat->fld_vis_urlGambarWajah) {
            $pathGambar = public_path('pelawatImej/' . $pelawat->fld_vis_urlGambarWajah);
            if (file_exists($pathGambar)) {
                unlink($pathGambar);
            }
        }
        $pelawat->delete();

        return redirect()->route('pentadbir.pelawat.index')->with('success', 'Pelawat berjaya dipadam.');
    }
}
