import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen w-full bg-white font-sans">

            {/* Left Side - Branding/Logo */}
            {/* It is hidden on smaller screens to prioritize the login form */}
            <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center relative bg-[#eef6ff] overflow-hidden">
                {/* Optional: You can replace this gradient with an actual CSS background image if you have the exact watercolor asset */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#dceeff] to-[#f4faff] opacity-80"></div>

                <div className="z-10 flex flex-col items-center transform transition-transform hover:scale-105 duration-500">
                    <Link href="#">
                        <ApplicationLogo className="w-85 h-auto" />
                    </Link>
                </div>
            </div>

            {/* Right Side - Form Container */}
            <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-8 sm:p-12 lg:p-24 shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.1)] z-20 bg-white">
                <div className="w-full max-w-md space-y-8">
                    {children}
                </div>
            </div>

        </div>
    );
}