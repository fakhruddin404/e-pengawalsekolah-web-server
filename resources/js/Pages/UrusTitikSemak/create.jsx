import PentadbirLayout from '@/Layouts/PentadbirLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Baiki masalah ikon hilang di React-Leaflet
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetinaUrl,
    iconUrl: iconUrl,
    shadowUrl: shadowUrl,
});

// Komponen Sub untuk menangkap klik pada peta
function LocationMarker({ position, setPosition, setData }) {
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng); // Set posisi pin
            setData(data => ({
                ...data,
                fld_loc_latitud: e.latlng.lat.toFixed(8), // Kemas kini form latitud
                fld_loc_longitud: e.latlng.lng.toFixed(8)  // Kemas kini form longitud
            }));
            map.flyTo(e.latlng, map.getZoom()); // Gerakkan peta ke titik klik
        },
    });

    return position === null ? null : <Marker position={position}></Marker>;
}

export default function Create({ auth, nextId }) {
    // Posisi default peta (Tengah Malaysia)
    const defaultCenter = [4.2105, 101.9758];
    const [mapPosition, setMapPosition] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        fld_loc_id: nextId, // Auto-generate dari controller
        fld_loc_nama: '',
        fld_loc_latitud: '',
        fld_loc_longitud: '',
        fld_loc_status: 'aktif',
    });

    const submit = (e) => {
        e.preventDefault();
        
        // Pastikan latitud & longitud telah dipilih
        if (!data.fld_loc_latitud || !data.fld_loc_longitud) {
            alert('Sila klik pada peta untuk menetapkan lokasi (Pin) titik semak.');
            return;
        }

        post(route('pentadbir.titik-semak.store'));
    };

    return (
        <PentadbirLayout
            user={auth.user}
            activeMenu="Urus Titik Semak"
            breadcrumbs={[
                { label: 'Urus Titik Semak', url: route('pentadbir.titik-semak.index') },
                { label: 'Tambah Titik Semak' }
            ]}
        >
            <Head title="Tambah Titik Semak" />

            <div className="w-full space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Pendaftaran Titik Semak Baru</h2>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <form onSubmit={submit} className="space-y-6">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            {/* ID Lokasi */}
                            <div>
                                <InputLabel htmlFor="fld_loc_id" value="ID Titik Semak (Janaan Automatik)" />
                                <TextInput
                                    id="fld_loc_id"
                                    type="text"
                                    value={data.fld_loc_id}
                                    className="mt-1 block w-full bg-gray-200 text-gray-500 cursor-not-allowed font-bold"
                                    readOnly
                                />
                                <InputError message={errors.fld_loc_id} className="mt-2" />
                            </div>

                            {/* Nama Lokasi */}
                            <div>
                                <InputLabel htmlFor="fld_loc_nama" value="Nama Lokasi" />
                                <TextInput
                                    id="fld_loc_nama"
                                    type="text"
                                    value={data.fld_loc_nama}
                                    className="mt-1 block w-full bg-gray-50"
                                    onChange={(e) => setData('fld_loc_nama', e.target.value)}
                                    placeholder="Contoh: Pintu Pagar Utama"
                                    required
                                />
                                <InputError message={errors.fld_loc_nama} className="mt-2" />
                            </div>

                            {/* Latitud (Readonly, diisi oleh peta) */}
                            <div>
                                <InputLabel htmlFor="fld_loc_latitud" value="Latitud" />
                                <TextInput
                                    id="fld_loc_latitud"
                                    type="text"
                                    value={data.fld_loc_latitud}
                                    className="mt-1 block w-full bg-gray-100 text-gray-600 cursor-not-allowed"
                                    placeholder="Pilih dari peta di bawah"
                                    readOnly
                                />
                                <InputError message={errors.fld_loc_latitud} className="mt-2" />
                            </div>

                            {/* Longitud (Readonly, diisi oleh peta) */}
                            <div>
                                <InputLabel htmlFor="fld_loc_longitud" value="Longitud" />
                                <TextInput
                                    id="fld_loc_longitud"
                                    type="text"
                                    value={data.fld_loc_longitud}
                                    className="mt-1 block w-full bg-gray-100 text-gray-600 cursor-not-allowed"
                                    placeholder="Pilih dari peta di bawah"
                                    readOnly
                                />
                                <InputError message={errors.fld_loc_longitud} className="mt-2" />
                            </div>

                            {/* Status */}
                            <div>
                                <InputLabel htmlFor="fld_loc_status" value="Status" />
                                <select
                                    id="fld_loc_status"
                                    value={data.fld_loc_status}
                                    className="mt-1 block w-full pl-4 pr-10 py-2.5 text-sm border-gray-100 rounded-xl bg-gray-50 focus:ring-blue-500 focus:border-blue-500 font-semibold text-gray-700"
                                    onChange={(e) => setData('fld_loc_status', e.target.value)}
                                    required
                                >
                                    <option value="aktif">Aktif</option>
                                    <option value="tidak_aktif">Tidak Aktif</option>
                                </select>
                                <InputError message={errors.fld_loc_status} className="mt-2" />
                            </div>
                        </div>

                        {/* Bahagian Peta */}
                        <div className="mt-8">
                            <InputLabel value="Pilih Lokasi pada Peta (Klik untuk letak pin)" className="mb-2 text-blue-600 font-bold" />
                            <div className="h-[400px] w-full rounded-2xl overflow-hidden border-2 border-gray-200 z-0 relative">
                                <MapContainer center={defaultCenter} zoom={6} scrollWheelZoom={true} className="h-full w-full z-0">
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <LocationMarker position={mapPosition} setPosition={setMapPosition} setData={setData} />
                                </MapContainer>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">* Zoom dan klik pada peta untuk mendapatkan koordinat Latitud dan Longitud secara automatik.</p>
                        </div>

                        {/* Butang Tindakan */}
                        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                            <Link
                                href={route('pentadbir.titik-semak.index')}
                                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Batal
                            </Link>
                            <PrimaryButton disabled={processing} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700">
                                {processing ? 'Menyimpan...' : 'Simpan Titik Semak'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </PentadbirLayout>
    );
}