import { Link } from '@inertiajs/react';

export default function SidebarItem({ href, active, icon, children }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200
                ${active
                    ? 'bg-[#f8f9fa] text-gray-900 shadow-sm border border-gray-100'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
        >
            <svg className={`h-5 w-5 ${active ? 'text-gray-800' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon}></path>
            </svg>
            {children}
        </Link>
    );
}