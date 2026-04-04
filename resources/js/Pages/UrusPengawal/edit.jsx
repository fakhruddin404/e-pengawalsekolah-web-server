import PentadbirLayout from '@/Layouts/PentadbirLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Edit({ auth, pengawal }) {
    const [preview, setPreview] = useState(
        pengawal.pengawal?.fld_pgw_urlGambarWajah
            ? `/pengawalImej/${pengawal.pengawal.fld_pgw_urlGambarWajah}`
            : null
    );

    const { data, setData, post, processing, errors, transform } = useForm({
        _method: 'put',
        name: pengawal.name || '',
        email: pengawal.email || '',
        fld_pgw_noIC: pengawal.pengawal?.fld_pgw_noIC || '',
        fld_pgw_noTelefon: pengawal.pengawal?.fld_pgw_noTelefon || '',
        temp_noTelefon_full: pengawal.pengawal?.fld_pgw_noTelefon
            ? pengawal.pengawal.fld_pgw_noTelefon.replace('+60', '')
            : '',
        fld_pgw_id: pengawal.pengawal?.fld_pgw_id || '',
        fld_pgw_status: pengawal.pengawal?.fld_pgw_status || 'aktif',
        fld_pgw_urlGambarWajah: null,
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('fld_pgw_urlGambarWajah', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('pentadbir.pengawal.update', pengawal.id), {
            forceFormData: true,
            onSuccess: () => {
            }
        });
    };

    return (
        <PentadbirLayout
            user={auth.user}
            activeMenu="Urus Pengawal"
            breadcrumbs={[
                { label: 'Urus Pengawal', url: route('pentadbir.pengawal.index') },
                { label: 'Kemas Kini Pengawal' }
            ]}
        >
            <Head title="Kemas Kini Pengawal" />

            <div className="w-full space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Kemas Kini Akaun Pengawal</h2>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-6 text-gray-900 border-b border-gray-100 pb-4">Maklumat Pengawal Keselamatan</h3>

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                            {/* ID Pengawal */}
                            <div>
                                <InputLabel htmlFor="fld_pgw_id" value="ID" />
                                <TextInput
                                    id="fld_pgw_id"
                                    type="text"
                                    name="fld_pgw_id"
                                    value={data.fld_pgw_id}
                                    className="mt-1 block w-full bg-gray-200 text-gray-500 border-gray-200 cursor-not-allowed font-bold"
                                    readOnly
                                />
                                <InputError message={errors.fld_pgw_id} className="mt-2" />
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
                                    placeholder="Masukkan nama penuh seperti di kad pengenalan"
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
                                    placeholder="Cth: contoh.pengawal@gmail.com"
                                    required
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            {/* No.IC */}
                            <div>
                                <InputLabel htmlFor="fld_pgw_noIC" value="No.IC" />
                                <TextInput
                                    id="fld_pgw_noIC"
                                    type="text"
                                    name="fld_pgw_noIC"
                                    value={data.fld_pgw_noIC}
                                    className="mt-1 block w-full bg-gray-50 border-gray-100"
                                    onChange={(e) => {
                                        let value = e.target.value.replace(/\D/g, ''); 

                                        if (value.length > 6 && value.length <= 8) {
                                            value = `${value.slice(0, 6)}-${value.slice(6)}`;
                                        } else if (value.length > 8) {
                                            value = `${value.slice(0, 6)}-${value.slice(6, 8)}-${value.slice(8, 12)}`;
                                        }

                                        setData('fld_pgw_noIC', value);
                                    }}
                                    placeholder="999999-99-9999"
                                    maxLength="14"
                                    required
                                />
                                <InputError message={errors.fld_pgw_noIC} className="mt-2" />
                            </div>

                            {/* No.Tel Section */}
                            <div className="relative">
                                <InputLabel htmlFor="temp_noTelefon_full" value="No.Tel" />
                                <div className="flex gap-2.5 mt-1">
                                    <div className="relative w-1/4 sm:w-1/6">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-sm font-semibold text-gray-500">+ 60</span>
                                        <TextInput disabled className="w-full bg-gray-100 border-gray-100" />
                                    </div>
                                    <TextInput
                                        id="temp_noTelefon_full"
                                        type="text"
                                        value={data.temp_noTelefon_full}
                                        className="flex-1 bg-gray-50 border-gray-100"
                                        onChange={(e) => setData({
                                            ...data,
                                            temp_noTelefon_full: e.target.value,
                                            fld_pgw_noTelefon: '+60' + e.target.value
                                        })}
                                        required
                                    />
                                </div>
                                <InputError message={errors.fld_pgw_noTelefon} className="mt-2" />
                            </div>

                            {/* Gambar Peribadi Section */}
                            <div className="space-y-2">
                                <InputLabel htmlFor="fld_pgw_urlGambarWajah" value="Gambar Peribadi" />

                                {preview && (
                                    <div className="mb-3">
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="h-24 w-24 object-cover rounded-2xl border-2 border-orange-100 shadow-sm"
                                        />
                                    </div>
                                )}

                                <input
                                    id="fld_pgw_urlGambarWajah"
                                    type="file"
                                    accept="image/png, image/jpeg, image/jpg"
                                    onChange={handleFileChange}
                                    className="mt-1 block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2.5 file:px-4
                                        file:rounded-xl file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-blue-50 file:text-blue-700
                                        hover:file:bg-blue-100
                                        border border-gray-100 rounded-xl bg-gray-50"
                                />
                                <p className="mt-1 text-[10px] text-gray-400">
                                    Format: JPG, PNG. Maks: 2MB. <br />
                                    *Kosongkan jika tidak mahu menukar gambar.
                                </p>
                                <InputError message={errors.fld_pgw_urlGambarWajah} className="mt-2" />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                            <Link
                                href={route('pentadbir.pengawal.index')}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50"
                            >
                                Batal
                            </Link>
                            <PrimaryButton disabled={processing} className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600">
                                {processing ? 'Menyimpan...' : 'Kemas Kini Data'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </PentadbirLayout>
    );
}