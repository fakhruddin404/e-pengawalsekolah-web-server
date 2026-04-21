import { usePage, Link } from '@inertiajs/react';
import { useState } from 'react';
import Aside from '@/Components/Aside';
import Footer from '@/Components/Footer';

function MenuIcon() {
    return (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    );
}

export default function PentadbirLayout({ header, breadcrumbs, children }) {
    const defaultUser = { name: 'Amirul', email: 'amirul@example.com' };
    const user = usePage().props.auth?.user || defaultUser;
    const [asideOpen, setAsideOpen] = useState(true);

    // Specific links for Pentadbir
    const pentadbirNavItems = [
        { name: 'Papan Pemuka', route: 'pentadbir.dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', active: route().current('pentadbir.dashboard') },
        { name: 'Urus Pengawal', route: 'pentadbir.pengawal.index', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', active: route().current('pentadbir.pengawal.*') },
        { name: 'Urus Pelawat', route: 'pentadbir.pelawat.index', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', active: route().current('pentadbir.pelawat.*') }, 
        { name: 'Urus Titik Semak', route: 'pentadbir.titik-semak.index', icon: 'M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z', active: route().current('pentadbir.titik-semak.*') },
        { name: 'Urus Laporan Kejadian', route: 'pentadbir.laporan-kejadian.index', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', active: route().current('pentadbir.laporan-kejadian.*') },
    ];

    return (
        <div className="relative flex h-screen w-full overflow-hidden bg-[#f0f4f8] text-gray-800 font-sans">
            {asideOpen && (
                <button
                    type="button"
                    className="fixed inset-0 z-30 bg-gray-900/40 lg:hidden"
                    onClick={() => setAsideOpen(false)}
                    aria-label="Tutup menu navigasi"
                />
            )}

            <Aside user={user} navItems={pentadbirNavItems} open={asideOpen} onClose={() => setAsideOpen(false)} />

            <div className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
                <header className="flex h-16 shrink-0 items-center gap-3 border-b border-gray-100 bg-white px-4 sm:px-8">
                    <button
                        type="button"
                        onClick={() => setAsideOpen((prev) => !prev)}
                        className="shrink-0 rounded-lg border border-gray-200 bg-gray-50 p-2 text-gray-700 shadow-sm hover:bg-gray-100 hover:text-gray-900"
                        aria-expanded={asideOpen}
                        aria-controls="app-sidebar-nav"
                        aria-label={asideOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
                    >
                        <MenuIcon />
                    </button>
                    <div className="flex min-w-0 flex-1 items-center gap-2 text-sm font-medium text-gray-400">
                        {header ? (
                            <span className="text-gray-600 font-medium capitalize">{header}</span>
                        ) : breadcrumbs ? (
                            <div className="flex items-center gap-2">
                                {breadcrumbs.map((crumb, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        {index === 0 && crumb.url && (
                                            <Link href={crumb.url} className="text-gray-400 hover:text-gray-600 mr-1 flex items-center">
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
                                            </Link>
                                        )}
                                        {crumb.url ? (
                                            <Link href={crumb.url} className="hover:text-gray-900 transition-colors capitalize">
                                                {crumb.label}
                                            </Link>
                                        ) : (
                                            <span className="text-gray-900 capitalize">{crumb.label}</span>
                                        )}
                                        {index < breadcrumbs.length - 1 && (
                                            <span className="text-gray-300">/</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <span className="text-gray-600 font-medium capitalize">Papan Pemuka</span>
                        )}
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto w-full p-6 sm:p-8">
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
}