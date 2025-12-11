"use client";

import { Activity } from "lucide-react";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-clinical-blue-600 to-clinical-blue-800 items-center justify-center">
        <video
          className="w-full h-full object-cover shadow-2xl"
          autoPlay
          loop
          muted
        >
          <source src="/auth/decoration.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-clinical-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6 lg:hidden">
              <div className="w-16 h-16 bg-clinical-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Activity className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-clinical-gray-900 mb-2">
              👨‍⚕️ Erwin&apos;s Hospital
            </h1>
            <p className="text-clinical-gray-600">
              🥼 Portal de Diagnóstico Asistido
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-clinical-gray-200">
            {children}
          </div>

          <p className="text-center text-xs text-clinical-gray-500 mt-6">
            Sistema seguro y confidencial para uso médico profesional
          </p>
        </div>
      </div>
    </div>
  );
}
