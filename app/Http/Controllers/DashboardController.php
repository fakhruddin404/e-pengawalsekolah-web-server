<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\LaporanKejadian;
use App\Models\Pengawal;
use App\Models\PasLawatan;
use App\Models\LokasiTitikSemak;
use App\Models\SesiRondaan;

class DashboardController extends Controller
{
    public function index()
    {
        // Dapatkan data KPI
        $kpi = [
            'laporan_baru' => LaporanKejadian::where('fld_rpt_status', 'baru')->count(),
            'rondaan_harian' => SesiRondaan::whereDate('created_at', today())->count(),
            'pelawat_aktif' => PasLawatan::where('fld_pas_statusPas', 'masuk')->count(),
            'pengawal_aktif' => Pengawal::where('fld_pgw_status', 'aktif')->count(),
        ];

        // 1. Data untuk Pelawat (Line Chart)
        $dataPelawat = [
            ['name' => 'Jan', 'jumlah' => 40],
            ['name' => 'Feb', 'jumlah' => 30],
            ['name' => 'Mac', 'jumlah' => 60],
            ['name' => 'Apr', 'jumlah' => 45],
            ['name' => 'Mei', 'jumlah' => 80],
        ];

        // 2. Data untuk Rondaan (Bar Chart)
        $dataRondaan = [
            ['name' => 'Isn', 'jumlah' => 12],
            ['name' => 'Sel', 'jumlah' => 19],
            ['name' => 'Rab', 'jumlah' => 8],
            ['name' => 'Kha', 'jumlah' => 14],
            ['name' => 'Jum', 'jumlah' => 11],
            ['name' => 'Sab', 'jumlah' => 6],
            ['name' => 'Ahd', 'jumlah' => 9],
        ];

        // 3. Data untuk Status Laporan (Donut Chart)
        // Nota: 'laporan_baru' diambil dari array $kpi yang kita buat sebelum ini
        $dataStatusRPT = [
            ['name' => 'Baru', 'value' => $kpi['laporan_baru'] ?? 0],
            ['name' => 'Dalam Siasatan', 'value' => 6],
            ['name' => 'Selesai', 'value' => 10],
        ];

        //Data untuk jadual Rondaan
        $totalPatutDilawat = LokasiTitikSemak::count();

        $senaraiRondaan = SesiRondaan::with('pengawal')
            ->latest()
            ->take(5)
            ->get()
            ->map(function($item) use ($totalPatutDilawat) {
                $jumlahDiimbas = $item->fld_sr_jumlahTitikSemak;
                
                // Elakkan pembahagian dengan kosong (division by zero)
                $peratus = $totalPatutDilawat > 0 
                    ? round(($jumlahDiimbas / $totalPatutDilawat) * 100) 
                    : 0;

                return [
                    'id_pengawal'   => $item->pengawal->fld_pgw_id ?? 'Tiada',
                    'tarikh'        => $item->created_at->format('d M, Y'),
                    'kepatuhan'     => $peratus . '%',
                    'kepatuhan_num' => $peratus, // Digunakan untuk CSS width: 80%
                ];
            });

        return Inertia::render('DashboardPentadbir', [
            'kpi' => $kpi,
            'dataPelawat' => $dataPelawat,
            'senaraiRondaan' => $senaraiRondaan,
            'dataRondaan' => $dataRondaan,
            'dataStatusRPT' => $dataStatusRPT
        ]);
    }
}
