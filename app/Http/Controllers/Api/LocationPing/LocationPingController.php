<?php

namespace App\Http\Controllers\Api\LocationPing;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\LocationPing\StoreLocationPingRequest;
use App\Models\Pengawal;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class LocationPingController extends Controller
{
    /**
     * POST /api/pengawal/location-ping
     * Used by mobile pengawal app to ping GPS location.
     */
    public function store(StoreLocationPingRequest $request)
    {
        $user = $request->user();
        $pengawalId = $user?->pengawal?->fld_pgw_id;
        if (! $pengawalId) {
            return response()->json([
                'success' => false,
                'status' => 'error',
                'message' => 'Pengawal tidak dijumpai untuk akaun ini.',
            ], 400);
        }

        $validated = $request->validated();
        $deviceTimestamp = Carbon::parse((string) $validated['timestamp']);

        $payload = [
            'pengawal_id' => (string) $pengawalId,
            'latitude' => (float) $validated['latitude'],
            'longitude' => (float) $validated['longitude'],
            'accuracy' => array_key_exists('accuracy', $validated) ? $validated['accuracy'] : null,
            'altitude' => array_key_exists('altitude', $validated) ? $validated['altitude'] : null,
            'heading' => array_key_exists('heading', $validated) ? $validated['heading'] : null,
            'speed' => array_key_exists('speed', $validated) ? $validated['speed'] : null,
            'timestamp' => $deviceTimestamp->toISOString(),
            'received_at' => now()->toISOString(),
        ];

        // Force file cache store so it won't use DB cache table.
        $ttlSeconds = 60 * 10; // keep last ping for 10 minutes
        Cache::store('file')->put($this->cacheKey((string) $pengawalId), $payload, $ttlSeconds);

        return response()->json([
            'success' => true,
            'status' => 'success',
            'message' => 'Lokasi diterima.',
            'data' => $payload,
        ], 201);
    }

    /**
     * GET /api/pengawal/location-ping/latest
     * Returns latest ping per pengawal (for dashboard map).
     */
    public function latest(Request $request)
    {
        $limit = (int) ($request->query('limit', 50));
        $limit = max(1, min(200, $limit));

        // "Direct" mode: read last ping from cache per pengawal (no DB persistence).
        // We still query pengawals table to know which pengawal to show.
        $pengawals = Pengawal::query()
            ->where('fld_pgw_status', 'aktif')
            ->where('fld_pgw_statusSemasa', 'bertugas')
            ->orderBy('fld_pgw_id')
            ->limit($limit)
            ->get(['fld_pgw_id']);

        $out = [];
        foreach ($pengawals as $pgw) {
            $pgwId = (string) $pgw->fld_pgw_id;
            $data = Cache::store('file')->get($this->cacheKey($pgwId));
            if (is_array($data)) {
                $out[] = $data;
            }
        }

        // Sort by newest received_at if available
        usort($out, function ($a, $b) {
            return strcmp((string) ($b['received_at'] ?? ''), (string) ($a['received_at'] ?? ''));
        });

        return response()->json($out);
    }

    private function cacheKey(string $pengawalId): string
    {
        return 'pengawal_location_latest:' . $pengawalId;
    }
}

