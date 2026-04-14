import PentadbirLayout from '@/Layouts/PentadbirLayout'; 
import { Head } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
// Import Recharts
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

// Letakkan props dari Controller di sini
export default function DashboardPentadbir({ kpi, dataPelawat, senaraiRondaan }) {
    
    // Jika data props belum sedia (mengelakkan error semasa load)
    const stats = kpi || { laporan_baru: 0, rondaan_harian: 0, pelawat_aktif: 0, pengawal_aktif: 0 };
    const tableData = senaraiRondaan || [];
    const chartData = dataPelawat || [];

    return (
        <PentadbirLayout>
            <Head title="Papan Pemuka Interaktif" />

            <div className="w-full space-y-6">

                {/* 1. Top KPI Cards - Menggunakan data dinamik */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-[#3b82f6] text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between h-28 relative overflow-hidden">
                        <span className="text-sm font-medium z-10">Laporan Kejadian Baru</span>
                        <span className="text-3xl font-bold z-10">{stats.laporan_baru}</span>
                        <div className="absolute right-0 bottom-0 w-24 h-24 bg-white opacity-10 rounded-tl-full transform translate-x-4 translate-y-4"></div>
                    </div>
                    <div className="bg-[#374151] text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between h-28 relative overflow-hidden">
                        <span className="text-sm font-medium z-10">Rekod Rondaan Harian</span>
                        <span className="text-3xl font-bold z-10">{stats.rondaan_harian}</span>
                        <div className="absolute right-0 bottom-0 w-24 h-24 bg-white opacity-5 rounded-tl-full transform translate-x-4 translate-y-4"></div>
                    </div>
                    <div className="bg-[#60a5fa] text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between h-28 relative overflow-hidden">
                        <span className="text-sm font-medium z-10">Pelawat Aktif</span>
                        <span className="text-3xl font-bold z-10">{stats.pelawat_aktif}</span>
                        <div className="absolute right-0 bottom-0 w-24 h-24 bg-white opacity-10 rounded-tl-full transform translate-x-4 translate-y-4"></div>
                    </div>
                    <div className="bg-[#4b5563] text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between h-28 relative overflow-hidden">
                        <span className="text-sm font-medium z-10">Pengawal Aktif</span>
                        <span className="text-3xl font-bold z-10">{stats.pengawal_aktif}</span>
                        <div className="absolute right-0 bottom-0 w-24 h-24 bg-white opacity-5 rounded-tl-full transform translate-x-4 translate-y-4"></div>
                    </div>
                </div>

                {/* 2. Line Chart - Menggunakan Recharts */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-[#a855f7] font-semibold">Pelawat (Bulan Ini)</h3>
                    </div>
                    
                    <div className="h-48 w-full text-xs text-gray-400">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <XAxis dataKey="name" stroke="#cbd5e1" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line type="monotone" dataKey="jumlah" stroke="#a855f7" strokeWidth={3} dot={{ r: 4, fill: "#a855f7" }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. Bar Chart & Donut Chart Row (Boleh dikekalkan dummy buat masa ni, atau guna Recharts <BarChart> / <PieChart>) */}
                {/* ... Kod untuk Bar/Donut Chart anda kekal sama di sini ... */}

                {/* 4. Map Placeholder */}
                {/* ... Kod untuk Peta kekal sama di sini ... */}

                {/* 5. Senarai Sesi Rondaan Table - Menggunakan mapping data sebenar */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-[#0ea5e9] font-semibold mb-4">Senarai Sesi Rondaan Terkini</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="text-xs text-gray-400 uppercase bg-gray-50/50">
                                <tr>
                                    <th className="px-4 py-3 font-medium rounded-l-lg">ID Pengawal</th>
                                    <th className="px-4 py-3 font-medium">Tarikh</th>
                                    <th className="px-4 py-3 font-medium w-1/3">Kepatuhan Rondaan</th>
                                    <th className="px-4 py-3 font-medium text-center rounded-r-lg">Peta Rondaan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.length > 0 ? (
                                    tableData.map((row, i) => (
                                        <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                                            <td className="px-4 py-4 font-medium text-gray-800">{row.id_pengawal}</td>
                                            <td className="px-4 py-4">{row.tarikh}</td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                                                        {/* Lebar bar berdasarkan data sebenar */}
                                                        <div className="bg-[#6366f1] h-2.5 rounded-full" style={{ width: `${row.kepatuhan_num}%` }}></div>
                                                    </div>
                                                    <span className="text-xs font-semibold text-gray-600 w-8">{row.kepatuhan}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex justify-center">
                                                    <button 
                                                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                                        onClick={() => alert(`Buka peta untuk ID: ${row.id_pengawal}`)}
                                                    >
                                                        <ApplicationLogo type={3} className="w-4 h-4 opacity-80" />
                                                        Lihat Peta
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-6 text-gray-400">Tiada rekod rondaan dijumpai.</td>
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