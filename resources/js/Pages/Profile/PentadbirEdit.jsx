import PentadbirLayout from '@/Layouts/PentadbirLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { useEffect, useRef, useState } from 'react';
import BioDataShell from './Partials/BioDataShell';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateEmailForm from './Partials/UpdateEmailForm';

export default function PentadbirEdit({ mustVerifyEmail, status, pentadbirSekolah }) {
    const user = usePage().props.auth.user;
    const initialEmail = user.email ?? '';
    const fileInputRef = useRef(null);

    const [preview, setPreview] = useState(
        pentadbirSekolah?.fld_ps_urlGambarWajah
            ? `/pentadbirImej/${pentadbirSekolah.fld_ps_urlGambarWajah}`
            : null
    );

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        _method: 'patch',
        email: user.email ?? '',
        name: user.name ?? '',
        fld_ps_noIC: pentadbirSekolah?.fld_ps_noIC ?? '',
        fld_ps_noTelefon: pentadbirSekolah?.fld_ps_noTelefon ?? '',
        temp_noTelefon_full: pentadbirSekolah?.fld_ps_noTelefon
            ? pentadbirSekolah.fld_ps_noTelefon.replace('+60', '')
            : '',
        fld_ps_id: pentadbirSekolah?.fld_ps_id ?? '',
        fld_ps_jabatan: pentadbirSekolah?.fld_ps_jabatan ?? '',
        fld_ps_status: pentadbirSekolah?.fld_ps_status ?? 'aktif',
        fld_ps_urlGambarWajah: null,
    });

    useEffect(() => {
        setData('email', user.email ?? '');
    }, [user.email]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('fld_ps_urlGambarWajah', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('profile.update'), {
            forceFormData: true,
        });
    };

    const displaySrc =
        preview ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'P')}&background=0ea5e9&color=fff`;

    const avatarWithPencil = (
        <div className="relative mx-auto h-28 w-28 shrink-0">
            <img
                src={displaySrc}
                alt=""
                className="h-28 w-28 rounded-full object-cover border-4 border-white shadow-md ring-2 ring-gray-100"
            />
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow-md hover:bg-blue-700"
                aria-label="Tukar gambar profil"
            >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                </svg>
            </button>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    );

    return (
        <PentadbirLayout header="Profil">
            <Head title="Profil" />

            <div className="w-full flex flex-col min-h-0">
                <div className="w-full rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
                    <BioDataShell
                        avatar={avatarWithPencil}
                        name={user.name}
                        email={user.email}
                    >
                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <InputLabel htmlFor="fld_ps_id" value="ID pentadbir" />
                                <TextInput
                                    id="fld_ps_id"
                                    value={data.fld_ps_id}
                                    className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed"
                                    readOnly
                                />
                            </div>

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
                                <InputLabel htmlFor="fld_ps_noIC" value="No. IC" />
                                <TextInput
                                    id="fld_ps_noIC"
                                    className="mt-1 block w-full rounded-xl border-gray-200"
                                    value={data.fld_ps_noIC}
                                    onChange={(e) => {
                                        let value = e.target.value.replace(/\D/g, '');
                                        if (value.length > 6 && value.length <= 8) {
                                            value = `${value.slice(0, 6)}-${value.slice(6)}`;
                                        } else if (value.length > 8) {
                                            value = `${value.slice(0, 6)}-${value.slice(6, 8)}-${value.slice(8, 12)}`;
                                        }
                                        setData('fld_ps_noIC', value);
                                    }}
                                    placeholder="999999-99-9999"
                                    maxLength={14}
                                    required
                                />
                                <InputError className="mt-2" message={errors.fld_ps_noIC} />
                            </div>

                            <div>
                                <InputLabel htmlFor="temp_noTelefon_full" value="No. telefon" />

                                <div className="mt-1">
                                    <TextInput
                                        id="temp_noTelefon_full"
                                        type="text"
                                        className="w-full rounded-xl border-gray-200"
                                        value={data.temp_noTelefon_full ? `0${data.temp_noTelefon_full}` : ''}
                                        onChange={(e) => {
                                            let v = e.target.value.replace(/\D/g, ''); // numbers only

                                            // remove leading 0 if user types it
                                            if (v.startsWith('0')) {
                                                v = v.substring(1);
                                            }

                                            setData((prev) => ({
                                                ...prev,
                                                temp_noTelefon_full: v,
                                                fld_ps_noTelefon: v ? `+60${v}` : '',
                                            }));
                                        }}
                                        required
                                    />
                                </div>

                                <InputError className="mt-2" message={errors.fld_ps_noTelefon} />
                            </div>

                            <div>
                                <InputLabel htmlFor="fld_ps_jabatan" value="Jabatan" />
                                <select
                                    id="fld_ps_jabatan"
                                    value={data.fld_ps_jabatan || ""} // Fallback to empty string to prevent uncontrolled input warnings
                                    className="mt-1 block w-full pl-4 pr-10 py-2.5 text-sm border-gray-200 rounded-xl bg-white focus:ring-blue-500 focus:border-blue-500 font-semibold text-gray-700 shadow-sm"
                                    onChange={(e) => setData('fld_ps_jabatan', e.target.value)}
                                    required
                                >
                                    <option value="Pengetua">Pengetua</option>
                                    <option value="Penyelia">Penyelia</option>
                                </select>
                                <InputError className="mt-2" message={errors.fld_ps_jabatan} />
                            </div>

                            <InputError className="mt-2" message={errors.fld_ps_urlGambarWajah} />
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
        </PentadbirLayout>
    );
}
