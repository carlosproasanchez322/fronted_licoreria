'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { login } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';

const schema = z.object({
  usuario: z.string().min(1, 'Usuario requerido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { usuario: 'carlos', password: '123456' },
  });

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      const res = await login(data.usuario, data.password);
      setAuth(res.access_token, res.usuario);
      router.push('/dashboard');
    } catch {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors duration-300">
            Usuario
          </label>
          <input
            {...register('usuario')}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 sm:px-4 py-2 sm:py-2.5 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all duration-300 text-sm sm:text-base"
            placeholder="carlos"
          />
          {errors.usuario && (
            <p className="mt-1 text-xs sm:text-sm text-red-500 dark:text-red-400 transition-colors duration-300">
              {errors.usuario.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors duration-300">
            Contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 sm:px-4 py-2 sm:py-2.5 pr-10 sm:pr-12 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all duration-300 text-sm sm:text-base"
              placeholder="••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 transition text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 p-1"
              tabIndex={-1}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs sm:text-sm text-red-500 dark:text-red-400 transition-colors duration-300">
              {errors.password.message}
            </p>
          )}
        </div>

        {error && (
          <p className="rounded-lg px-3 py-2 text-xs sm:text-sm bg-red-500/10 text-red-500 dark:text-red-400 transition-colors duration-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-amber-500 py-2.5 font-semibold text-slate-900 transition hover:bg-amber-400 disabled:opacity-50 duration-300 text-sm sm:text-base touch-button"
        >
          {isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
        </button>
      </form>

      {/* Footer con links */}
      <div className="mt-6 sm:mt-8 space-y-2 sm:space-y-3 border-t border-slate-300 dark:border-slate-700 pt-4 sm:pt-6 transition-colors duration-300">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs text-slate-600 dark:text-slate-400 transition-colors duration-300">
          <a href="/politica-privacidad" className="hover:text-amber-400 transition-colors duration-300">
            Política de Privacidad
          </a>
          <span className="text-slate-400 dark:text-slate-600 hidden sm:inline">•</span>
          <a href="/terminos" className="hover:text-amber-400 transition-colors duration-300">
            Términos y Condiciones
          </a>
        </div>
        <div className="text-center text-xs text-slate-500 dark:text-slate-500 transition-colors duration-300">
          <p>Licorería POS v1.0</p>
          <p className="mt-0.5 sm:mt-1">
            Desarrollado por <span className="text-amber-400 font-medium">Código Yara</span>
          </p>
        </div>
      </div>
    </>
  );
}
