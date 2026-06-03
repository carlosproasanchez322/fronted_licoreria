'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export function ThemeToggle({ 
  size = 'md', 
  showLabel = false,
  position = 'top-right'
}: ThemeToggleProps) {
  const { darkMode, toggleDarkMode } = useTheme();

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      <button
        onClick={toggleDarkMode}
        className={`group flex items-center gap-2 rounded-full ${sizeClasses[size]} transition-all duration-300 ${
          darkMode
            ? 'bg-slate-800 text-amber-400 hover:bg-slate-700'
            : 'bg-amber-100 text-amber-600 hover:bg-amber-200'
        }`}
        aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      >
        <div className="flex items-center justify-center w-full">
          {darkMode ? (
            <Sun className={`${iconSizes[size]} transition-transform group-hover:rotate-45`} />
          ) : (
            <Moon className={`${iconSizes[size]} transition-transform group-hover:rotate-12`} />
          )}
        </div>
        
        {showLabel && (
          <span className="text-sm font-medium whitespace-nowrap">
            {darkMode ? 'Modo claro' : 'Modo oscuro'}
          </span>
        )}
      </button>
      
      {/* Efecto de anillo cuando está activo */}
      <div className={`absolute inset-0 rounded-full -z-10 transition-all duration-500 ${
        darkMode 
          ? 'bg-amber-400/20 animate-pulse' 
          : 'bg-amber-600/20 animate-pulse'
      }`} />
    </div>
  );
}