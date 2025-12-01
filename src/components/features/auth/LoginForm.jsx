'use client';

import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

export default function LoginForm() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Por favor complete todos los campos');
            return;
        }

        // Simulate login - any non-empty credentials work
        console.log('Logging in...');
        try {
            login(email);
        } catch (err) {
            console.error('Login failed:', err);
            setError('Error al iniciar sesión');
        }
    };

    return (
        <form onSubmit={handleLogin} className="space-y-6">
            <Input
                label="ID de Doctor / Correo Electrónico"
                type="email"
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                }}
                placeholder="doctor@erwins.hospital"
                icon={Mail}
            />

            <div className="relative">
                <Input
                    label="Contraseña"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setError('');
                    }}
                    placeholder="••••••••"
                    icon={Lock}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[38px] text-clinical-gray-400 hover:text-clinical-gray-600 cursor-pointer"
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>

            {error && (
                <div className="bg-clinical-red-50 border border-clinical-red-200 text-clinical-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <Button
                type="submit"
                variant="primary"
                className="w-full py-3 text-base"
                onClick={() => { }}
            >
                Ingresar al Sistema
            </Button>

            <div className="text-center">
                <a href="#" className="text-sm text-clinical-blue-600 hover:text-clinical-blue-700">
                    ¿Olvidó su contraseña?
                </a>
            </div>
        </form>
    );
}
