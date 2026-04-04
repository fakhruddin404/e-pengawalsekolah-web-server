import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AdminLayout
            breadcrumbs={[
                { label: 'Urus Pentadbir' }
            ]}
        >
            <Head title="Urus Pentadbir Sekolah" />

            <div className="pt-2 pb-8 w-full mx-auto text-gray-900 font-sans">
                <h1 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">Senarai Pentadbir Sekolah</h1>

                {/* Search and Action Bar */}
                <div className="flex items-center justify-between bg-white px-2 py-2 rounded-full mb-6 shadow-sm border border-gray-100">
                    <div className="flex items-center text-gray-400 w-1/2 pl-4">
                        <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        <input type="text" placeholder="Search" className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium text-gray-700 outline-none" />
                    </div>

                    <div className="flex items-center gap-2 pr-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors mr-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                        </button>
                        <button className="flex items-center gap-2 bg-gray-100 text-gray-400 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                            Tambah Pentadbir
                        </button>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-transparent overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="text-[11px] text-gray-400 uppercase bg-transparent border-b border-gray-200/60 font-semibold tracking-wider">
                            <tr>
                                <th scope="col" className="px-5 py-4 w-24">ID</th>
                                <th scope="col" className="px-5 py-4">nama</th>
                                <th scope="col" className="px-5 py-4">Emel</th>
                                <th scope="col" className="px-5 py-4 w-40">No.Tel</th>
                                <th scope="col" className="px-5 py-4">Jabatan</th>
                                <th scope="col" className="px-5 py-4 w-32">Status</th>
                                <th scope="col" className="px-5 py-4 w-32 sr-only">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100/60">
                            {[
                                { id: 'M001', name: 'Natali Craig', email: 'sample@gmail.com', phone: '013-4567899', dept: 'Pengetua', status: 'Aktif', activeClass: 'bg-[#e0f0ff] text-[#3b82f6]' },
                                { id: 'M002', name: 'Kate Morrison', email: 'sample@gmail.com', phone: '013-4567899', dept: 'Penyelia Pengawal', status: 'Tidak aktif', activeClass: 'bg-[#f3e8ff] text-[#a855f7]' },
                                { id: 'M003', name: 'Drew Cano', email: 'sample@gmail.com', phone: '013-4567899', dept: 'Penyelia Pengawal', status: 'Aktif', activeClass: 'bg-[#e0f0ff] text-[#3b82f6]' },
                                { id: 'M004', name: 'Orlando Diggs', email: 'sample@gmail.com', phone: '013-4567899', dept: 'Penyelia Pengawal', status: 'Nyahaktif', activeClass: 'bg-[#f1f5f9] text-[#94a3b8]' },
                                { id: 'M005', name: 'Andi Lane', email: 'sample@gmail.com', phone: '013-4567899', dept: 'Penyelia Pengawal', status: 'Nyahaktif', activeClass: 'bg-[#f1f5f9] text-[#94a3b8]' },
                                { id: 'M006', name: 'Natali Craig', email: 'sample@gmail.com', phone: '013-4567899', dept: 'Pengetua', status: 'Nyahaktif', activeClass: 'bg-[#f1f5f9] text-[#94a3b8]' },
                            ].map((row, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-5 py-4 font-semibold text-gray-800">{row.id}</td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-gray-200 overflow-hidden">
                                                <img src={`https://ui-avatars.com/api/?name=${row.name.replace(' ', '+')}&background=random&color=fff`} alt={row.name} className="h-full w-full object-cover" />
                                            </div>
                                            <span className="font-semibold text-gray-800">{row.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 font-medium">{row.email}</td>
                                    <td className="px-5 py-4 font-medium">{row.phone}</td>
                                    <td className="px-5 py-4 font-medium">{row.dept}</td>
                                    <td className="px-5 py-4">
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${row.activeClass}`}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 flex justify-end">
                                        <button className="flex items-center gap-2 bg-[#ff9800] hover:bg-[#f57c00] text-white px-5 py-2 rounded-full text-sm font-semibold transition-colors shadow-sm opacity-90 group-hover:opacity-100">
                                            Kemas kini
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </AdminLayout>
    );
}
