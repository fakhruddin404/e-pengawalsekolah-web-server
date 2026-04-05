import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

export default function PrintQR({ titikSemak, qrSvg }) {
    useEffect(() => {
        // Automatically trigger print dialog when component is mounted and rendered
        const timer = setTimeout(() => {
            window.print();
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            <Head title={`Cetak QR - ${titikSemak.fld_loc_nama}`} />

            <div className="w-full max-w-3xl mx-auto p-12 flex flex-col items-center justify-center min-h-[90vh] text-center border-2 border-gray-100 print:border-none print:p-0 my-8 print:my-0 rounded-3xl print:rounded-none shadow-sm print:shadow-none">

                <h1 className="text-4xl font-black uppercase tracking-widest text-[#1e293b] mb-2 border-b-4 border-gray-900 pb-6 w-full">
                    TITIK SEMAK RONDAAN
                </h1>

                <div className="my-12 p-8 border-4 border-gray-200 rounded-3xl bg-white flex justify-center items-center shadow-inner">
                    <div className="w-[300px] h-[300px]" dangerouslySetInnerHTML={{ __html: qrSvg }} />
                </div>

                <div className="mt-2 space-y-3 w-full bg-gray-50 print:bg-white p-6 rounded-2xl">
                    <p className="text-2xl font-black text-gray-900 tracking-wider font-mono bg-white print:bg-transparent px-4 py-2 inline-block rounded-lg shadow-sm print:shadow-none">{titikSemak.fld_loc_id}</p>
                    <p className="text-3xl font-bold text-gray-800 uppercase leading-snug">{titikSemak.fld_loc_nama}</p>
                </div>

                <div className="mt-16 text-sm text-gray-500 font-medium border-t-2 border-gray-200 pt-8 w-full flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2 text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span>PERHATIAN</span>
                    </div>
                    <p>Sila tampal kod QR ini di lokasi yang tidak terdedah terus kepada hujan/panas melampau.</p>
                    <p>Imbas QR ini menggunakan Aplikasi Mudah Alih Rondaan Rasmi e-PengawalSekolah.</p>
                </div>

            </div>

            {/* Print optimizations */}
            <style jsx global>{`
                @media print {
                    body {
                        background-color: white !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    @page { 
                        margin: 1cm; 
                        size: A4 portrait;
                    }
                }
            `}</style>
        </div>
    );
}
