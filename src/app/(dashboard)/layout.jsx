'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-clinical-gray-50">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className="flex-1 lg:ml-64 min-w-0">
                {/* Mobile Header */}
                <div className="lg:hidden bg-white border-b border-clinical-gray-200 p-4 flex items-center gap-4 sticky top-0 z-10">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 hover:bg-clinical-gray-100 rounded-lg text-clinical-gray-600"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="font-bold text-lg text-clinical-blue-700">Erwin&apos;s Hospital</span>
                </div>

                <div className="p-3 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
