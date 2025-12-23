'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Activity, User, LogOut, ChevronUp, X, Moon, Sun } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function Sidebar({ isOpen, onClose }) {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const navItems = [
        { name: 'General', href: '/dashboard/home', icon: LayoutDashboard },
        { name: 'Pacientes', href: '/dashboard/pacientes', icon: Users },
        { name: 'Indicadores', href: '/dashboard/indicadores', icon: Activity },
    ];

    const isActive = (href) => pathname === href || pathname.startsWith(href + '/');

    return (
        <aside className={`fixed left-0 top-0 h-screen w-72 bg-white/40 dark:bg-sand-100/60 backdrop-blur-xl border-r border-white/40 dark:border-white/5 shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex flex-col z-30 transition-transform duration-500 ease-soft lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
            {/* Header */}
            <div className="px-8 py-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-sage-900 tracking-tight">
                        ErwinBalance
                    </h1>
                    <p className="text-sm text-sage-500 mt-1 font-medium">Sistema de Diagnóstico</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="p-2 rounded-full text-sage-500 hover:bg-sage-100 hover:text-sage-700 transition-colors cursor-pointer"
                        title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    {/* Mobile Close Button */}
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 hover:bg-sage-100 rounded-full text-sage-500 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-6 py-4">
                <ul className="space-y-3">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);

                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    onClick={() => onClose?.()} // Close sidebar on navigation on mobile
                                    className={`flex items-center gap-4 px-6 py-3.5 rounded-full transition-all duration-300 ${active
                                        ? 'bg-sage-200/80 text-sage-900 font-semibold shadow-sm'
                                        : 'text-sage-600 hover:bg-sage-50 hover:text-sage-800'
                                        }`}
                                >
                                    <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                                    <span>{item.name}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* User Profile */}
            <div className="px-6 py-6 mt-auto">
                <div className="relative">
                    {isDropdownOpen && (
                        <div className="absolute bottom-full left-0 right-0 mb-3 bg-white/90 dark:bg-sand-100/90 backdrop-blur-md rounded-2xl shadow-soft border border-white/50 dark:border-white/10 overflow-hidden transform origin-bottom transition-all duration-200">
                            <button
                                onClick={logout}
                                className="flex items-center gap-3 px-5 py-3.5 w-full text-left text-status-error hover:bg-red-50 transition-colors cursor-pointer font-medium"
                            >
                                <LogOut size={18} />
                                <span>Cerrar Sesión</span>
                            </button>
                        </div>
                    )}

                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`flex items-center gap-3 px-4 py-3 w-full rounded-2xl transition-all duration-300 cursor-pointer border border-transparent ${isDropdownOpen ? 'bg-white dark:bg-sand-100 shadow-sm border-white/50 dark:border-white/10' : 'hover:bg-white/50 dark:hover:bg-sand-100/50 hover:shadow-sm'}`}
                    >
                        <div className="w-10 h-10 rounded-full bg-sage-200 flex items-center justify-center text-sage-700 font-bold border-2 border-white shadow-sm">
                            <User size={20} />
                        </div>
                        <div className="text-left flex-1 min-w-0">
                            <p className="text-sm font-bold text-sage-900 truncate">{user || 'Dr. Usuario'}</p>
                            <p className="text-xs text-sage-500 truncate font-medium">Médico Especialista</p>
                        </div>
                        <ChevronUp size={16} className={`text-sage-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>
        </aside>
    );
}
