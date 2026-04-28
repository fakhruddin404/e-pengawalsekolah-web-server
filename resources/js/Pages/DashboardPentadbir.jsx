import PentadbirLayout from '@/Layouts/PentadbirLayout'; 
import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import {
    LineChart,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    BarChart,
    Bar,
    CartesianGrid,
    YAxis,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';

import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useMemo, useState } from 'react';
import { Marker, Polyline } from 'react-leaflet';

import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetinaUrl,
    iconUrl: iconUrl,
    shadowUrl: shadowUrl,
});

const statusPelawatLabel = {
    keluar: 'Keluar',
    ditolak: 'Ditolak',
    masuk: 'Masuk',
};

const tajukGrafPelawat = {
    minggu: 'Pelawat (Minggu Ini)',
    bulan: 'Pelawat (Bulan Ini)',
    tahun: 'Pelawat (Tahun Ini)',
};

export default function DashboardPentadbir({ kpi, dataPelawat, pelawatLihat, dataRondaan, dataStatusRPT, senaraiRondaan, pasPelawat }) {
    
    // Jika data props belum sedia (mengelakkan error semasa load)
    const stats = kpi || { laporan_baru: 0, rondaan_harian: 0, pelawat_aktif: 0, pengawal_aktif: 0 };
    const tableData = senaraiRondaan || [];
    const pasPelawatRows = pasPelawat || [];
    const chartData = dataPelawat || [];
    const barData = dataRondaan || [];
    const donutData = dataStatusRPT || [];
    const modPelawat = ['minggu', 'bulan', 'tahun'].includes(pelawatLihat) ? pelawatLihat : 'bulan';
    const tajukPelawatGraf = tajukGrafPelawat[modPelawat] ?? tajukGrafPelawat.bulan;

    const donutColors = ['#3b82f6', '#f59e0b', '#10b981'];
    const [routeModal, setRouteModal] = useState({
        open: false,
        id_pengawal: null,
        tarikh: null,
        tempoh: null,
        peratus: null,
        pathRoute: null,
    });

    // Demo route (placeholder) – boleh sambung ke data sebenar bila siap
    const routeCenter = [3.07385, 101.60742];
    const demoRoute = useMemo(
        () => [
            [3.0729, 101.6064],
            [3.0734, 101.6068],
            [3.0732, 101.6076],
            [3.0739, 101.6079],
            [3.0742, 101.6072],
            [3.0737, 101.6069],
            [3.0739, 101.6062],
        ],
        []
    );

    function normalizePathToLatLng(path) {
        if (!Array.isArray(path)) return [];
        return path
            .map((p) => {
                const lat = p?.latitude ?? p?.lat ?? p?.Lat ?? p?.LAT;
                const lng = p?.longitude ?? p?.lng ?? p?.lon ?? p?.Long ?? p?.LNG;
                const latNum = Number(lat);
                const lngNum = Number(lng);
                if (Number.isFinite(latNum) && Number.isFinite(lngNum)) return [latNum, lngNum];
                return null;
            })
            .filter(Boolean);
    }

    function haversineKm(a, b) {
        const toRad = (d) => (d * Math.PI) / 180;
        const R = 6371;
        const dLat = toRad(b[0] - a[0]);
        const dLng = toRad(b[1] - a[1]);
        const lat1 = toRad(a[0]);
        const lat2 = toRad(b[0]);
        const x =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
        return 2 * R * Math.asin(Math.min(1, Math.sqrt(x)));
    }

    const routePoints = useMemo(() => {
        const pts = normalizePathToLatLng(routeModal.pathRoute);
        return pts.length >= 2 ? pts : demoRoute;
    }, [routeModal.pathRoute, demoRoute]);

    const routeStats = useMemo(() => {
        let km = 0;
        for (let i = 1; i < routePoints.length; i++) km += haversineKm(routePoints[i - 1], routePoints[i]);
        const pct = Number(routeModal.peratus);
        return {
            km: Number.isFinite(km) ? km : 0,
            peratus: Number.isFinite(pct) ? Math.max(0, Math.min(100, pct)) : null,
            tempoh: routeModal.tempoh ?? null,
        };
    }, [routePoints, routeModal.peratus, routeModal.tempoh]);

    return (
        <PentadbirLayout>
            <Head title="Papan Pemuka" />

            <div className="w-full space-y-6">

                {/* 1. Top KPI Cards - Menggunakan data dinamik */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-[#3b82f6] text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between h-28 relative overflow-hidden">
                        <span className="text-sm font-medium z-10">Laporan Kejadian Terkini</span>
                        <span className="text-3xl font-bold z-10">{stats.laporan_baru}</span>
                        <div className="absolute right-0 bottom-0 w-24 h-24 bg-white opacity-10 rounded-tl-full transform translate-x-4 translate-y-4"></div>
                    </div>
                    <div className="bg-[#374151] text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between h-28 relative overflow-hidden">
                        <span className="text-sm font-medium z-10">Rekod Rondaan Harian</span>
                        <span className="text-3xl font-bold z-10">{stats.rondaan_harian}</span>
                        <div className="absolute right-0 bottom-0 w-24 h-24 bg-white opacity-5 rounded-tl-full transform translate-x-4 translate-y-4"></div>
                    </div>
                    <div className="bg-[#60a5fa] text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between h-28 relative overflow-hidden">
                        <span className="text-sm font-medium z-10">Pelawat Dalam Kawasan Sekolah</span>
                        <span className="text-3xl font-bold z-10">{stats.pelawat_aktif}</span>
                        <div className="absolute right-0 bottom-0 w-24 h-24 bg-white opacity-10 rounded-tl-full transform translate-x-4 translate-y-4"></div>
                    </div>
                    <div className="bg-[#4b5563] text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between h-28 relative overflow-hidden">
                        <span className="text-sm font-medium z-10">Pengawal Sedang Bekerja</span>
                        <span className="text-3xl font-bold z-10">{stats.pengawal_aktif}</span>
                        <div className="absolute right-0 bottom-0 w-24 h-24 bg-white opacity-5 rounded-tl-full transform translate-x-4 translate-y-4"></div>
                    </div>
                </div>

                {/* 2. Line Chart - Menggunakan Recharts */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-6">
                        <h3 className="text-[#a855f7] font-semibold">{tajukPelawatGraf}</h3>
                        <div className="inline-flex flex-wrap gap-1 rounded-xl bg-slate-100/90 p-1 text-xs font-medium text-slate-600">
                            {[
                                { k: 'minggu', t: 'Minggu' },
                                { k: 'bulan', t: 'Bulan' },
                                { k: 'tahun', t: 'Tahun' },
                            ].map(({ k, t }) => (
                                <Link
                                    key={k}
                                    href={route('pentadbir.dashboard', { pelawat_lihat: k })}
                                    preserveScroll
                                    className={
                                        'rounded-lg px-3 py-1.5 transition-colors ' +
                                        (modPelawat === k
                                            ? 'bg-white text-violet-700 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-800')
                                    }
                                >
                                    {t}
                                </Link>
                            ))}
                        </div>
                    </div>
                    
                    <div className="h-48 w-full text-xs text-slate-500">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={chartData}
                                margin={{ top: 8, right: 8, left: 4, bottom: 4 }}
                            >
                                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#94a3b8"
                                    fontSize={11}
                                    tickLine={true}
                                    axisLine={true}
                                    tick={{ fill: '#64748b' }}
                                />
                                <YAxis
                                    stroke="#94a3b8"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={true}
                                    tick={{ fill: '#64748b' }}
                                    allowDecimals={false}
                                    width={32}
                                />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line type="monotone" dataKey="jumlah" stroke="#a855f7" strokeWidth={3} dot={{ r: 4, fill: "#a855f7" }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. Bar Chart & Donut Chart Row (Boleh dikekalkan dummy buat masa ni, atau guna Recharts <BarChart> / <PieChart>) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-[#6366f1] font-semibold">Peratusan Pematuhan Rondaan Pengawal</h3>
                        </div>

                        <div className="h-56 w-full text-xs text-gray-400">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" stroke="#cbd5e1" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#cbd5e1" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '10px',
                                            border: 'none',
                                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                        }}
                                    />
                                    <Bar dataKey="jumlah" fill="#6366f1" radius={[10, 10, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-[#10b981] font-semibold">Status Laporan Kejadian</h3>
                        </div>

                        <div className="h-56 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '10px',
                                            border: 'none',
                                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                        }}
                                    />
                                    <Legend verticalAlign="bottom" height={24} />
                                    <Pie
                                        data={donutData}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={3}
                                        stroke="transparent"
                                    >
                                        {donutData.map((entry, index) => (
                                            <Cell key={`cell-${entry.name}`} fill={donutColors[index % donutColors.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* 4. Map Placeholder */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-[#0ea5e9] font-semibold">Lokasi Semasa Pengawal Bekerja</h3>
                    </div>

                    <div className="bg-white rounded-3xl p-2 border border-gray-100 overflow-hidden h-[380px] z-0 relative">
                        <MapContainer center={[3.07385, 101.60742]} zoom={15} scrollWheelZoom={true} className="h-full w-full rounded-2xl z-0">
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                        </MapContainer>
                    </div>
                </div>

                {/* 5. Senarai Sesi Rondaan Table - Menggunakan mapping data sebenar */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-[#0ea5e9] font-semibold mb-4">Senarai Sesi Rondaan Harian</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="text-xs text-gray-400 uppercase bg-gray-50/50">
                                <tr>
                                    <th className="px-4 py-3 font-medium rounded-l-lg">ID Pengawal</th>
                                    <th className="px-4 py-3 font-medium">Tarikh</th>
                                    <th className="px-4 py-3 font-medium w-1/3">Kepatuhan Rondaan</th>
                                    <th className="px-4 py-3 font-medium text-center rounded-r-lg">Peta Rondaan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.length > 0 ? (
                                    tableData.map((row, i) => (
                                        <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                                            <td className="px-4 py-4 font-medium text-gray-800">{row.id_pengawal}</td>
                                            <td className="px-4 py-4">{row.tarikh}</td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                                                        {/* Lebar bar berdasarkan data sebenar */}
                                                        <div className="bg-[#6366f1] h-2.5 rounded-full" style={{ width: `${row.kepatuhan_num}%` }}></div>
                                                    </div>
                                                    <span className="text-xs font-semibold text-gray-600 w-8">{row.kepatuhan}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex justify-center">
                                                    <button 
                                                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                                        onClick={() =>
                                                            setRouteModal({
                                                                open: true,
                                                                id_pengawal: row.id_pengawal,
                                                                tarikh: row.tarikh,
                                                                tempoh: row.tempoh ?? null,
                                                                peratus: row.peratus ?? row.kepatuhan_num ?? null,
                                                                pathRoute: row.pathRoute ?? null,
                                                            })
                                                        }
                                                    >
                                                        <ApplicationLogo type={3} className="w-4 h-4 opacity-80" />
                                                        Lihat Peta
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-6 text-gray-400">Tiada rekod rondaan dijumpai.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Senarai Pas Lawatan */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-[#0ea5e9] font-semibold mb-4">Senarai Pas Lawatan</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="text-xs text-gray-400 uppercase bg-gray-50/50">
                                <tr>
                                    <th className="px-4 py-3 font-medium rounded-l-lg">ID Pas</th>
                                    <th className="px-4 py-3 font-medium">Nama Pelawat</th>
                                    <th className="px-4 py-3 font-medium">No. IC</th>
                                    <th className="px-4 py-3 font-medium">Tujuan</th>
                                    <th className="px-4 py-3 font-medium">Masa Masuk</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                    <th className="px-4 py-3 font-medium text-right rounded-r-lg">ID Pengawal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pasPelawatRows.length > 0 ? (
                                    pasPelawatRows.map((row) => (
                                        <tr
                                            key={row.id_pas}
                                            className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50"
                                        >
                                            <td className="px-4 py-4 font-medium text-gray-800 whitespace-nowrap">
                                                {row.id_pas}
                                            </td>
                                            <td className="px-4 py-4 text-gray-800">{row.nama_pelawat}</td>
                                            <td className="px-4 py-4 whitespace-nowrap">{row.no_ic}</td>
                                            <td className="px-4 py-4 max-w-xs truncate" title={row.tujuan}>
                                                {row.tujuan}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">{row.masa_masuk}</td>
                                            <td className="px-4 py-4">
                                                <span
                                                    className={
                                                        'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ' +
                                                        (row.status === 'aktif' || row.status === 'masuk'
                                                            ? 'bg-emerald-100 text-emerald-800'
                                                            : row.status === 'keluar'
                                                              ? 'bg-slate-100 text-slate-700'
                                                              : 'bg-rose-100 text-rose-800')
                                                    }
                                                >
                                                    {statusPelawatLabel[row.status] ?? row.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-right font-medium text-gray-800 whitespace-nowrap">
                                                {row.id_pengawal}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-6 text-gray-400">
                                            Tiada rekod pas lawatan dijumpai.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* Route Display For SesiRondaan */}
            {routeModal.open && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Laluan Sesi Rondaan"
                    onClick={() =>
                        setRouteDisplay({
                            open: false,
                            id_pengawal: null,
                            tarikh: null,
                            tempoh: null,
                            peratus: null,
                            pathRoute: null,
                        })
                    }
                >
                    <div
                        className="w-full max-w-5xl rounded-3xl bg-white shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="px-6 pt-6 pb-3">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="text-sm font-semibold text-slate-700">Laluan Sesi Rondaan</div>
                                    <div className="mt-1 text-xs text-slate-500">
                                        ID: <span className="font-semibold text-slate-700">{routeModal.id_pengawal ?? '—'}</span>
                                        {routeModal.tarikh ? <span className="ml-2">• {routeModal.tarikh}</span> : null}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                                    onClick={() =>
                                        setRouteDisplay({
                                            open: false,
                                            id_pengawal: null,
                                            tarikh: null,
                                            tempoh: null,
                                            peratus: null,
                                            pathRoute: null,
                                        })
                                    }
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>

                        <div className="relative px-6 pb-6">
                            <div className="relative z-0 rounded-2xl border border-slate-200 overflow-hidden h-[420px] bg-slate-50">
                                <MapContainer
                                    center={routePoints?.[0] ?? routeCenter}
                                    zoom={17}
                                    scrollWheelZoom={true}
                                    className="h-full w-full"
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <Polyline positions={routePoints} pathOptions={{ color: '#f97316', weight: 5, opacity: 0.95 }} />
                                    <Marker position={routePoints[routePoints.length - 1]} />
                                </MapContainer>
                            </div>

                            {/* Info card style seperti imej contoh */}
                            <div className="absolute right-10 top-16 z-[2000] w-56 rounded-2xl bg-white/95 shadow-lg border border-slate-200 p-4">
                                <div className="text-sm font-semibold text-slate-800">
                                    {(routeStats.tempoh ?? '—') + ' (' + routeStats.km.toFixed(1) + ' km)'}
                                </div>
                                <div className="mt-1 text-[11px] text-slate-500">Pemantauan titik semak</div>
                                <div className="mt-3 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                                    <div
                                        className="h-2 bg-blue-500"
                                        style={{ width: `${routeStats.peratus ?? 0}%` }}
                                    />
                                </div>
                                <div className="mt-2 text-[11px] font-semibold text-blue-600">
                                    {routeStats.peratus !== null ? `${routeStats.peratus}%` : '—'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PentadbirLayout>
    );
}