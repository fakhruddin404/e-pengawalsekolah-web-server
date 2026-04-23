<?php

namespace App\Http\Controllers\Api\Rondaan;

use App\Models\LokasiTitikSemak;
use App\Models\SesiRondaan;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class RondaanController extends Controller
{
    public function getTitikSemak()
    {
        $titikSemak = LokasiTitikSemak::query()->get([
            'fld_loc_id',
            'fld_loc_nama',
            'fld_loc_latitud',
            'fld_loc_longitud',
        ]);

        // Return a "clean" payload for mobile clients (while still sourced from DB columns)
        $normalized = $titikSemak->map(function ($row) {
            return [
                'id' => $row->fld_loc_id,
                'name' => $row->fld_loc_nama,
                'latitude' => (float) $row->fld_loc_latitud,
                'longitude' => (float) $row->fld_loc_longitud,
            ];
        });

        return response()->json($normalized);
    }

    public function simpanRondaan(Request $request)
    {
        $request->validate([
            'path' => 'required|array',       // Array koordinat (userRoute dari React Native)
            'peratus' => 'required|numeric',  // Peratusan titik semak yang discan
            'durasi' => 'required|string',    // Masa yang diambil
        ]);

        $user = $request->user();

        // Simpan ke jadual rekod_rondaan (anda perlu bina migration untuk jadual ini)
        $sesiRondaan = SesiRondaan::create([
            'fld_sr_idSesi' => SesiRondaan::generateSrId(),
            'fld_pgw_idPengawal' => $user->pengawal->fld_pgw_id,
            'fld_sr_pathRoute' => $request->path,
            'fld_sr_peratusTitikSemak' => $request->peratus,
            'fld_sr_tempoh' => $request->durasi,
        ]);

        return response()->json([
            'success' => true,
            'status' => 'success', // keep for backward compatibility
            'message' => 'Rekod rondaan berjaya disimpan!',
            'data' => [
                'fld_sr_idSesi' => $sesiRondaan->fld_sr_idSesi ?? null,
            ],
        ]);
    }

    public function sahkanTitik(Request $request)
    {
        $validated = $request->validate([
            'fld_loc_id' => ['required', 'string'],
            'qr_code' => ['required', 'string'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
        ]);

        $titik = LokasiTitikSemak::query()
            ->where('fld_loc_id', (string) $validated['fld_loc_id'])
            ->first();

        if (! $titik) {
            return response()->json([
                'success' => false,
                'status' => 'error',
                'message' => 'Titik semak tidak dijumpai.',
            ], 404);
        }

        // Semak QR
        if ((string) $validated['qr_code'] !== (string) $titik->fld_loc_kodQR) {
            return response()->json([
                'success' => false,
                'status' => 'error',
                'message' => 'QR tidak sah.',
            ], 400);
        }

        // Semak jarak GPS (<= 10 meter)
        $distanceKm = $this->calculateDistance(
            (float) $validated['latitude'],
            (float) $validated['longitude'],
            (float) $titik->fld_loc_latitud,
            (float) $titik->fld_loc_longitud
        );

        if ($distanceKm > 0.01) {
            return response()->json([
                'success' => false,
                'status' => 'error',
                'message' => 'Anda berada di luar kawasan titik semak',
                'distance_km' => $distanceKm,
                'allowed_km' => 0.01,
            ], 400);
        }

        return response()->json([
            'success' => true,
            'status' => 'success',
            'message' => 'Imbasan QR disahkan.',
        ], 200);
    }

    private function haversineMeters(float $lat1, float $lon1, float $lat2, float $lon2): int
    {
        $earthRadius = 6371000.0;

        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) ** 2
            + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dLon / 2) ** 2;

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return (int) round($earthRadius * $c);
    }

    private function calculateDistance(float $lat1, float $lon1, float $lat2, float $lon2): float
    {
        return $this->haversineMeters($lat1, $lon1, $lat2, $lon2) / 1000;
    }
}

