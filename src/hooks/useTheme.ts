'use client';

import { useState, useEffect } from 'react';

export function useTheme() {
  const [darkMode, setDarkMode] = useState(true);

  // Cargar tema del localStorage al iniciar
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === 'true');
    }
  }, []);

  // Aplicar modo oscuro/claro al documento
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const setTheme = (isDark: boolean) => {
    setDarkMode(isDark);
  };

  return {
    darkMode,
    toggleDarkMode,
    setTheme,
  };
}