import { Link } from '@inertiajs/react';

export default function Footer() {
    return (
        <footer className="flex items-center justify-between px-6 py-4 mt-auto text-xs font-medium text-gray-400">
            <div>
                &copy; 2026 e-PengawalSekolah
            </div>
            <div className="flex gap-6">
                <Link href="#" className="hover:text-gray-600 transition-colors">About</Link>
                <Link href="#" className="hover:text-gray-600 transition-colors">Support</Link>
                <Link href="#" className="hover:text-gray-600 transition-colors">Contact Us</Link>
            </div>
        </footer>
    );
}