import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import BioDataShell from './Partials/BioDataShell';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateEmailForm from './Partials/UpdateEmailForm';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
});

function AdminLocationMarker({ position, setPosition, setData }) {
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
            setData((data) => ({
                ...data,
                fld_adm_latitud: Number(e.latlng.lat).toFixed(7),
                fld_adm_longitud: Number(e.latlng.lng).toFixed(7),
            }));
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return position === null ? null : <Marker position={position} />;
}

const DEFAULT_CENTER = [4.2105, 101.9758];

export default function AdminEdit({ mustVerifyEmail, status, admin }) {
    const user = usePage().props.auth.user;
    const initialEmail = user.email ?? '';

    const initialLat = admin?.fld_adm_latitud != null ? parseFloat(admin.fld_adm_latitud) : null;
    const initialLng = admin?.fld_adm_longitud != null ? parseFloat(admin.fld_adm_longitud) : null;
    const hasInitialCoords =
        initialLat != null &&
        initialLng != null &&
        !Number.isNaN(initialLat) &&
        !Number.isNaN(initialLng);

    const [mapPosition, setMapPosition] = useState(
        hasInitialCoords ? L.latLng(initialLat, initialLng) : null
    );

    const mapCenter = useMemo(
        () => (hasInitialCoords ? [initialLat, initialLng] : DEFAULT_CENTER),
        [hasInitialCoords, initialLat, initialLng]
    );

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name ?? '',
        fld_adm_namaSekolah: admin?.fld_adm_namaSekolah ?? '',
        fld_adm_latitud: admin?.fld_adm_latitud != null ? String(admin.fld_adm_latitud) : '',
        fld_adm_longitud: admin?.fld_adm_longitud != null ? String(admin.fld_adm_longitud) : '',
    });

    useEffect(() => {
        setData('email', user.email ?? '');
    }, [user.email]);

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <AdminLayout header="Profil">
            <Head title="Profil" />

            <div className="w-full flex flex-col min-h-0">
                <div className="w-full rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
                    <BioDataShell
                        title="Biodata"
                        backHref={route('admin.pentadbir.index')}
                        showAvatar={false}
                        name={user.name}
                        email={user.email}
                    >
                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <InputLabel htmlFor="name" value="Nama penuh" />
                                <TextInput
                                    id="name"
                                    className="mt-1 block w-full rounded-xl border-gray-200"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    autoComplete="name"
                                />
                                <InputError className="mt-2" message={errors.name} />
                            </div>

                            <div>
                                <InputLabel htmlFor="fld_adm_namaSekolah" value="Nama sekolah" />
                                <TextInput
                                    id="fld_adm_namaSekolah"
                                    className="mt-1 block w-full rounded-xl border-gray-200"
                                    value={data.fld_adm_namaSekolah}
                                    onChange={(e) => setData('fld_adm_namaSekolah', e.target.value)}
                                    required
                                />
                                <InputError className="mt-2" message={errors.fld_adm_namaSekolah} />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="fld_adm_latitud" value="Latitud" />
                                    <TextInput
                                        id="fld_adm_latitud"
                                        type="text"
                                        className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50"
                                        value={data.fld_adm_latitud}
                                        readOnly
                                    />
                                    <InputError className="mt-2" message={errors.fld_adm_latitud} />
                                </div>
                                <div>
                                    <InputLabel htmlFor="fld_adm_longitud" value="Longitud" />
                                    <TextInput
                                        id="fld_adm_longitud"
                                        type="text"
                                        className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50"
                                        value={data.fld_adm_longitud}
                                        readOnly
                                    />
                                    <InputError className="mt-2" message={errors.fld_adm_longitud} />
                                </div>
                            </div>

                            <div>
                                <InputLabel
                                    value="Pilih lokasi sekolah pada peta (klik untuk tetapkan pin)"
                                    className="text-blue-600 font-medium"
                                />
                                <div className="mt-2 h-64 sm:h-80 w-full rounded-xl overflow-hidden border border-gray-200 z-0 relative">
                                    <MapContainer
                                        center={mapCenter}
                                        zoom={hasInitialCoords ? 15 : 6}
                                        scrollWheelZoom
                                        className="h-full w-full z-0"
                                    >
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        <AdminLocationMarker
                                            position={mapPosition}
                                            setPosition={setMapPosition}
                                            setData={setData}
                                        />
                                    </MapContainer>
                                </div>
                                <p className="mt-1 text-xs text-gray-500">
                                    Zoom dan klik pada peta untuk mengemas kini koordinat latitud dan longitud.
                                </p>
                            </div>

                            <InputError className="mt-2" message={errors.email} />

                            <PrimaryButton
                                className="w-full justify-center rounded-xl py-2.5 sm:w-auto"
                                disabled={processing}
                            >
                                {processing ? 'Menyimpan...' : 'Kemas Kini Profil'}
                            </PrimaryButton>
                        </form>

                        <div className="mt-8 border-t border-gray-100 pt-8">
                            <UpdateEmailForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                            />
                        </div>

                        <div className="mt-8 border-t border-gray-100 pt-8">
                            <UpdatePasswordForm embedded />
                        </div>
                    </BioDataShell>
                </div>
            </div>
        </AdminLayout>
    );
}
