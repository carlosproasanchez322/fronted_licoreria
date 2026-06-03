'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Toast, useToast } from '@/components/Toast';
import { useAuthStore } from '@/store/auth.store';
import { RoleGuard } from '@/components/layout/role-guard';
import usuariosService, {
  Usuario,
  CreateUsuarioRequest,
  UpdateUsuarioRequest,
} from '@/services/usuarios.service';
import UsuarioFormModal from './components/UsuarioFormModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';

interface Rol {
  idRol: number;
  nombre: string;
}

function UsuariosPageContent() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { toasts, showToast } = useToast();

  // Modales
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState<Usuario | undefined>();

  // Cargar datos iniciales
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    loadData();
  }, [isAuthenticated, router]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Cargar usuarios y roles en paralelo
      const [usuariosData, rolesData] = await Promise.all([
        usuariosService.getUsuarios(),
        usuariosService.getRoles(),
      ]);
      
      setUsuarios(usuariosData);
      setRoles(rolesData);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsuarios = usuarios.filter(
    (u) =>
      u.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.usuario.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateOrUpdate = async (data: CreateUsuarioRequest | UpdateUsuarioRequest) => {
    try {
      setIsSubmitting(true);

      if (selectedUsuario) {
        // Actualizar
        const updatedUsuario = await usuariosService.updateUsuario(
          selectedUsuario.idUsuario!,
          data as UpdateUsuarioRequest
        );
        setUsuarios(
          usuarios.map((u) =>
            u.idUsuario === updatedUsuario.idUsuario ? updatedUsuario : u
          )
        );
        showToast('Usuario actualizado exitosamente', 'success');
      } else {
        // Crear
        const newUsuario = await usuariosService.createUsuario(
          data as CreateUsuarioRequest
        );
        setUsuarios([newUsuario, ...usuarios]);
        showToast('Usuario creado exitosamente', 'success');
      }

      setShowFormModal(false);
      setSelectedUsuario(undefined);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      showToast(errorMsg, 'error');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!usuarioToDelete?.idUsuario) return;

    try {
      await usuariosService.deleteUsuario(usuarioToDelete.idUsuario);
      setUsuarios(
        usuarios.filter((u) => u.idUsuario !== usuarioToDelete.idUsuario)
      );
      setShowDeleteModal(false);
      setUsuarioToDelete(undefined);
      showToast('Usuario eliminado exitosamente', 'success');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      showToast(errorMsg, 'error');
    }
  };

  const handleEditClick = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setShowFormModal(true);
  };

  const handleDeleteClick = (usuario: Usuario) => {
    setUsuarioToDelete(usuario);
    setShowDeleteModal(true);
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
    setSelectedUsuario(undefined);
  };

  const getRolNombre = (idRol: number) => {
    return roles.find((r) => r.idRol === idRol)?.nombre || 'Desconocido';
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Usuarios</h1>
            <p className="mt-1 text-slate-400">
              {filteredUsuarios.length} de {usuarios.length} usuarios
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedUsuario(undefined);
              setShowFormModal(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Nuevo Usuario
          </button>
        </div>
      </div>

      {/* Errores */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-500/10 px-4 py-3 text-red-400">
          {error}
        </div>
      )}

      {/* Buscador */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por nombre, usuario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Contenido */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-400">Cargando usuarios...</p>
        </div>
      ) : filteredUsuarios.length === 0 ? (
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-12 text-center">
          <p className="text-slate-400">
            {searchTerm
              ? 'No se encontraron usuarios'
              : 'No hay usuarios. Crea uno para empezar.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-slate-400">
              <tr>
                <th className="px-6 py-3">Nombre Completo</th>
                <th className="px-6 py-3">Usuario</th>
                <th className="px-6 py-3">Rol</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/50">
              {filteredUsuarios.map((usuario) => (
                <tr
                  key={usuario.idUsuario}
                  className="text-slate-300 hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-white">
                      {usuario.nombres} {usuario.apellidos}
                    </p>
                  </td>
                  <td className="px-6 py-4 font-mono text-blue-400">
                    {usuario.usuario}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-300">
                      {usuario.rol?.nombre || getRolNombre(usuario.idRol)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                        usuario.estado
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}
                    >
                      {usuario.estado ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEditClick(usuario)}
                        className="rounded px-2 py-1 text-xs text-blue-400 hover:bg-blue-600/20 transition-colors flex items-center gap-1"
                      >
                        <Edit className="h-4 w-4" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteClick(usuario)}
                        className="rounded px-2 py-1 text-xs text-red-400 hover:bg-red-600/20 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modales */}
      <UsuarioFormModal
        isOpen={showFormModal}
        onClose={handleCloseFormModal}
        onSubmit={handleCreateOrUpdate}
        usuario={selectedUsuario}
        roles={roles}
        isLoading={isSubmitting}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setUsuarioToDelete(undefined);
        }}
        onConfirm={handleDelete}
        usuarioNombre={
          usuarioToDelete
            ? `${usuarioToDelete.nombres} ${usuarioToDelete.apellidos}`
            : ''
        }
      />

      {/* Toasts */}
      <div className="fixed bottom-4 right-4 z-40 space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={3000}
          />
        ))}
      </div>
    </div>
  );
}

export default function UsuariosPage() {
  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      <UsuariosPageContent />
    </RoleGuard>
  );
}
