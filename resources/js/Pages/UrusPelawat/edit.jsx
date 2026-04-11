import PentadbirLayout from '@/Layouts/PentadbirLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Edit({ auth, pelawat }) {
    const [preview, setPreview] = useState(
        pelawat.fld_vis_urlGambarWajah
            ? `/pelawatImej/${pelawat.fld_vis_urlGambarWajah}`
            : null
    );

    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        fld_vis_id: pelawat.fld_vis_id || '',
        fld_vis_namaPenuh: pelawat.fld_vis_namaPenuh || '',
        fld_vis_noIC: pelawat.fld_vis_noIC || '',
        fld_vis_noTelefon: pelawat.fld_vis_noTelefon || '',
        temp_noTelefon_full: pelawat.fld_vis_noTelefon
            ? pelawat.fld_vis_noTelefon.replace('+60', '')
            : '',
        fld_vis_noKenderaan: pelawat.fld_vis_noKenderaan || '',
        fld_vis_statusSenaraiHitam: pelawat.fld_vis_statusSenaraiHitam || 0,
        fld_vis_urlGambarWajah: null,
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('fld_vis_urlGambarWajah', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('pentadbir.pelawat.update', pelawat.fld_vis_id), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <PentadbirLayout
            user={auth.user}
            activeMenu="Urus Pelawat"
            breadcrumbs={[
                { label: 'Urus Pelawat', url: route('pentadbir.pelawat.index') },
                { label: 'Kemas Kini Pelawat' }
            ]}
        >
            <Head title="Kemas Kini Pelawat" />

            <div className="w-full space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Kemas Kini Akaun Pelawat</h2>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-6 text-gray-900 border-b border-gray-100 pb-4">Maklumat Pelawat</h3>

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                            {/* ID Pelawat */}
                            <div>
                                <InputLabel htmlFor="fld_vis_id" value="ID" />
                                <TextInput
                                    id="fld_vis_id"
                                    type="text"
                                    name="fld_vis_id"
                                    value={data.fld_vis_id}
                                    className="mt-1 block w-full bg-gray-200 text-gray-500 border-gray-200 cursor-not-allowed font-bold"
                                    readOnly
                                />
                                <InputError message={errors.fld_vis_id} className="mt-2" />
                            </div>

                            {/* Nama Penuh */}
                            <div>
                                <InputLabel htmlFor="fld_vis_namaPenuh" value="Nama Penuh" />
                                <TextInput
                                    id="fld_vis_namaPenuh"
                                    type="text"
                                    name="fld_vis_namaPenuh"
                                    value={data.fld_vis_namaPenuh}
                                    className="mt-1 block w-full bg-gray-200 text-gray-500 border-gray-200 cursor-not-allowed font-bold"
                                    readOnly
                                />
                                <InputError message={errors.fld_vis_namaPenuh} className="mt-2" />
                            </div>

                            {/* No.IC */}
                            <div>
                                <InputLabel htmlFor="fld_vis_noIC" value="No.IC" />
                                <TextInput
                                    id="fld_vis_noIC"
                                    type="text"
                                    name="fld_vis_noIC"
                                    value={data.fld_vis_noIC}
                                    className="mt-1 block w-full bg-gray-200 text-gray-500 border-gray-200 cursor-not-allowed font-bold"
                                    readOnly
                                />
                                <InputError message={errors.fld_vis_noIC} className="mt-2" />
                            </div>

                            {/* No.Tel Section */}
                            <div className="relative">
                                <InputLabel htmlFor="temp_noTelefon_full" value="No.Tel" />
                                <div className="flex gap-2.5 mt-1">

                                    {/* Country Code Box */}
                                    <div className="relative w-1/4 sm:w-1/6">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-sm font-bold text-gray-500">
                                            + 60
                                        </span>
                                        <TextInput disabled className="w-full bg-gray-200 border-gray-200" />
                                    </div>

                                    {/* Phone Number Box */}
                                    <TextInput
                                        id="temp_noTelefon_full"
                                        type="text"
                                        value={data.temp_noTelefon_full}
                                        className="block w-full bg-gray-200 text-gray-500 border-gray-200 cursor-not-allowed font-bold"
                                        readOnly
                                    />

                                </div>
                                <InputError message={errors.fld_vis_noTelefon} className="mt-2" />
                            </div>

                            {/* No.Kenderaan */}
                            <div>
                                <InputLabel htmlFor="fld_vis_noKenderaan" value="No. Kenderaan" />
                                <TextInput
                                    id="fld_vis_noKenderaan"
                                    type="text"
                                    name="fld_vis_noKenderaan"
                                    value={data.fld_vis_noKenderaan}
                                    className="mt-1 block w-full bg-gray-200 text-gray-500 border-gray-200 cursor-not-allowed font-bold"
                                    readOnly
                                />
                                <InputError message={errors.fld_vis_noKenderaan} className="mt-2" />
                            </div>

                            {/* Status Senarai Hitam */}
                            <div>
                                <InputLabel htmlFor="fld_vis_statusSenaraiHitam" value="Status" />
                                <select
                                    id="fld_vis_statusSenaraiHitam"
                                    name="fld_vis_statusSenaraiHitam"
                                    value={data.fld_vis_statusSenaraiHitam}
                                    onChange={(e) => setData('fld_vis_statusSenaraiHitam', e.target.value)}
                                    className="mt-1 block w-full pl-3 pr-8 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value={0}>Dibenarkan</option>
                                    <option value={1}>Senarai Hitam</option>
                                </select>
                                <InputError message={errors.fld_vis_statusSenaraiHitam} className="mt-2" />
                            </div>

                            {/* Gambar Peribadi Section */}
                            <div className="space-y-2 lg:col-span-2">
                                <InputLabel htmlFor="fld_vis_urlGambarWajah" value="Gambar Peribadi" />

                                {preview && (
                                    <div className="mb-3">
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="h-24 w-24 object-cover rounded-2xl border-2 border-orange-100 shadow-sm"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                            <Link
                                href={route('pentadbir.pelawat.index')}
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
