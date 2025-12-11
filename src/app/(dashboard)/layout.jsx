'use client';

import { useState } from 'react';
import { Menu, SunMoon, Check } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import { useTheme } from '@/context/ThemeContext';

export default function DashboardLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
    const { theme, setTheme } = useTheme();

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
                <div className="bg-white border-b border-clinical-gray-200 p-4 flex items-center gap-4 sticky top-0 z-10">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 hover:bg-clinical-gray-100 rounded-lg text-clinical-gray-600"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="font-bold text-lg text-clinical-blue-700">Erwin&apos;s Hospital</span>
                    <div className="ml-auto relative">
                        <button
                            onClick={() => setIsThemeMenuOpen((v) => !v)}
                            className="p-2 rounded-lg hover:bg-clinical-gray-100 text-clinical-gray-600"
                            aria-haspopup="menu"
                            aria-expanded={isThemeMenuOpen}
                            aria-label="Cambiar tema"
                        >
                            <SunMoon size={18} />
                        </button>
                        {isThemeMenuOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border border-clinical-gray-200 rounded-lg shadow-lg z-20">
                                <button
                                    className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-clinical-gray-50 ${theme === 'light' ? 'font-medium' : ''}`}
                                    onClick={() => { setTheme('light'); setIsThemeMenuOpen(false); }}
                                >
                                    <span>Claro</span>
                                    {theme === 'light' && <Check size={16} className="text-clinical-blue-600" />}
                                </button>
                                <button
                                    className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-clinical-gray-50 ${theme === 'dark' ? 'font-medium' : ''}`}
                                    onClick={() => { setTheme('dark'); setIsThemeMenuOpen(false); }}
                                >
                                    <span>Oscuro</span>
                                    {theme === 'dark' && <Check size={16} className="text-clinical-blue-600" />}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-3 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
