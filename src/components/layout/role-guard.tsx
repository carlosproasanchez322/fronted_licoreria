'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth.store';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const router = useRouter();
  const usuario = useAuthStore((s) => s.usuario);
  const [ready, setReady] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!usuario?.rol) {
      router.replace('/login');
      return;
    }

    const hasAccess = allowedRoles.includes(usuario.rol.nombre);
    setAuthorized(hasAccess);
    setReady(true);

    if (!hasAccess) {
      router.replace('/dashboard');
    }
  }, [usuario, router, allowedRoles]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <p className="text-slate-400">Verificando acceso...</p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Acceso Denegado</h1>
          <p className="text-slate-400">No tienes permiso para acceder a esta página.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
