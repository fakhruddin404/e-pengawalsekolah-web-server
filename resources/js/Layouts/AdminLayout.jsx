import { usePage, Link } from '@inertiajs/react';
import Aside from '@/Components/Aside';
import Footer from '@/Components/Footer';

export default function AdminLayout({ header, breadcrumbs, children }) {
    const defaultUser = { name: 'Admin', email: 'admin@example.com' };
    const user = usePage().props.auth?.user || defaultUser;

    // Specific links for System Admin
    const adminNavItems = [
        {
            name: 'Urus Pentadbir Sekolah',
            route: 'admin.pentadbir.index',
            icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
            active: route().current('admin.pentadbir.index') || route().current('admin.pentadbir.*')
        },
    ];

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#f0f4f8] text-gray-800 font-sans">
            <Aside user={user} navItems={adminNavItems} />

            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-16 items-center px-8 bg-white border-b border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
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
                            <span className="text-gray-600 font-medium capitalize">Urus Pentadbir Sekolah</span>
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