'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { Toast, useToast } from '@/components/Toast';

interface Cliente {
  idCliente?: number;
  nombres: string;
  apellidos?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { toasts, showToast } = useToast();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // Modales
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar clientes (simulado por ahora)
  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      setLoading(true);
      // Por ahora es simulado - se conectará al backend
      setClientes([
        {
          idCliente: 1,
          nombres: 'Juan',
          apellidos: 'Pérez García',
          telefono: '987654321',
          email: 'juan@example.com',
          direccion: 'Av. Principal 123',
        },
        {
          idCliente: 2,
          nombres: 'María',
          apellidos: 'López Rodríguez',
          telefono: '987654322',
          email: 'maria@example.com',
          direccion: 'Calle Secundaria 456',
        },
      ]);
    } catch (err) {
      setError('Error al cargar clientes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredClientes = clientes.filter((c) =>
    c.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.apellidos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async (data: Cliente) => {
    try {
      setIsSubmitting(true);
      // Por ahora es simulado
      const newCliente: Cliente = {
        idCliente: Math.max(...clientes.map((c) => c.idCliente || 0), 0) + 1,
        ...data,
      };
      setClientes([newCliente, ...clientes]);
      setShowFormModal(false);
      showToast('Cliente creado exitosamente', 'success');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al crear cliente';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: Cliente) => {
    if (!selectedCliente?.idCliente) return;
    try {
      setIsSubmitting(true);
      setClientes(
        clientes.map((c) =>
          c.idCliente === selectedCliente.idCliente ? { ...data, idCliente: selectedCliente.idCliente } : c
        )
      );
      setShowFormModal(false);
      setSelectedCliente(undefined);
      showToast('Cliente actualizado exitosamente', 'success');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al actualizar cliente';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) return;
    try {
      setClientes(clientes.filter((c) => c.idCliente !== id));
      showToast('Cliente eliminado exitosamente', 'success');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al eliminar cliente';
      showToast(errorMsg, 'error');
    }
  };

  const handleEditClick = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setShowFormModal(true);
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
    setSelectedCliente(undefined);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Clientes</h1>
            <p className="mt-1 text-slate-400">{filteredClientes.length} de {clientes.length} clientes</p>
          </div>
          <button
            onClick={() => {
              setSelectedCliente(undefined);
              setShowFormModal(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Nuevo Cliente
          </button>
        </div>
      </div>

      {/* Errores */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-500/10 px-4 py-3 text-red-400">{error}</div>
      )}

      {/* Controles */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por nombre, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Contenido */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-400">Cargando clientes...</p>
        </div>
      ) : filteredClientes.length === 0 ? (
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-12 text-center">
          <p className="text-slate-400">
            {searchTerm ? 'No se encontraron clientes' : 'No hay clientes. Crea uno para empezar.'}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-slate-400">
              <tr>
                <th className="px-6 py-3">Nombre</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Teléfono</th>
                <th className="px-6 py-3">Dirección</th>
                <th className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/50">
              {filteredClientes.map((cliente) => (
                <tr key={cliente.idCliente} className="text-slate-300 hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-white">{cliente.nombres} {cliente.apellidos}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">{cliente.email || '—'}</td>
                  <td className="px-6 py-4">{cliente.telefono || '—'}</td>
                  <td className="px-6 py-4">{cliente.direccion || '—'}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEditClick(cliente)}
                        className="rounded px-2 py-1 text-xs text-blue-400 hover:bg-blue-600/20 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => cliente.idCliente && handleDelete(cliente.idCliente)}
                        className="rounded px-2 py-1 text-xs text-red-400 hover:bg-red-600/20 transition-colors"
                      >
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
