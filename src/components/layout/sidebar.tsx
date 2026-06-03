'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Tags,
  Award,
  Truck,
  Scale,
  ShoppingCart,
  Warehouse,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useAuthorization } from '@/hooks/useAuthorization';
import { SidebarThemeToggle } from '@/components/theme/SidebarThemeToggle';
import { useState, useEffect } from 'react';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'CAJERO', 'INVENTARIO'] },
  { href: '/productos', label: 'Productos', icon: Package, roles: ['ADMIN', 'INVENTARIO'] },
  { href: '/categorias', label: 'Categorías', icon: Tags, roles: ['ADMIN'] },
  { href: '/marcas', label: 'Marcas', icon: Award, roles: ['ADMIN'] },
  { href: '/proveedores', label: 'Proveedores', icon: Truck, roles: ['ADMIN', 'INVENTARIO'] },
  { href: '/unidades', label: 'Unidades', icon: Scale, roles: ['ADMIN'] },
  { href: '/ventas', label: 'Ventas POS', icon: ShoppingCart, roles: ['CAJERO', 'ADMIN'] },
  { href: '/inventario', label: 'Inventario', icon: Warehouse, roles: ['INVENTARIO', 'ADMIN'] },
  { href: '/usuarios', label: 'Usuarios', icon: Users, roles: ['ADMIN'] },
  { href: '/configuracion', label: 'Configuración', icon: Settings, roles: ['ADMIN', 'CAJERO', 'INVENTARIO'] },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { usuario, logout } = useAuthStore();
  const { hasRole } = useAuthorization();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const visibleLinks = links.filter(link => hasRole(link.roles));

  const SidebarContent = () => (
    <>
      <div className="border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-4 sm:py-6 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl ring-1 ring-amber-500/20 bg-amber-500/10">
            <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-wide text-slate-900 dark:text-white transition-colors duration-300">
              Licorería TACU 2.0.0
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 transition-colors duration-300">
              Sistema de ventas
            </p>
          </div>
        </div>
        <div className="mt-4 sm:mt-5 transition-all duration-300">
          <p className="text-sm font-medium text-slate-900 dark:text-white transition-colors duration-300">
            {usuario?.nombres ?? 'Usuario'}
          </p>
          <p className="mt-1 text-xs uppercase tracking-wider text-amber-500">
            {usuario?.rol?.nombre ?? 'SIN ROL'}
          </p>
        </div>
        <div className="mt-4">
          <SidebarThemeToggle />
        </div>
      </div>

      <nav className="flex-1 space-y-1 sm:space-y-2 overflow-y-auto p-2 sm:p-4">
        {visibleLinks.map((link) => {
          const active = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => isMobile && setIsOpen(false)}
              className={`group flex items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3 transition-all duration-200 ${
                active 
                  ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-lg shadow-amber-500/5' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80'
              }`}
            >
              <div
                className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl transition ${
                  active 
                    ? 'bg-amber-500/10 text-amber-500' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <span className="text-sm font-medium">{link.label}</span>
              {active && (
                <div className="ml-auto h-2 w-2 rounded-full bg-amber-500 hidden sm:block" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 dark:border-slate-800 p-2 sm:p-4 transition-colors duration-300">
        <button
          onClick={handleLogout}
          className="group flex w-full items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3 text-sm text-slate-600 dark:text-slate-400 transition hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400 duration-300"
        >
          <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 transition group-hover:bg-red-500/10 group-hover:text-red-500 dark:group-hover:text-red-400 duration-300">
            <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <span className="font-medium">Cerrar sesión</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-white shadow-lg"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className="sticky top-0 hidden md:flex h-screen w-64 lg:w-72 flex-col border-r border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-all duration-300">
          <SidebarContent />
        </aside>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobile && isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          <aside className="fixed top-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-all duration-300 shadow-xl">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}