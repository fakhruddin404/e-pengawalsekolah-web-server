import PentadbirLayout from '@/Layouts/PentadbirLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
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

function toDatetimeLocal(value) {
    if (!value) return '';
    const d = new Date(value);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function resolveImageUrl(value) {
    if (!value) return null;
    if (typeof value !== 'string') return null;
    if (value.startsWith('http://') || value.startsWith('https://')) return value;
    return value.startsWith('/') ? value : `/${value}`;
}

export default function Edit({ auth, laporanKejadian }) {
    const center = [laporanKejadian.fld_rpt_latitud, laporanKejadian.fld_rpt_longitud];

    const img = resolveImageUrl(laporanKejadian?.fld_rpt_urlGambar) || null; 
    const tarikhMasa = new Date(laporanKejadian.fld_rpt_tarikhMasa).toLocaleString('ms-MY');
    const pengawalNama = laporanKejadian?.pengawal?.user?.name ?? 'Nama Tidak Diketahui'; 
    const pengawalId = laporanKejadian?.pengawal?.fld_pgw_id ?? laporanKejadian?.fld_pgw_idPengawal ?? 'ID Tiada';

    const { data, setData, put, processing, errors } = useForm({
        fld_rpt_kategori: laporanKejadian.fld_rpt_kategori ?? '',
        fld_rpt_keterangan: laporanKejadian.fld_rpt_keterangan ?? '',
        fld_rpt_tarikhMasa: toDatetimeLocal(laporanKejadian.fld_rpt_tarikhMasa),
        fld_rpt_status: laporanKejadian.fld_rpt_status ?? 'baru',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('pentadbir.laporan-kejadian.update', laporanKejadian.fld_rpt_idLaporan));
    };
    
    const deleteLaporan = () => {
        if (confirm(`Adakah anda pasti mahu memadam laporan: ${laporanKejadian.fld_rpt_idLaporan}?`)) {
            router.delete(route('pentadbir.laporan-kejadian.destroy', laporanKejadian.fld_rpt_idLaporan));
        }
    };

    return (
        <PentadbirLayout
            user={auth.user}
            activeMenu="Urus Laporan Kejadian"
            breadcrumbs={[
                { label: 'Urus Laporan Kejadian', url: route('pentadbir.laporan-kejadian.index') },
                { label: 'Edit Laporan' },
            ]}
        >
            <Head title={`Edit ${laporanKejadian.fld_rpt_idLaporan}`} />

            <div className="w-full space-y-6">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-start justify-between gap-4">
                    <div>
                        <div className="text-xs text-gray-400 font-semibold">{laporanKejadian.fld_rpt_idLaporan}</div>
                        <h2 className="text-xl font-bold text-gray-900">Edit Laporan Kejadian</h2>
                        <p className="text-sm text-gray-500 mt-1">Kemaskini maklumat laporan dan status.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={deleteLaporan}
                            type="button"
                            className="px-4 py-2 text-xs font-semibold text-white bg-[#ff4d4f] hover:bg-red-600 rounded-full transition-colors"
                        >
                            Padam
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Kad Maklumat (Kiri) */}
                    <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                        <div className="h-64 bg-gray-100 shrink-0">
                            {img ? (
                                <img
                                    src={img}
                                    alt={laporanKejadian.fld_rpt_kategori}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">
                                    Tiada gambar
                                </div>
                            )}
                        </div>
                        
                        <div className="p-5 space-y-4 grow">
                            <div className="text-sm text-gray-600 whitespace-pre-wrap font-medium">
                                {laporanKejadian.fld_rpt_keterangan}
                            </div>

                            <div className="text-sm grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                <div>
                                    <div className="text-xs text-gray-400 font-semibold mb-1">Tarikh/Masa</div>
                                    <div className="font-medium text-gray-800">{tarikhMasa}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400 font-semibold mb-1">Pengawal</div>
                                    <div className="font-medium text-gray-800">{pengawalNama} ({pengawalId})</div>
                                </div>
                                <div className="col-span-2">
                                    <div className="text-xs text-gray-400 font-semibold mb-1">Koordinat GPS</div>
                                    <div className="font-medium text-gray-800">
                                        {laporanKejadian.fld_rpt_latitud}, {laporanKejadian.fld_rpt_longitud}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Ruang Form Status */}
                        <form onSubmit={submit} className="p-5 bg-gray-50 border-t border-gray-100">
                            <div className="mb-3">
                                <InputLabel htmlFor="fld_rpt_status" value="Kemaskini Status" />
                                <select
                                    id="fld_rpt_status"
                                    value={data.fld_rpt_status}
                                    className="mt-1 block w-full pl-4 pr-10 py-2.5 text-sm border-gray-200 rounded-xl bg-white focus:ring-blue-500 focus:border-blue-500 font-semibold text-gray-700 shadow-sm"
                                    onChange={(e) => setData('fld_rpt_status', e.target.value)}
                                    required
                                >
                                    <option value="baru">Baru</option>
                                    <option value="dalam_siasatan">Dalam Siasatan</option>
                                    <option value="selesai">Selesai</option>
                                </select>
                                <InputError message={errors.fld_rpt_status} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-end">
                                <PrimaryButton disabled={processing} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 w-full sm:w-auto justify-center">
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>

                    {/* Kad Peta (Kanan) */}
                    <div className="lg:col-span-3 bg-white rounded-3xl p-2 shadow-sm border border-gray-100 overflow-hidden h-[400px] lg:h-auto z-0 relative">
                        <MapContainer center={center} zoom={16} scrollWheelZoom={false} className="h-full w-full rounded-2xl z-0">
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={center} />
                        </MapContainer>
                    </div>
                </div>
            </div>
        </PentadbirLayout>
    );
}