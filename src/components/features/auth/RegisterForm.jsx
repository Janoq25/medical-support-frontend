'use client';

import { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Check, X } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { register as localRegister } from '@/services/auth/localApi';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [strength, setStrength] = useState(0);
  const [reqs, setReqs] = useState({ len: false, upper: false, lower: false, num: false, special: false });
  const [showStrengthPanel, setShowStrengthPanel] = useState(false);

  const evaluatePassword = (value) => {
    const len = value.length >= 8;
    const upper = /[A-Z]/.test(value);
    const lower = /[a-z]/.test(value);
    const num = /\d/.test(value);
    const special = /[^A-Za-z0-9]/.test(value);
    const score = [len, upper, lower, num, special].filter(Boolean).length;
    setReqs({ len, upper, lower, num, special });
    setStrength(score);
  };

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !email || !password || !confirmPassword) {
      setError('Por favor complete todos los campos');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      setIsSubmitting(true);
      await localRegister(username, email, password);
      router.push('/login');
    } catch (err) {
      console.error('Registro falló:', err);
      setError(typeof err?.message === 'string' ? err.message : 'Error al registrar. Vuelve a intentarlo');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-6">
      <Input
        label="Nombre"
        type="text"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          setError('');
        }}
        placeholder="Nombre y Apellido"
        icon={User}
      />

      <Input
        label="Correo Electrónico"
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
            const val = e.target.value;
            setPassword(val);
            setError('');
            evaluatePassword(val);
          }}
          onFocus={() => setShowStrengthPanel(true)}
          onBlur={() => setShowStrengthPanel(false)}
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

      <div className="relative">
        <Input
          label="Confirmar Contraseña"
          type={showConfirmPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setError('');
          }}
        //   onFocus={() => setShowStrengthPanel(true)}
        //   onBlur={() => setShowStrengthPanel(false)}
          placeholder="••••••••"
          icon={Lock}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-[38px] text-clinical-gray-400 hover:text-clinical-gray-600 cursor-pointer"
        >
          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        {confirmPassword.length > 0 && (
          <div className={`text-xs mt-1 flex items-center gap-2 ${passwordsMatch ? 'text-clinical-green-600' : 'text-clinical-red-600'}`}>
            {passwordsMatch ? <Check size={14} /> : <X size={14} />}
            <span>{passwordsMatch ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden'}</span>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-clinical-red-50 border border-clinical-red-200 text-clinical-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {showStrengthPanel && (
        <div className="space-y-2">
          <div className="h-2 w-full bg-clinical-gray-200 rounded">
            <div
              className={`h-2 rounded ${strength <= 2 ? 'bg-clinical-red-500' : strength <= 3 ? 'bg-clinical-blue-500' : 'bg-clinical-green-500'}`}
              style={{ width: `${(strength / 5) * 100}%` }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className={`flex items-center gap-2 ${reqs.len ? 'text-clinical-green-600' : 'text-clinical-gray-500'}`}>
              {reqs.len ? <Check size={14} /> : <X size={14} />}
              <span>8+ caracteres</span>
            </div>
            <div className={`flex items-center gap-2 ${reqs.num ? 'text-clinical-green-600' : 'text-clinical-gray-500'}`}>
              {reqs.num ? <Check size={14} /> : <X size={14} />}
              <span>1 número</span>
            </div>
            <div className={`flex items-center gap-2 ${reqs.upper ? 'text-clinical-green-600' : 'text-clinical-gray-500'}`}>
              {reqs.upper ? <Check size={14} /> : <X size={14} />}
              <span>1 mayúscula</span>
            </div>
            <div className={`flex items-center gap-2 ${reqs.lower ? 'text-clinical-green-600' : 'text-clinical-gray-500'}`}>
              {reqs.lower ? <Check size={14} /> : <X size={14} />}
              <span>1 minúscula</span>
            </div>
            <div className={`flex items-center gap-2 ${reqs.special ? 'text-clinical-green-600' : 'text-clinical-gray-500'}`}>
              {reqs.special ? <Check size={14} /> : <X size={14} />}
              <span>1 símbolo</span>
            </div>
          </div>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        className="w-full py-3 text-base"
        disabled={isSubmitting || strength < 4 || password !== confirmPassword}
      >
        {isSubmitting ? 'Registrando...' : 'Crear Cuenta'}
      </Button>

      <div className="flex items-center justify-center gap-2">
        <span className="text-sm text-clinical-gray-600 hover:text-clinical-gray-700 hover:cursor-default">
          ¿Ya tienes una cuenta?
        </span>
        <a
          href="/login"
          className="text-sm text-clinical-blue-600 hover:text-clinical-blue-700"
        >
          Inicia sesión
        </a>
      </div>
    </form>
  );
}
