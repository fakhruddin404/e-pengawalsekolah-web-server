import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import SidebarItem from './SidebarItem';
import { useEffect, useState } from 'react';

export default function Aside({ user, navItems, open = true, onClose }) {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const closeDrawer = () => onClose?.();

    const closeDrawerAfterNav = () => {
        if (typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches) {
            onClose?.();
        }
    };

    useEffect(() => {
        if (!open) {
            setIsProfileMenuOpen(false);
        }
    }, [open]);

    return (
        <aside
            id="app-sidebar-nav"
            className={[
                'relative flex shrink-0 flex-col overflow-hidden border-r border-gray-100 bg-white shadow-sm transition-[width] duration-200 ease-out',
                open ? 'w-64 border-gray-100' : 'w-0 border-transparent shadow-none pointer-events-none',
            ].join(' ')}
        >
            <div className="flex h-full min-h-0 w-64 flex-col justify-between overflow-y-auto">
            <div>
                <div className="relative flex items-center gap-3 p-6 pt-4 lg:pt-6">
                    {onClose && (
                        <button
                            type="button"
                            onClick={closeDrawer}
                            className="absolute right-2 top-2 rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800 lg:hidden"
                            aria-label="Tutup menu"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                    <Link href="/" onClick={closeDrawerAfterNav} className="pr-8">
                        <ApplicationLogo type={1} className="w-48 h-auto" />
                    </Link>
                </div>

                <nav className="mt-4 space-y-1 px-3">
                    {navItems.map((item, index) => (
                        <SidebarItem
                            key={index}
                            href={item.route === '#' ? '#' : route(item.route)}
                            active={item.active}
                            icon={item.icon}
                            onNavigate={closeDrawerAfterNav}
                        >
                            {item.name}
                        </SidebarItem>
                    ))}
                </nav>
            </div>

            <div className="p-4 mb-2 relative">
                {/* 1. The Pop-UP Menu (Renders above the button) */}
                {isProfileMenuOpen && (
                    <div className="absolute bottom-full left-4 right-4 mb-2 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50 overflow-hidden">
                        <Link
                            href={route('profile.edit')}
                            onClick={closeDrawerAfterNav}
                            className="block w-full px-4 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            Profil
                        </Link>

                        {/* Divider line */}
                        <div className="h-px bg-gray-100 w-full"></div>

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            onClick={closeDrawerAfterNav}
                            className="block w-full px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                        >
                            Log Keluar
                        </Link>
                    </div>
                )}

                {/* 2. The Trigger Button */}
                <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex w-full items-center justify-between rounded-xl px-4 py-3 bg-gray-50/50 hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200 focus:outline-none"
                >
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full overflow-hidden bg-gray-200 border-2 border-white shadow-sm shrink-0">
                            <img
                                src={`https://ui-avatars.com/api/?name=${user.name}&background=1e293b&color=fff`}
                                alt={user.name}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <span className="text-sm font-semibold text-gray-800 truncate text-left w-24">
                            {user.name}
                        </span>
                    </div>

                    {/* The arrow icon - it even rotates when you click it! */}
                    <svg
                        className={`h-5 w-5 text-gray-400 shrink-0 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
            </div>
        </aside>
    );
}