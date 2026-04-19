import PentadbirLayout from '@/Layouts/PentadbirLayout';
import { Head, Link, router } from '@inertiajs/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Baiki masalah ikon hilang/rosak di React-Leaflet
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetinaUrl,
    iconUrl: iconUrl,
    shadowUrl: shadowUrl,
});

export default function Index({ auth, titikSemaks }) {
    const defaultCenter = titikSemaks?.length > 0
        ? [(titikSemaks[0].fld_loc_latitud), (titikSemaks[0].fld_loc_longitud)]
        : [3.073850, 101.607420];

    const deleteTitikSemak = (item) => {
        if (confirm(`Adakah anda pasti mahu memadam titik semak: ${item.fld_loc_nama}?`)) {
            router.delete(route('pentadbir.titik-semak.destroy', item.fld_loc_id), {
                preserveScroll: true,
                onSuccess: () => alert(`Titik semak ${item.fld_loc_nama} berjaya dipadam.`),
            });
        }
    };

    const cetakQR = (item) => {
        window.open(route('pentadbir.titik-semak.cetak-qr', item.fld_loc_id), '_blank');
    };

    return (
        <PentadbirLayout
            user={auth.user}
            activeMenu="Urus Titik Semak"
            breadcrumbs={[{ label: 'Urus Titik Semak' }]}
        >
            <Head title="Senarai Titik Semak" />

            <div className="w-full space-y-6">

                {/* Header */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Senarai Titik Semak</h2>
                        <p className="text-sm text-gray-500 mt-1">Urus lokasi rondaan dan muat turun kod QR di sini.</p>
                    </div>
                    <Link
                        href={route('pentadbir.titik-semak.create')}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition-colors shadow-sm"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                        Tambah Lokasi
                    </Link>
                </div>

                {/* Peta (Map) Section */}
                <div className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100 overflow-hidden h-[400px] z-0 relative">
                    {/* React Leaflet Map */}
                    <MapContainer center={defaultCenter} zoom={13} scrollWheelZoom={true} className="h-full w-full rounded-2xl z-0">
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {/* 3. BAIKI: Tambah ejaan betul fld_loc_longitud & parseFloat */}
                        {titikSemaks?.map((titik) => (
                            <Marker
                                key={titik.fld_loc_id}
                                position={[titik.fld_loc_latitud, titik.fld_loc_longitud]}
                            >
                                <Popup>
                                    <div className="text-center">
                                        <strong className="block text-gray-800">{titik.fld_loc_id}</strong>
                                        <span className="text-gray-600">{titik.fld_loc_nama}</span>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>

                {/* Jadual Data */}
                <div className="bg-[#f4f7f9] rounded-3xl p-6 shadow-sm border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="text-xs text-gray-400 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-4 font-medium">ID</th>
                                    <th className="px-4 py-4 font-medium">Lokasi</th>
                                    <th className="px-4 py-4 font-medium">Latitude</th>
                                    <th className="px-4 py-4 font-medium">Longitude</th>
                                    <th className="px-4 py-4 font-medium text-right">Tindakan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {titikSemaks?.length > 0 ? (
                                    titikSemaks.map((item) => (
                                        <tr key={item.fld_loc_id} className="text-gray-700 hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-4 font-medium">{item.fld_loc_id}</td>
                                            <td className="px-4 py-4">{item.fld_loc_nama}</td>
                                            <td className="px-4 py-4">{item.fld_loc_latitud}</td>
                                            <td className="px-4 py-4">{item.fld_loc_longitud}</td> {/* BAIKI: fld_loc_longitud */}
                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => cetakQR(item)}
                                                        className="flex items-center justify-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-teal-500 hover:bg-teal-600 rounded-full transition-colors shadow-sm"
                                                    >
                                                        Cetak QR
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                                                    </button>
                                                    <button
                                                        onClick={() => deleteTitikSemak(item)}
                                                        className="flex items-center justify-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-[#ff4d4f] hover:bg-red-600 rounded-full transition-colors"
                                                    >
                                                        Padam
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-10 text-gray-500">
                                            Tiada data titik semak dijumpai.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </PentadbirLayout>
    );
}