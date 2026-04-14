<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\LaporanKejadian;
use App\Models\Pengawal;
use App\Models\PasLawatan;
use App\Models\SesiRondaan;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Dapatkan data KPI
        $kpi = [
            'laporan_baru' => LaporanKejadian::where('fld_lk_status', 'baru')->count(),
            'rondaan_harian' => SesiRondaan::whereDate('created_at', today())->count(),
            'pelawat_aktif' => PasLawatan::where('fld_pas_statusPas', 'masuk')->count(),
            'pengawal_aktif' => Pengawal::where('fld_pgw_status', 'aktif')->count(),
        ];

        // 2. Data untuk Graf (Contoh: Pelawat bulanan)
        // Di sini anda perlu buat query sebenar. Ini contoh struktur data yang Recharts perlukan:
        $dataPelawat = [
            ['name' => 'Jan', 'jumlah' => 40],
            ['name' => 'Feb', 'jumlah' => 30],
            ['name' => 'Mac', 'jumlah' => 60],
            ['name' => 'Apr', 'jumlah' => 45],
            ['name' => 'Mei', 'jumlah' => 80],
        ];

        // 3. Data untuk jadual Rondaan
        $senaraiRondaan = SesiRondaan::with('pengawal')->latest()->take(5)->get()->map(function($item) {
            $kepatuhan = $item->peratus_kepatuhan ?? 0;
            return [
                'id_pengawal' => $item->pengawal->fld_pgw_id ?? 'Tiada',
                'tarikh' => $item->created_at->format('M d, Y'),
                'kepatuhan' => $kepatuhan . '%', // Contoh
                'kepatuhan_num' => $kepatuhan, // Untuk width bar
            ];
        });

        return Inertia::render('DashboardPentadbir', [
            'kpi' => $kpi,
            'dataPelawat' => $dataPelawat,
            'senaraiRondaan' => $senaraiRondaan
        ]);
    }
}
