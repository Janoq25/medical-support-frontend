'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Activity, User, LogOut, ChevronUp, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
    const pathname = usePathname();
    const { logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const navItems = [
        { name: 'General', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Pacientes', href: '/pacientes', icon: Users },
        { name: 'Indicadores', href: '/indicadores', icon: Activity },
    ];

    const isActive = (href) => pathname === href || pathname.startsWith(href + '/');

    return (
        <aside className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-clinical-gray-200 flex flex-col z-30 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
            {/* Header */}
            <div className="px-6 py-6 border-b border-clinical-gray-200 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-clinical-blue-700">
                        Erwin&apos;s Hospital
                    </h1>
                    <p className="text-xs text-clinical-gray-500 mt-1">Sistema de Diagnóstico</p>
                </div>
                {/* Mobile Close Button */}
                <button
                    onClick={onClose}
                    className="lg:hidden p-2 hover:bg-clinical-gray-100 rounded-lg text-clinical-gray-500"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6">
                <ul className="space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);

                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    onClick={() => onClose?.()} // Close sidebar on navigation on mobile
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${active
                                        ? 'bg-clinical-blue-50 text-clinical-blue-700 font-medium'
                                        : 'text-clinical-gray-600 hover:bg-clinical-gray-50'
                                        }`}
                                >
                                    <Icon size={20} />
                                    <span>{item.name}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* User Profile */}
            <div className="px-4 py-4 border-t border-clinical-gray-200 relative">
                {isDropdownOpen && (
                    <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-lg shadow-lg border border-clinical-gray-200 overflow-hidden">
                        <button
                            onClick={logout}
                            className="flex items-center gap-3 px-4 py-3 w-full text-left text-clinical-red-600 hover:bg-clinical-red-50 transition-colors cursor-pointer"
                        >
                            <LogOut size={18} />
                            <span className="text-sm font-medium">Cerrar Sesión</span>
                        </button>
                    </div>
                )}

                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-clinical-gray-50 transition-all cursor-pointer"
                >
                    <div className="w-8 h-8 rounded-full bg-clinical-blue-600 flex items-center justify-center text-white font-medium">
                        <User size={18} />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                        <p className="text-sm font-medium text-clinical-gray-900 truncate">Dr. Usuario</p>
                        <p className="text-xs text-clinical-gray-500 truncate">Médico Especialista</p>
                    </div>
                    <ChevronUp size={16} className={`text-clinical-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
            </div>
        </aside>
    );
}
