<?php

namespace App\Http\Controllers;

use App\Models\Pelawat;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PelawatController extends Controller
{
    public function index()
    {
        $pelawats = Pelawat::query()
            ->latest()
            ->get([
                'fld_vis_id',
                'fld_vis_noIC',
                'fld_vis_namaPenuh',
                'fld_vis_noTelefon',
                'fld_vis_statusSenaraiHitam',
                'created_at',
                'updated_at',
            ]);
            
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

        $updateData = [
            'fld_vis_statusSenaraiHitam' => $validated['fld_vis_statusSenaraiHitam'],
        ];

        $pelawat->update($updateData);

        return redirect()->route('pentadbir.pelawat.index')->with('success', 'Status senarai hitam pelawat berjaya dikemaskini.');
    }

    public function destroy(Pelawat $pelawat)
    {
        $pelawat->delete();

        return redirect()
        ->route('pentadbir.pelawat.index')
        ->with('success', 'Pelawat berjaya dipadam.');
    }
}
