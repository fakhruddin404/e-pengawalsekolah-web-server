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
    public function index(Request $request)
    {
        $pelawatLihat = $request->query('pelawat_lihat', 'bulan');
        if (!in_array($pelawatLihat, ['minggu', 'bulan', 'tahun'], true)) {
            $pelawatLihat = 'bulan';
        }

        // Dapatkan data KPI
        $kpi = [
            'laporan_baru' => LaporanKejadian::where('fld_rpt_status', 'Baru')->count(),
            'rondaan_harian' => SesiRondaan::whereDate('created_at', today())->count(),
            'pelawat_aktif' => PasLawatan::where('fld_pas_statusPas', 'masuk')->count(),
            'pengawal_aktif' => Pengawal::where('fld_pgw_status', 'aktif')->count(),
        ];

        // 1. Data untuk Pelawat (Line Chart) — guna pilihan: minggu | bulan | tahun
        $dataPelawat = $this->dataPelawatBagiLihat($pelawatLihat);

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

        // 3. Data untuk Status Laporan (Donut Chart) — kiraan dari model LaporanKejadian
        $dataStatusRPT = [
            ['name' => 'Baru', 'value' => $kpi['laporan_baru'] ?? 0],
            ['name' => 'Dalam Siasatan', 'value' => LaporanKejadian::where('fld_rpt_status', 'Dalam Siasatan')->count()],
            ['name' => 'Selesai', 'value' => LaporanKejadian::where('fld_rpt_status', 'Selesai')->count()],
        ];

        //Data untuk jadual Rondaan (kepatuhan dari fld_sr_peratusTitikSemak pada model)
        $senaraiRondaan = SesiRondaan::with('pengawal')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($item) {
                $peratus = (int) $item->fld_sr_peratusTitikSemak;

                return [
                    'id_sesi'       => $item->fld_sr_idSesi,
                    'id_pengawal'   => $item->pengawal->fld_pgw_id ?? 'Tiada',
                    'tarikh'        => $item->created_at->format('d M, Y'),
                    'tempoh'        => $item->fld_sr_tempoh,
                    'peratus'       => $peratus,
                    'kepatuhan'     => $peratus . '%',
                    'kepatuhan_num' => $peratus,
                    'pathRoute'     => $item->fld_sr_pathRoute,
                ];
            });

        $pasPelawat = PasLawatan::with(['pelawat', 'pengawal'])
            ->latest('fld_pas_masaMasuk')
            ->take(10)
            ->get()
            ->map(function ($pas) {
                return [
                    'id_pas' => $pas->fld_pas_idPas,
                    'nama_pelawat' => $pas->pelawat->fld_vis_namaPenuh ?? '—',
                    'no_ic' => $pas->pelawat->fld_vis_noIC ?? '—',
                    'tujuan' => $pas->fld_pas_tujuan,
                    'masa_masuk' => $pas->fld_pas_masaMasuk
                        ? $pas->fld_pas_masaMasuk->format('d M Y, H:i')
                        : '—',
                    'status' => $pas->fld_pas_statusPas,
                    'id_pengawal' => $pas->pengawal->fld_pgw_id ?? '—',
                ];
            });

        return Inertia::render('DashboardPentadbir', [
            'kpi' => $kpi,
            'dataPelawat' => $dataPelawat,
            'pelawatLihat' => $pelawatLihat,
            'senaraiRondaan' => $senaraiRondaan,
            'pasPelawat' => $pasPelawat,
            'dataRondaan' => $dataRondaan,
            'dataStatusRPT' => $dataStatusRPT
        ]);
    }

    /**
     * Graf lawatan: minggu = hari isnin–ahad minggu semasa, bulan = hari dalam bulan semasa, tahun = 12 bulan tahun semasa.
     *
     * @param  'minggu'|'bulan'|'tahun'  $lihat
     */
    private function dataPelawatBagiLihat(string $lihat): array
    {
        $namaHariMinggu = ['Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab', 'Ahd'];
        $bulanPendek = [1 => 'Jan', 2 => 'Feb', 3 => 'Mac', 4 => 'Apr', 5 => 'Mei', 6 => 'Jun', 7 => 'Jul', 8 => 'Ogs', 9 => 'Sep', 10 => 'Okt', 11 => 'Nov', 12 => 'Dis'];

        if ($lihat === 'tahun') {
            $tahun = (int) now()->year;
            $jumlahBulanTahun = array_fill(1, 12, 0);
            foreach (PasLawatan::query()
                ->whereYear('fld_pas_masaMasuk', $tahun)
                ->selectRaw('MONTH(fld_pas_masaMasuk) as m, COUNT(*) as c')
                ->groupByRaw('MONTH(fld_pas_masaMasuk)')
                ->get() as $row) {
                $b = (int) $row->m;
                if ($b >= 1 && $b <= 12) {
                    $jumlahBulanTahun[$b] = (int) $row->c;
                }
            }

            $susun = [];
            for ($m = 1; $m <= 12; $m++) {
                $susun[] = [
                    'name' => $bulanPendek[$m],
                    'jumlah' => $jumlahBulanTahun[$m],
                ];
            }
            return $susun;
        }

        if ($lihat === 'minggu') {
            $sekarang = now();
            $dow = (int) $sekarang->dayOfWeek;
            $offsetHariKeIsnin = $dow === 0 ? 6 : $dow - 1;
            $mulaMinggu = $sekarang->copy()->subDays($offsetHariKeIsnin)->startOfDay();
            $hujungMinggu = $mulaMinggu->copy()->addDays(6)->endOfDay();
            $kiraHarian = PasLawatan::query()
                ->where('fld_pas_masaMasuk', '>=', $mulaMinggu)
                ->where('fld_pas_masaMasuk', '<=', $hujungMinggu)
                ->selectRaw('DATE(fld_pas_masaMasuk) as hari, COUNT(*) as c')
                ->groupByRaw('DATE(fld_pas_masaMasuk)')
                ->pluck('c', 'hari');

            $susun = [];
            for ($i = 0; $i < 7; $i++) {
                $tarikh = $mulaMinggu->copy()->addDays($i);
                $k = $tarikh->toDateString();
                $susun[] = [
                    'name' => $namaHariMinggu[$i],
                    'jumlah' => (int) ($kiraHarian[$k] ?? 0),
                ];
            }
            return $susun;
        }

        // bulan — keseluruhan hari bulan semasa
        $mulaBulan = now()->startOfMonth();
        $hujungBulan = now()->endOfMonth();
        $kiraHarian = PasLawatan::query()
            ->where('fld_pas_masaMasuk', '>=', $mulaBulan)
            ->where('fld_pas_masaMasuk', '<=', $hujungBulan->copy()->endOfDay())
            ->selectRaw('DATE(fld_pas_masaMasuk) as hari, COUNT(*) as c')
            ->groupByRaw('DATE(fld_pas_masaMasuk)')
            ->pluck('c', 'hari');

        $susun = [];
        for ($tarikh = $mulaBulan->copy(); $tarikh->lte($hujungBulan); $tarikh->addDay()) {
            $k = $tarikh->toDateString();
            $susun[] = [
                'name' => $tarikh->format('d'),
                'jumlah' => (int) ($kiraHarian[$k] ?? 0),
            ];
        }
        return $susun;
    }
}
