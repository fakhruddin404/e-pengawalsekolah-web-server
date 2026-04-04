import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import SidebarItem from './SidebarItem';
import { useState } from 'react';

export default function Aside({ user, navItems }) {

    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    return (
        <div className="flex w-64 flex-col justify-between bg-white border-r border-gray-100 overflow-y-auto z-10">
            <div>
                <div className="flex items-center gap-3 p-6 mt-2">
                    <Link href="/">
                        <ApplicationLogo type={1} className="w-48 h-auto" />
                    </Link>
                </div>

                <nav className="mt-4 px-3 space-y-1">
                    {navItems.map((item, index) => (
                        <SidebarItem
                            key={index}
                            href={item.route === '#' ? '#' : route(item.route)}
                            active={item.active}
                            icon={item.icon}
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
    );
}