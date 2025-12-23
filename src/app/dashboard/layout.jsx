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
        <div className="flex min-h-screen bg-sand-50 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-sage-50/50 via-sand-50 to-sand-100">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-sage-900/20 backdrop-blur-sm z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className="flex-1 lg:ml-72 min-w-0 transition-all duration-300">
                {/* Mobile Header */}
                <div className="bg-white/70 dark:bg-sand-100/70 backdrop-blur-md border-b border-white/50 dark:border-white/10 p-4 flex items-center gap-4 sticky top-0 z-10 lg:hidden">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 hover:bg-sage-100 rounded-full text-sage-600 transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="font-bold text-lg text-sage-800">ErwinBalance</span>
                    <div className="ml-auto relative">
                        <button
                            onClick={() => setIsThemeMenuOpen((v) => !v)}
                            className="p-2 rounded-full hover:bg-sage-100 text-sage-600 transition-colors"
                            aria-haspopup="menu"
                            aria-expanded={isThemeMenuOpen}
                            aria-label="Cambiar tema"
                        >
                            <SunMoon size={18} />
                        </button>
                    </div>
                </div>

                <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
