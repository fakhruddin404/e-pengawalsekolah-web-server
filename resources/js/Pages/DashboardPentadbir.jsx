import PentadbirLayout from '@/Layouts/PentadbirLayout'; // Adjust path if needed
import { Head } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo'; // Pastikan import ini ditambah!

export default function DashboardPentadbir() {
    return (
        <PentadbirLayout>
            <Head title="Papan Pemuka Interaktif" />

            <div className="w-full space-y-6">

                {/* 1. Top KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Blue Card */}
                    <div className="bg-[#3b82f6] text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between h-28 relative overflow-hidden">
                        <span className="text-sm font-medium z-10">Laporan Kejadian Terbaru</span>
                        <span className="text-3xl font-bold z-10">4</span>
                        {/* Decorative background shape */}
                        <div className="absolute right-0 bottom-0 w-24 h-24 bg-white opacity-10 rounded-tl-full transform translate-x-4 translate-y-4"></div>
                    </div>
                    {/* Dark Card */}
                    <div className="bg-[#374151] text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between h-28 relative overflow-hidden">
                        <span className="text-sm font-medium z-10">Rekod Rondaan Harian</span>
                        <span className="text-3xl font-bold z-10">2</span>
                        <div className="absolute right-0 bottom-0 w-24 h-24 bg-white opacity-5 rounded-tl-full transform translate-x-4 translate-y-4"></div>
                    </div>
                    {/* Blue Card */}
                    <div className="bg-[#60a5fa] text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between h-28 relative overflow-hidden">
                        <span className="text-sm font-medium z-10">Pelawat Aktif</span>
                        <span className="text-3xl font-bold z-10">6</span>
                        <div className="absolute right-0 bottom-0 w-24 h-24 bg-white opacity-10 rounded-tl-full transform translate-x-4 translate-y-4"></div>
                    </div>
                    {/* Dark Card */}
                    <div className="bg-[#4b5563] text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between h-28 relative overflow-hidden">
                        <span className="text-sm font-medium z-10">Pengawal Aktif</span>
                        <span className="text-3xl font-bold z-10">2</span>
                        <div className="absolute right-0 bottom-0 w-24 h-24 bg-white opacity-5 rounded-tl-full transform translate-x-4 translate-y-4"></div>
                    </div>
                </div>

                {/* 2. Line Chart Section Placeholder */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-[#a855f7] font-semibold">Pelawat</h3>
                        <div className="flex gap-2">
                            <select className="text-xs border-gray-200 rounded-lg text-gray-500 py-1.5 pl-3 pr-8 focus:ring-purple-500">
                                <option>Week</option>
                            </select>
                            <button className="border border-gray-200 rounded-lg p-1.5 text-gray-400 hover:bg-gray-50">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                            </button>
                        </div>
                    </div>
                    {/* Visual Placeholder for Line Chart */}
                    <div className="h-48 flex items-end justify-between gap-2 text-xs text-gray-400 relative">
                        {/* Fake chart line SVG */}
                        <svg className="absolute w-full h-full pb-6" preserveAspectRatio="none" viewBox="0 0 100 100">
                            <path d="M0,60 L15,40 L30,80 L45,30 L60,50 L75,10 L90,30 L100,20" fill="none" stroke="#d8b4fe" strokeWidth="1.5" />
                            <circle cx="15" cy="40" r="1.5" fill="#a855f7" />
                            <circle cx="45" cy="30" r="1.5" fill="#a855f7" />
                            <circle cx="75" cy="10" r="1.5" fill="#a855f7" />
                        </svg>
                        <span className="flex-1 text-center mt-auto pt-2">Jan</span>
                        <span className="flex-1 text-center mt-auto pt-2">Feb</span>
                        <span className="flex-1 text-center mt-auto pt-2">Mar</span>
                        <span className="flex-1 text-center mt-auto pt-2">Apr</span>
                        <span className="flex-1 text-center mt-auto pt-2">May</span>
                        <span className="flex-1 text-center mt-auto pt-2">Jun</span>
                    </div>
                </div>

                {/* 3. Bar Chart & Donut Chart Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Bar Chart Placeholder */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-blue-500 font-semibold mb-6">Pematuhan Rondaan</h3>
                        <div className="h-40 flex items-end justify-around text-xs text-gray-400">
                            <div className="flex flex-col items-center gap-2"><div className="w-10 bg-[#a78bfa] rounded-t-md h-12"></div>Aiman</div>
                            <div className="flex flex-col items-center gap-2"><div className="w-10 bg-[#4c1d95] rounded-t-md h-24"></div>Wafi</div>
                            <div className="flex flex-col items-center gap-2"><div className="w-10 bg-[#7c3aed] rounded-t-md h-16"></div>Ahmad</div>
                            <div className="flex flex-col items-center gap-2"><div className="w-10 bg-[#2e1065] rounded-t-md h-32"></div>Din</div>
                            <div className="flex flex-col items-center gap-2"><div className="w-10 bg-[#5b21b6] rounded-t-md h-20"></div>Afiq</div>
                            <div className="flex flex-col items-center gap-2"><div className="w-10 bg-[#c4b5fd] rounded-t-md h-8"></div>Hazim</div>
                        </div>
                    </div>

                    {/* Donut Chart Placeholder */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-blue-500 font-semibold mb-6">Pematuhan Rondaan</h3>
                        <div className="flex items-center justify-center h-40 gap-10">
                            {/* Fake Donut SVG */}
                            <div className="relative w-32 h-32">
                                <svg viewBox="0 0 36 36" className="w-full h-full">
                                    <path className="text-[#3b82f6]" stroke="currentColor" strokeWidth="4" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" />
                                    <path className="text-[#10b981]" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="30, 100" d="M18 33.9155 a 15.9155 15.9155 0 0 1 -15.9155 -15.9155" />
                                </svg>
                            </div>
                            <div className="space-y-2 text-xs text-gray-500">
                                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span> Zon A (50%)</div>
                                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#10b981]"></span> Zon B (30%)</div>
                                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gray-200"></span> Zon C (20%)</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Map Placeholder */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-[#0ea5e9] font-semibold mb-4">Peta</h3>
                    <div className="w-full h-64 bg-gray-100 rounded-2xl relative overflow-hidden flex items-center justify-center border border-gray-200">
                        {/* Fake map elements */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <div className="absolute top-1/2 left-1/3 w-6 h-6 text-blue-500">
                            <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm0-4a2 2 0 110-4 2 2 0 010 4z" clipRule="evenodd"></path></svg>
                        </div>
                        <div className="absolute bottom-1/3 right-1/3 w-6 h-6 text-blue-500">
                            <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm0-4a2 2 0 110-4 2 2 0 010 4z" clipRule="evenodd"></path></svg>
                        </div>
                        <span className="text-gray-400 font-medium z-10">Peta Interaktif Sekolah</span>
                    </div>
                </div>

                {/* 5. Senarai Sesi Rondaan Table */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-[#0ea5e9] font-semibold mb-4">Senarai Sesi Rondaan</h3>
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
                                {[
                                    { id: 'P001', date: 'Jun 24, 2024', prog: '51%' },
                                    { id: 'P002', date: 'Mar 10, 2024', prog: '51%' },
                                    { id: 'P003', date: 'Nov 12, 2024', prog: '100%' },
                                ].map((row, i) => (
                                    <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                                        <td className="px-4 py-4 font-medium text-gray-800">{row.id}</td>
                                        
                                        <td className="px-4 py-4">{row.date}</td>
                                        
                                        {/* Kepatuhan Rondaan (Progress Bar dikembalikan) */}
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-full bg-gray-100 rounded-full h-2.5">
                                                    <div className="bg-[#6366f1] h-2.5 rounded-full" style={{ width: row.prog }}></div>
                                                </div>
                                                <span className="text-xs font-semibold text-gray-600 w-8">{row.prog}</span>
                                            </div>
                                        </td>
                                        
                                        {/* Peta Rondaan (Butang Peta) */}
                                        <td className="px-4 py-4">
                                            <div className="flex justify-center">
                                                <button 
                                                    title="Klik untuk lihat peta"
                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors shadow-sm"
                                                    onClick={() => alert(`Buka peta untuk ID: ${row.id}`)}
                                                >
                                                    <ApplicationLogo type={3} className="w-4 h-4 opacity-80" />
                                                    Lihat Peta
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </PentadbirLayout>
    );
}