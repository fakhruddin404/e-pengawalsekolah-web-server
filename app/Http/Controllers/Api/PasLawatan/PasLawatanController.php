<?php

namespace App\Http\Controllers\Api\PasLawatan;

use App\Http\Controllers\Controller;
use App\Models\PasLawatan;
use App\Models\Pelawat;
use Carbon\Carbon;
use Illuminate\Http\Request;

class PasLawatanController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            // Optional existing Pelawat id (VIS-xxx). If supplied, must exist.
            'id' => ['nullable', 'string', 'exists:pelawats,fld_vis_id'],

            // Pelawat info (will be created/updated).
            'namaPenuh' => ['required', 'string', 'max:255'],
            'noTel' => ['required', 'string', 'max:15'],
            'ic' => ['required', 'string', 'max:20', 'regex:/^\d{6}-\d{2}-\d{4}$/'],

            // Pas info
            'noKenderaan' => ['nullable', 'string', 'max:50'],
            'tujuan' => ['required', 'string', 'max:255'],

            // Mobile sends time only (HH:mm) or (HH:mm:ss)
            'masaMasuk' => ['required', 'string', 'regex:/^\d{2}:\d{2}(:\d{2})?$/'],
        ], [
            'id.exists' => 'ID pelawat tidak dijumpai.',
            'ic.regex' => 'No IC mestilah format 112345-12-1234.',
            'masaMasuk.regex' => 'Format masaMasuk mestilah HH:mm atau HH:mm:ss.',
        ]);

        $user = $request->user();
        $pengawalId = $user?->pengawal?->fld_pgw_id;
        if (! $pengawalId) {
            return response()->json([
                'success' => false,
                'status' => 'error',
                'message' => 'Pengawal tidak dijumpai untuk akaun ini.',
            ], 400);
        }

        $pelawat = null;

        if (! empty($validated['id'])) {
            $pelawat = Pelawat::query()->where('fld_vis_id', (string) $validated['id'])->first();
        }

        if (! $pelawat) {
            // Match existing visitor by IC first (unique in DB)
            $pelawat = Pelawat::query()->where('fld_vis_noIC', (string) $validated['ic'])->first();
        }

        //create pelawat if not found
        if (! $pelawat) {
            $pelawat = Pelawat::create([
                'fld_vis_id' => Pelawat::generateVisId(),
                'fld_vis_noIC' => (string) $validated['ic'],
                'fld_vis_namaPenuh' => (string) $validated['namaPenuh'],
                'fld_vis_noTelefon' => (string) $validated['noTel'],
                'fld_vis_statusSenaraiHitam' => false,
            ]);
        } else {
            // Keep info up to date (don’t touch blacklist flag here)
            $pelawat->update([
                'fld_vis_namaPenuh' => (string) $validated['namaPenuh'],
                'fld_vis_noTelefon' => (string) $validated['noTel'],
            ]);
        }

        if ((bool) $pelawat->fld_vis_statusSenaraiHitam) {
            return response()->json([
                'success' => false,
                'status' => 'error',
                'message' => 'Pelawat berada dalam senarai hitam.',
            ], 403);
        }

        $masaMasukString = (string) $validated['masaMasuk'];
        $masaMasuk = str_contains($masaMasukString, ':') && substr_count($masaMasukString, ':') === 2
            ? Carbon::today()->setTimeFromTimeString($masaMasukString) // HH:mm:ss
            : Carbon::today()->setTimeFromTimeString($masaMasukString . ':00'); // HH:mm

        $noKenderaan = isset($validated['noKenderaan']) ? trim((string) $validated['noKenderaan']) : '';
        $noKenderaan = $noKenderaan !== '' ? $noKenderaan : null;

        $pas = PasLawatan::create([
            'fld_pas_idPas' => PasLawatan::generatePasId(),
            'fld_pgw_idPengawal' => (string) $pengawalId,
            'fld_vis_id' => (string) $pelawat->fld_vis_id,
            'fld_pas_tujuan' => (string) $validated['tujuan'],
            'fld_pas_noKenderaan' => $noKenderaan,
            'fld_pas_masaMasuk' => $masaMasuk,
            'fld_pas_masaKeluar' => null,
            'fld_pas_statusPas' => 'aktif',
        ]);

        return response()->json([
            'success' => true,
            'status' => 'success',
            'message' => 'Pas lawatan berjaya dicipta.',
            'data' => [
                'pas' => [
                    'id' => $pas->fld_pas_idPas,
                    'fld_pas_idPas' => $pas->fld_pas_idPas,
                    'fld_vis_id' => $pelawat->fld_vis_id,
                    'fld_pas_tujuan' => $pas->fld_pas_tujuan,
                    'fld_pas_noKenderaan' => $pas->fld_pas_noKenderaan,
                    'fld_pas_masaMasuk' => optional($pas->fld_pas_masaMasuk)->toISOString(),
                    'fld_pas_statusPas' => $pas->fld_pas_statusPas,
                ],
                'pelawat' => [
                    'id' => $pelawat->fld_vis_id,
                    'fld_vis_id' => $pelawat->fld_vis_id,
                    'fld_vis_noIC' => $pelawat->fld_vis_noIC,
                    'fld_vis_namaPenuh' => $pelawat->fld_vis_namaPenuh,
                    'fld_vis_noTelefon' => $pelawat->fld_vis_noTelefon,
                ],
            ],
        ], 201);
    }

    public function keluar(Request $request, string $id)
    {
        $pasId = trim((string) $id);
        if ($pasId === '') {
            return response()->json([
                'success' => false,
                'status' => 'error',
                'message' => 'ID pas lawatan tidak sah.',
            ], 422);
        }

        $pas = PasLawatan::query()
            ->where('fld_pas_idPas', $pasId)
            ->first();

        if (! $pas) {
            return response()->json([
                'success' => false,
                'status' => 'error',
                'message' => 'Pas lawatan tidak dijumpai.',
            ], 404);
        }

        // Idempotent: if already keluar, just return success.
        if ((string) $pas->fld_pas_statusPas !== 'keluar') {
            $pas->update([
                'fld_pas_statusPas' => 'keluar',
                'fld_pas_masaKeluar' => now(),
            ]);
        }

        return response()->json([
            'success' => true,
            'status' => 'success',
            'message' => 'Pas lawatan berjaya ditandakan keluar.',
            'data' => [
                'id' => $pas->fld_pas_idPas,
                'fld_pas_idPas' => $pas->fld_pas_idPas,
                'fld_pas_statusPas' => $pas->fld_pas_statusPas,
                'fld_pas_masaKeluar' => optional($pas->fld_pas_masaKeluar)->toISOString(),
            ],
        ]);
    }
}

