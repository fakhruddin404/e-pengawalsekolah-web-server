import PentadbirLayout from '@/Layouts/PentadbirLayout';
import { Head, Link, router } from '@inertiajs/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetinaUrl,
    iconUrl: iconUrl,
    shadowUrl: shadowUrl,
});

function statusBadge(status) {
    const base = 'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold';
    if (status === 'selesai') return `${base} bg-emerald-50 text-emerald-700`;
    if (status === 'dalam_siasatan') return `${base} bg-amber-50 text-amber-700`;
    return `${base} bg-blue-50 text-blue-700`;
}

function resolveImageUrl(value) {
    if (!value) return null;
    if (typeof value !== 'string') return null;
    if (value.startsWith('http://') || value.startsWith('https://')) return value;
    return value.startsWith('/') ? value : `/${value}`;
}

export default function Index({ auth, laporanKejadians }) {
    const defaultCenter = laporanKejadians?.length > 0
        ? [laporanKejadians[0].fld_rpt_latitud, laporanKejadians[0].fld_rpt_longitud]
        : [3.07385, 101.60742];

    const deleteLaporan = (item) => {
        if (confirm(`Adakah anda pasti mahu memadam laporan: ${item.fld_rpt_idLaporan}?`)) {
            router.delete(route('pentadbir.laporan-kejadian.destroy', item.fld_rpt_idLaporan), {
                preserveScroll: true,
            });
        }
    };

    return (
        <PentadbirLayout
            user={auth.user}
            activeMenu="Urus Laporan Kejadian"
            breadcrumbs={[{ label: 'Urus Laporan Kejadian' }]}
        >
            <Head title="Senarai Laporan Kejadian" />

            <div className="w-full space-y-6">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Senarai Laporan Kejadian</h2>
                        <p className="text-sm text-gray-500 mt-1">Semak, kemaskini dan padam laporan kejadian di sini.</p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100 overflow-hidden h-[400px] z-0 relative">
                    <MapContainer center={defaultCenter} zoom={13} scrollWheelZoom={false} className="h-full w-full rounded-2xl z-0">
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {laporanKejadians?.map((laporan) => (
                            <Marker
                                key={laporan.fld_rpt_idLaporan}
                                position={[laporan.fld_rpt_latitud, laporan.fld_rpt_longitud]}
                            >
                                <Popup>
                                    <div className="text-center">
                                        <strong className="block text-gray-800">{laporan.fld_rpt_idLaporan}</strong>
                                        <span className="text-gray-600">{laporan.fld_rpt_kategori}</span>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {laporanKejadians?.length > 0 ? (
                        laporanKejadians.map((laporan) => {
                            const img = resolveImageUrl(laporan.fld_rpt_urlGambar);
                            const pengawalNama = laporan?.pengawal?.user?.name ?? '-';
                            const pengawalId = laporan?.pengawal?.fld_pgw_id ?? laporan?.fld_pgw_idPengawal ?? '-';
                            const tarikhMasa = laporan?.fld_rpt_tarikhMasa
                                ? new Date(laporan.fld_rpt_tarikhMasa).toLocaleString()
                                : '-';

                            return (
                                <div
                                    key={laporan.fld_rpt_idLaporan}
                                    className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                                >
                                    <div className="h-44 bg-gray-100">
                                        {img ? (
                                            <img
                                                src={img}
                                                alt={laporan.fld_rpt_kategori}
                                                className="h-full w-full object-cover"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">
                                                Tiada gambar
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-5 space-y-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <div className="text-xs text-gray-400 font-semibold">{laporan.fld_rpt_idLaporan}</div>
                                                <div className="text-lg font-bold text-gray-900">{laporan.fld_rpt_kategori}</div>
                                            </div>
                                            <span className={statusBadge(laporan.fld_rpt_status)}>
                                                {String(laporan.fld_rpt_status).replaceAll('_', ' ')}
                                            </span>
                                        </div>

                                        <div className="text-sm text-gray-600 line-clamp-2">{laporan.fld_rpt_keterangan}</div>

                                        <div className="text-xs text-gray-500 grid grid-cols-2 gap-2">
                                            <div>
                                                <div className="text-gray-400 font-semibold">Tarikh/Masa</div>
                                                <div className="font-medium text-gray-700">{tarikhMasa}</div>
                                            </div>
                                            <div>
                                                <div className="text-gray-400 font-semibold">Pengawal</div>
                                                <div className="font-medium text-gray-700">{pengawalNama} ({pengawalId})</div>
                                            </div>
                                            <div className="col-span-2">
                                                <div className="text-gray-400 font-semibold">Koordinat</div>
                                                <div className="font-medium text-gray-700">
                                                    {laporan.fld_rpt_latitud}, {laporan.fld_rpt_longitud}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end gap-2 pt-2">
                                            <Link
                                                href={route('pentadbir.laporan-kejadian.edit', laporan.fld_rpt_idLaporan)}
                                                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors shadow-sm"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => deleteLaporan(laporan)}
                                                className="px-4 py-2 text-xs font-semibold text-white bg-[#ff4d4f] hover:bg-red-600 rounded-full transition-colors"
                                            >
                                                Padam
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center text-gray-500">
                            Tiada laporan kejadian dijumpai.
                        </div>
                    )}
                </div>
            </div>
        </PentadbirLayout>
    );
}

