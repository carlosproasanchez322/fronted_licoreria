'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoginForm } from '@/components/auth/login-form';
import { useAuthStore } from '@/store/auth.store';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export default function LoginPage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (token || localStorage.getItem('access_token')) {
      router.replace('/dashboard');
    }
  }, [token, router]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-all duration-300">
      {/* Toggle de tema en la esquina superior derecha */}
      <ThemeToggle position="top-right" size="md" />
      
      <div className="w-full max-w-md rounded-2xl border border-slate-300 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 p-8 shadow-2xl backdrop-blur transition-all duration-300">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors duration-300">
            Sistema de Licorería POS
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 transition-colors duration-300">
            Ingresa tus credenciales para continuar
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
