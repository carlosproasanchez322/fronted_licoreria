'use client';

import { useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { darkMode } = useTheme();

  // Asegurar que el tema se aplique correctamente en el cliente
  useEffect(() => {
    // Forzar una re-renderización para asegurar que las clases dark se apliquen
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  return <>{children}</>;
}