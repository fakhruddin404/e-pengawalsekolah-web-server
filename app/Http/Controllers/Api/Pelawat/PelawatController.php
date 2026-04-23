<?php

namespace App\Http\Controllers\Api\Pelawat;

use App\Http\Controllers\Controller;
use App\Models\PasLawatan;
use App\Models\Pelawat;
use Illuminate\Http\Request;

class PelawatController extends Controller
{
    public function search(Request $request)
    {
        $q = trim((string) ($request->query('q') ?? $request->query('query') ?? $request->query('search') ?? ''));

        if ($q === '') {
            return response()->json([]);
        }

        $pelawats = Pelawat::query()
            ->where(function ($query) use ($q) {
                $query
                    ->where('fld_vis_namaPenuh', 'like', '%' . $q . '%')
                    ->orWhere('fld_vis_noTelefon', 'like', '%' . $q . '%')
                    ->orWhere('fld_vis_noIC', 'like', '%' . $q . '%');
            })
            ->orderBy('fld_vis_namaPenuh')
            ->limit(20)
            ->get([
                'fld_vis_id',
                'fld_vis_noIC',
                'fld_vis_namaPenuh',
                'fld_vis_noTelefon',
            ]);

        // Mobile normalizer accepts many shapes; we return a clean one.
        return response()->json(
            $pelawats->map(function (Pelawat $p) {
                return [
                    'id' => $p->fld_vis_id,
                    'namaPenuh' => $p->fld_vis_namaPenuh,
                    'noTel' => $p->fld_vis_noTelefon,
                    'ic' => $p->fld_vis_noIC,
                ];
            })
        );
    }

    public function aktif(Request $request)
    {
        $rows = PasLawatan::query()
            ->with(['pelawat:fld_vis_id,fld_vis_namaPenuh'])
            ->where('fld_pas_statusPas', 'aktif')
            ->orderByDesc('fld_pas_masaMasuk')
            ->limit(100)
            ->get([
                'fld_pas_idPas',
                'fld_vis_id',
                'fld_pas_tujuan',
                'fld_pas_noKenderaan',
                'fld_pas_masaMasuk',
                'created_at',
            ]);

        return response()->json(
            $rows->map(function (PasLawatan $pas) {
                return [
                    'id' => $pas->fld_pas_idPas,
                    'name' => $pas->pelawat?->fld_vis_namaPenuh ?? '',
                    'purpose' => $pas->fld_pas_tujuan,
                    'plate' => $pas->fld_pas_noKenderaan ?? '',
                    'masaMasuk' => optional($pas->fld_pas_masaMasuk)->toISOString(),
                    'createdAt' => optional($pas->created_at)->toISOString(),
                ];
            })
        );
    }
}

