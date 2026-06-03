import { useAuthStore } from '@/store/auth.store';

export function useAuthorization() {
  const usuario = useAuthStore((s) => s.usuario);

  const hasRole = (roles: string | string[]) => {
    if (!usuario?.rol) return false;
    const rolesArray = Array.isArray(roles) ? roles : [roles];
    return rolesArray.includes(usuario.rol);
  };

  const isAdmin = () => hasRole('ADMIN');
  const isCajero = () => hasRole('CAJERO');
  const isInventario = () => hasRole('INVENTARIO');

  return {
    hasRole,
    isAdmin,
    isCajero,
    isInventario,
    userRole: usuario?.rol,
  };
}
