/**
 * Clases utilitarias para responsive design
 * 
 * Estas clases pueden ser utilizadas directamente en componentes
 */

// Breakpoints comunes para referencia
export const BREAKPOINTS = {
  xs: 0,      // Extra small devices (portrait phones)
  sm: 640,    // Small devices (landscape phones)
  md: 768,    // Medium devices (tablets)
  lg: 1024,   // Large devices (desktops)
  xl: 1280,   // Extra large devices
  '2xl': 1536, // 2X large devices
};

// Clases CSS para responsive design
export const RESPONSIVE_CLASSES = {
  // Grid responsivo
  grid: {
    mobile: 'grid-cols-1',
    sm: 'sm:grid-cols-2',
    md: 'md:grid-cols-3',
    lg: 'lg:grid-cols-4',
    xl: 'xl:grid-cols-5',
  },
  
  // Padding responsivo
  padding: {
    page: 'p-4 sm:p-6 lg:p-8',
    card: 'p-3 sm:p-4 lg:p-6',
    button: 'px-3 py-2 sm:px-4 sm:py-2',
  },
  
  // Tamaño de texto responsivo
  text: {
    h1: 'text-2xl sm:text-3xl lg:text-4xl',
    h2: 'text-xl sm:text-2xl lg:text-3xl',
    h3: 'text-lg sm:text-xl lg:text-2xl',
    base: 'text-sm sm:text-base lg:text-lg',
    small: 'text-xs sm:text-sm',
  },
  
  // Espaciado vertical responsivo
  spacing: {
    section: 'mb-6 sm:mb-8 lg:mb-10',
    element: 'mb-3 sm:mb-4 lg:mb-5',
  },
};

// Funciones de utilidad
export const responsive = {
  // Retorna clases condicionales basadas en tamaño de pantalla
  classNames: (classes: Record<string, string>) => {
    return Object.entries(classes)
      .map(([breakpoint, className]) => {
        if (breakpoint === 'base') return className;
        return `${breakpoint}:${className}`;
      })
      .join(' ');
  },
  
  // Verifica si estamos en móvil (útil para efectos JavaScript)
  isMobile: () => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < BREAKPOINTS.md;
  },
  
  isTablet: () => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= BREAKPOINTS.md && window.innerWidth < BREAKPOINTS.lg;
  },
  
  isDesktop: () => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= BREAKPOINTS.lg;
  },
};