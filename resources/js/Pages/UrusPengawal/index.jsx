import PentadbirLayout from '@/Layouts/PentadbirLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';

const getStatusBadge = (status) => {
    switch (status) {
        case 'aktif':
            return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Aktif</span>;
        case 'meronda':
            return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Meronda</span>;
        case 'nyahaktif':
            return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Nyahaktif</span>;
        case 'tidak_aktif':
            return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">Tidak aktif</span>;
        default:
            return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Tiada Status</span>;
    }
};

export default function Index({ auth, pengawals }) {
    // States untuk Carian, Tapisan (Filter), dan Susunan (Sort)
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('semua');
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' (A-Z) atau 'desc' (Z-A)

    // State untuk Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Jumlah data untuk setiap muka surat

    const deleteGuard = (user) => {
        if (confirm(`Adakah anda pasti mahu memadam pengawal bernama ${user.name}?`)) {
            router.delete(route('pentadbir.pengawal.destroy', user.id), {
                preserveScroll: true,
                onSuccess: () => alert(`Akaun untuk ${user.name} berjaya dipadam.`),
                onError: (errors) => alert(Object.values(errors).join('\n')),
            });
        }
    };

    const processedPengawals = useMemo(() => {
        let result = pengawals;

        // 1. Fungsi Carian (Search)
        if (search) {
            const lowercasedSearch = search.toLowerCase();
            result = result.filter(
                (guard) =>
                    guard.name.toLowerCase().includes(lowercasedSearch) ||
                    guard.email.toLowerCase().includes(lowercasedSearch) ||
                    guard.pengawal.fld_pgw_id.toLowerCase().includes(lowercasedSearch)
            );
        }

        // 2. Fungsi Tapisan (Filter) berdasarkan status
        if (filterStatus !== 'semua') {
            result = result.filter((guard) => guard.pengawal.fld_pgw_status === filterStatus);
        }

        // 3. Fungsi Susunan (Sort) berdasarkan nama
        result = [...result].sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.name.localeCompare(b.name);
            } else {
                return b.name.localeCompare(a.name);
            }
        });

        return result;
    }, [pengawals, search, filterStatus, sortOrder]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, filterStatus, sortOrder]);

    const totalPages = Math.ceil(processedPengawals.length / itemsPerPage);
    const paginatedPengawals = processedPengawals.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <PentadbirLayout
            user={auth.user}
            activeMenu="Urus Pengawal"
            breadcrumbs={[{ label: 'Urus Pengawal' }]}
        >
            <Head title="Urus Pengawal" />

            <div className="w-full space-y-6">
                {/* Header with Title and Add Button */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Senarai Pengawal</h2>
                        <p className="text-sm text-gray-500 mt-1">Sila uruskan maklumat pengawal keselamatan anda di sini.</p>
                    </div>
                    <Link
                        href={route('pentadbir.pengawal.create')}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition-colors shadow-sm"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path>
                        </svg>
                        Tambah Pengawal
                    </Link>
                </div>

                {/* Table and Tools Wrapper */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">

                    {/* Tools Row (Search, Filter, Sort) */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">

                        {/* 1. Kotak Carian */}
                        <div className="relative w-full sm:max-w-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama, emel, atau ID..."
                                className="block w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* 2. Menu Filter & Sort */}
                        <div className="flex gap-3 w-full sm:w-auto">
                            <div className="relative flex-1 sm:flex-none">
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="block w-full sm:w-36 pl-3 pr-8 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                                >
                                    <option value="semua">Semua Status</option>
                                    <option value="aktif">Aktif</option>
                                    <option value="tidak_aktif">Tidak Aktif</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                                    </svg>
                                </div>
                            </div>

                            <button
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {sortOrder === 'asc' ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path>
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"></path>
                                    )}
                                </svg>
                                Susun {sortOrder === 'asc' ? '(A-Z)' : '(Z-A)'}
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto rounded-xl border border-gray-100">
                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="text-xs text-gray-400 uppercase bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-5 py-4 font-medium">ID</th>
                                    <th className="px-5 py-4 font-medium">Nama</th>
                                    <th className="px-5 py-4 font-medium">Emel</th>
                                    <th className="px-5 py-4 font-medium">No.Tel</th>
                                    <th className="px-5 py-4 font-medium text-center">Status</th>
                                    <th className="px-5 py-4 font-medium text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {paginatedPengawals.length > 0 ? (
                                    paginatedPengawals.map((guard) => (
                                        <tr key={guard.id} className="hover:bg-gray-50/80 transition-colors">
                                            <td className="px-5 py-4 font-medium text-gray-800">{guard.pengawal.fld_pgw_id}</td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-full overflow-hidden bg-gray-200 shrink-0 ring-2 ring-white shadow-sm">
                                                        <img
                                                            src={guard.pengawal.fld_pgw_urlGambarWajah
                                                                ? `/pengawalImej/${guard.pengawal.fld_pgw_urlGambarWajah}`
                                                                : `https://ui-avatars.com/api/?name=${guard.name}&background=1e293b&color=fff`}
                                                            alt={guard.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <span className="font-semibold text-gray-800">{guard.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">{guard.email}</td>
                                            <td className="px-5 py-4">{guard.pengawal.fld_pgw_noTelefon}</td>
                                            <td className="px-5 py-4 text-center">
                                                {getStatusBadge(guard.pengawal.fld_pgw_status)}
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link
                                                        href={route('pentadbir.pengawal.edit', guard.id)}
                                                        title="Kemas kini maklumat"
                                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-all shadow-sm"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                                    </Link>
                                                    <button
                                                        onClick={() => deleteGuard(guard)}
                                                        title="Padam akaun"
                                                        className="p-1.5 text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all"
                                                    >
                                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-12 text-gray-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                                <span className="font-medium text-base">Tiada data pengawal ditemui.</span>
                                                <span className="text-sm mt-1">Sila cuba carian atau tapisan yang berbeza.</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center mt-8 gap-2">
                            {/* Nombor Muka Surat */}
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`min-w-[60px] px-4 py-1.5 text-sm font-medium rounded-full transition-colors border ${currentPage === i + 1
                                        ? 'bg-gray-300 border-gray-300 text-gray-800 shadow-inner' // Reka bentuk apabila aktif
                                        : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            {/* Butang Sebelumnya (<) */}
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="min-w-[60px] px-4 py-1.5 flex justify-center items-center text-sm font-medium text-gray-600 bg-gray-100 border border-gray-200 rounded-full hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                            </button>

                            {/* Butang Seterusnya (>) */}
                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="min-w-[60px] px-4 py-1.5 flex justify-center items-center text-sm font-medium text-gray-600 bg-gray-100 border border-gray-200 rounded-full hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </PentadbirLayout>
    );
}