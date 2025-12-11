"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Por favor complete todos los campos");
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      console.error("Login failed:", err);
      setError("Error al iniciar sesión. Vuelve a intentarlo");
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <Input
        label="Correo Electrónico"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setError("");
        }}
        placeholder="doctor@erwins.hospital"
        icon={Mail}
      />

      <div className="relative" onFocus={() => setError("")}>
        <Input
          label="Contraseña"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          placeholder="••••••••"
          icon={Lock}
        />
        <button
          type="button"
          onClick={() => {setShowPassword(!showPassword)}}
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
        onClick={() => {setError("");}}
      >
        Ingresar al Sistema
      </Button>

      <div className="flex items-center justify-center gap-2">
        <span className="text-sm text-clinical-gray-600 hover:text-clinical-gray-700 hover:cursor-default">
         ¿Aún no tienes una cuenta?
        </span>
        <a
          href="/register"
          className="text-sm text-clinical-blue-600 hover:text-clinical-blue-700"
        >
          Regístrate
        </a>
      </div>
    </form>
  );
}
