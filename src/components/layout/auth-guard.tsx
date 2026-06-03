'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth.store';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored =
      token ?? (typeof window !== 'undefined' && localStorage.getItem('access_token'));
    if (!stored) {
      router.replace('/login');
    } else {
      setReady(true);
    }
  }, [token, router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <p className="text-slate-400">Cargando...</p>
      </div>
    );
  }

  return <>{children}</>;
}
