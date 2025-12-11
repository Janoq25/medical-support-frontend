"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm() {
  const { login, loginWithGoogle } = useAuth();
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

      <div className="flex items-center gap-2">
        <hr className="flex-1 border-clinical-gray-200" />
        <span className="text-xs text-clinical-gray-500">o</span>
        <hr className="flex-1 border-clinical-gray-200" />
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full py-3 text-base flex items-center justify-center gap-2"
        onClick={() => loginWithGoogle()}
      >
        <svg width="24px" height="24px" viewBox="-3 0 262 262" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" fill="#000000"><g id="SVGRepo_bgCarrier"></g><g id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"><path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"></path><path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"></path><path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"></path><path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335"></path></g></svg>
        Continuar con Google
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
