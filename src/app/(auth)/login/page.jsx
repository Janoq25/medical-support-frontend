'use client';

import { Activity } from 'lucide-react';
import LoginForm from '@/components/features/auth/LoginForm';

export default function LoginPage() {
    return (
        <div className="min-h-screen flex">
            {/* Left Side - Illustration */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-clinical-blue-600 to-clinical-blue-800 items-center justify-center p-12">
                <div className="max-w-md text-white">
                    <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm">
                        <Activity className="w-12 h-12" />
                    </div>
                    <h2 className="text-4xl font-bold mb-4">
                        Diagnóstico Asistido por IA
                    </h2>
                    <p className="text-clinical-blue-100 text-lg">
                        Sistema avanzado de apoyo al diagnóstico de trastornos de conducta alimentaria mediante inteligencia artificial.
                    </p>
                    <div className="mt-12 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-clinical-green-400 rounded-full"></div>
                            <span className="text-clinical-blue-100">Comparación GPT vs DeepSeek</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-clinical-green-400 rounded-full"></div>
                            <span className="text-clinical-blue-100">Análisis de indicadores clínicos</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-clinical-green-400 rounded-full"></div>
                            <span className="text-clinical-blue-100">Historial de pacientes</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-clinical-gray-50">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-clinical-gray-900 mb-2">
                            Erwin&apos;s Hospital
                        </h1>
                        <p className="text-clinical-gray-600">Portal de Diagnóstico Asistido</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-clinical-gray-200">
                        <LoginForm />
                    </div>

                    <p className="text-center text-xs text-clinical-gray-500 mt-6">
                        Sistema seguro y confidencial para uso médico profesional
                    </p>
                </div>
            </div>
        </div>
    );
}
