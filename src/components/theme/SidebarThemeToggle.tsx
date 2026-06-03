'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export function SidebarThemeToggle() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className="mb-4 px-4">
      <button
        onClick={toggleDarkMode}
        className="group flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm transition-all duration-300 bg-slate-100/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300"
        aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 bg-amber-500/20 dark:bg-amber-500/10">
            {darkMode ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-amber-500" />
            )}
          </div>
          <span className="font-medium">
            {darkMode ? 'Modo oscuro' : 'Modo claro'}
          </span>
        </div>
        
        <div className="relative h-5 w-9 rounded-full transition-all duration-300 bg-slate-300 dark:bg-slate-700">
          <div 
            className={`absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white transition-all duration-300 ${
              darkMode ? 'left-6' : 'left-1'
            }`}
          />
        </div>
      </button>
      
   
    </div>
  );
}