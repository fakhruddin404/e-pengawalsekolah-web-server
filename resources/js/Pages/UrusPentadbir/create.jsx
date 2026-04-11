import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Create({ auth, nextId }) {
    const [showPassword, setShowPassword] = useState(false);
    const [preview, setPreview] = useState(null);

    // Initial form state
    const { data, setData, post, processing, errors, reset, transform } = useForm({
        name: '',
        email: '',
        password: 'password', // Default password
        fld_ps_noIC: '',
        fld_ps_noTelefon: '',
        temp_noTelefon_full: '',
        fld_ps_id: nextId,
        fld_ps_jabatan: '',
        fld_ps_status: 'aktif',
        fld_ps_urlGambarWajah: null,
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('fld_ps_urlGambarWajah', file);
            setPreview(URL.createObjectURL(file));
        } else {
            setData('fld_ps_urlGambarWajah', null);
            setPreview(null);
        }
    };

    const submit = (e) => {
        e.preventDefault();

        transform((data) => {
            let nomborDitaip = data.temp_noTelefon_full;

            if (nomborDitaip.startsWith('0')) {
                nomborDitaip = nomborDitaip.substring(1);
            }

            return {
                ...data,
                fld_ps_noTelefon: '+60' + nomborDitaip,
            };
        });

        post(route('admin.pentadbir.store'), {
            forceFormData: true,
            onFinish: () => reset('password'),
        });
    };

    return (
        <AdminLayout
            user={auth.user}
            activeMenu="Urus Pentadbir"
            breadcrumbs={[
                { label: 'Urus Pentadbir', url: route('admin.pentadbir.index') },
                { label: 'Tambah Pentadbir' }
            ]}
        >
            <Head title="Pendaftaran Pentadbir" />

            <div className="w-full space-y-6">

                <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-gray-900">Pendaftaran Akaun Pentadbir Baru</h2>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-6 text-gray-900 border-b border-gray-100 pb-4">Maklumat Pentadbir Sekolah</h3>

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                            {/* ID Pentadbir */}
                            <div>
                                <InputLabel htmlFor="fld_ps_id" value="ID (Janaan Automatik)" />
                                <TextInput
                                    id="fld_ps_id"
                                    type="text"
                                    name="fld_ps_id"
                                    value={data.fld_ps_id}
                                    className="mt-1 block w-full bg-gray-200 text-gray-500 border-gray-200 cursor-not-allowed font-bold"
                                    readOnly
                                />
                                <InputError message={errors.fld_ps_id} className="mt-2" />
                            </div>

                            {/* Nama Penuh */}
                            <div>
                                <InputLabel htmlFor="name" value="Nama Penuh" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full bg-gray-50 border-gray-100"
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Masukkan nama penuh"
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            {/* Emel */}
                            <div>
                                <InputLabel htmlFor="email" value="Emel" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full bg-gray-50 border-gray-100"
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Cth: pentadbir@sekolah.edu.my"
                                    required
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            {/* No.IC */}
                            <div>
                                <InputLabel htmlFor="fld_ps_noIC" value="No.IC" />
                                <TextInput
                                    id="fld_ps_noIC"
                                    type="text"
                                    name="fld_ps_noIC"
                                    value={data.fld_ps_noIC}
                                    className="mt-1 block w-full bg-gray-50 border-gray-100"
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
                                    maxLength="14"
                                    required
                                />
                                <InputError message={errors.fld_ps_noIC} className="mt-2" />
                            </div>

                            {/* No.Tel */}
                            <div className="relative">
                                <InputLabel htmlFor="temp_noTelefon_full" value="No.Tel" />
                                <div className="flex gap-2.5 mt-1">
                                    <div className="relative w-1/4 sm:w-1/6">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-sm font-semibold text-gray-500">+ 60</span>
                                        <TextInput
                                            disabled
                                            className="w-full bg-gray-100 border-gray-100"
                                        />
                                    </div>
                                    <TextInput
                                        id="temp_noTelefon_full"
                                        type="text"
                                        name="temp_noTelefon_full"
                                        value={data.temp_noTelefon_full}
                                        className="flex-1 bg-gray-50 border-gray-100"
                                        onChange={(e) => {
                                            setData(prevData => ({
                                                ...prevData,
                                                temp_noTelefon_full: e.target.value,
                                                fld_ps_noTelefon: '+60' + e.target.value
                                            }));
                                        }}
                                        placeholder="123456789"
                                        required
                                    />
                                </div>
                                <InputError message={errors.fld_ps_noTelefon} className="mt-2" />
                            </div>

                            {/* Jabatan */}
                            <div>
                                <InputLabel htmlFor="fld_ps_jabatan" value="Jabatan / Jawatan" />
                                <TextInput
                                    id="fld_ps_jabatan"
                                    type="text"
                                    name="fld_ps_jabatan"
                                    value={data.fld_ps_jabatan}
                                    className="mt-1 block w-full bg-gray-50 border-gray-100"
                                    onChange={(e) => setData('fld_ps_jabatan', e.target.value)}
                                    placeholder="Cth: Pengetua, PK HEM"
                                    required
                                />
                                <InputError message={errors.fld_ps_jabatan} className="mt-2" />
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <InputLabel htmlFor="password" value="Kata Laluan Sementara" />
                                <div className="relative mt-1">
                                    <TextInput
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        className="block w-full bg-gray-50 border-gray-100 pr-10"
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Kata laluan"
                                        required
                                    />
                                    <div
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600 mt-1"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            {showPassword ? (
                                                <>
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </>
                                            ) : (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            )}
                                        </svg>
                                    </div>
                                </div>
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            {/* Status */}
                            <div>
                                <InputLabel htmlFor="fld_ps_status" value="Status" />
                                <select
                                    id="fld_ps_status"
                                    name="fld_ps_status"
                                    value={data.fld_ps_status}
                                    className="mt-1 block w-full pl-4 pr-10 py-2.5 text-sm border-gray-100 rounded-xl bg-gray-50 focus:ring-blue-500 focus:border-blue-500 font-semibold text-gray-700"
                                    onChange={(e) => setData('fld_ps_status', e.target.value)}
                                    required
                                >
                                    <option value="aktif">Aktif</option>
                                    <option value="tidak_aktif">Tidak Aktif</option>
                                </select>
                                <InputError message={errors.fld_ps_status} className="mt-2" />
                            </div>

                            {/* Gambar Peribadi */}
                            <div className="space-y-2 col-span-1 md:col-span-2">
                                <InputLabel htmlFor="fld_ps_urlGambarWajah" value="Gambar Peribadi" />

                                <div className="flex items-center gap-4">
                                    {preview ? (
                                        <div className="h-24 w-24 shrink-0">
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="h-full w-full object-cover rounded-2xl border-2 border-orange-100 shadow-sm"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-24 w-24 shrink-0 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center bg-gray-50">
                                            <svg className="mx-auto h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-[10px] text-gray-400 mt-1">Tiada Gambar</span>
                                        </div>
                                    )}

                                    <div className="flex-1">
                                        <input
                                            id="fld_ps_urlGambarWajah"
                                            type="file"
                                            accept="image/png, image/jpeg, image/jpg"
                                            onChange={handleFileChange}
                                            className="block w-full text-sm text-gray-500
                                                file:mr-4 file:py-2.5 file:px-4
                                                file:rounded-xl file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-blue-50 file:text-blue-700
                                                hover:file:bg-blue-100
                                                border border-gray-100 rounded-xl bg-gray-50"
                                            required
                                        />
                                        <p className="mt-2 text-xs text-gray-400">
                                            Format: JPG, PNG. Maksimum: 2MB.
                                        </p>
                                    </div>
                                </div>
                                <InputError message={errors.fld_ps_urlGambarWajah} className="mt-2" />
                            </div>

                        </div>

                        {/* Butang Tindakan */}
                        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                            <Link
                                href={route('admin.pentadbir.index')}
                                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Batal
                            </Link>
                            <PrimaryButton disabled={processing} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700">
                                {processing ? 'Menyimpan...' : 'Simpan Data'}
                            </PrimaryButton>
                        </div>
                    </form>

                </div>
            </div>
        </AdminLayout>
    );
}
