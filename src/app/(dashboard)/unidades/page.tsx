'use client';

import { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import type { Unidad } from '@/types';
import {
  getUnidades,
  createUnidad,
  updateUnidad,
  deleteUnidad,
  getUnidad,
  type CreateUnidadDto,
} from '@/services/unidades.service';
import { UnidadCard } from './components/UnidadCard';
import { UnidadModal } from './components/UnidadModal';
import { UnidadProductosModal } from './components/UnidadProductosModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { Toast, useToast } from '@/components/Toast';

export default function UnidadesPage() {
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { toasts, showToast } = useToast();

  // Modales
  const [showFormModal, setShowFormModal] = useState(false);
  const [showProductosModal, setShowProductosModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUnidad, setSelectedUnidad] = useState<Unidad | undefined>();
  const [unidadConProductos, setUnidadConProductos] = useState<Unidad | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadingProductos, setLoadingProductos] = useState(false);

  // Cargar unidades
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getUnidades();
      setUnidades(data);
    } catch (err) {
      setError('Error al cargar unidades');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar unidades
  const filteredUnidades = unidades.filter((u) =>
    u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.abreviatura.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ver productos de una unidad
  const handleViewProductos = async (unidad: Unidad) => {
    try {
      setLoadingProductos(true);
      const unidadConDetalles = await getUnidad(unidad.id);
      setUnidadConProductos(unidadConDetalles);
      setShowProductosModal(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar productos';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoadingProductos(false);
    }
  };

  // Crear unidad
  const handleCreate = async (data: CreateUnidadDto) => {
    try {
      setIsSubmitting(true);
      setError('');
      const newUnidad = await createUnidad(data);
      setUnidades([...unidades, newUnidad]);
      setShowFormModal(false);
      showToast(`Unidad "${newUnidad.nombre}" creada exitosamente`, 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear unidad';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Actualizar unidad
  const handleUpdate = async (data: CreateUnidadDto) => {
    if (!selectedUnidad) return;

    try {
      setIsSubmitting(true);
      setError('');
      const updated = await updateUnidad(selectedUnidad.id, data);
      setUnidades(
        unidades.map((u) => (u.id === updated.id ? updated : u))
      );
      setShowFormModal(false);
      setSelectedUnidad(undefined);
      showToast(`Unidad "${updated.nombre}" actualizada exitosamente`, 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar unidad';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Eliminar unidad
  const handleDelete = (unidad: Unidad) => {
    setSelectedUnidad(unidad);
    setShowDeleteModal(true);
  };

  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    if (!selectedUnidad) return;

    try {
      setIsDeleting(true);
      setError('');
      await deleteUnidad(selectedUnidad.id);
      setUnidades(unidades.filter((u) => u.id !== selectedUnidad.id));
      setShowDeleteModal(false);
      showToast(`Unidad "${selectedUnidad.nombre}" eliminada exitosamente`, 'success');
      setSelectedUnidad(undefined);
    } catch (err) {
      let errorMessage = 'Error al eliminar unidad';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null && 'response' in err) {
        const response = (err as any).response;
        errorMessage = response?.data?.message || response?.statusText || errorMessage;
      }
      
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Abrir modal de edición
  const handleEditClick = (unidad: Unidad) => {
    setSelectedUnidad(unidad);
    setShowFormModal(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setShowFormModal(false);
    setSelectedUnidad(undefined);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Unidades de Medida</h1>
            <p className="mt-1 text-slate-400">
              {filteredUnidades.length} de {unidades.length} unidades
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedUnidad(undefined);
              setShowFormModal(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Nueva Unidad
          </button>
        </div>
      </div>

      {/* Errores */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-500/10 px-4 py-3 text-red-400">
          {error}
        </div>
      )}

      {/* Búsqueda */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar unidades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Contenido */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-400">Cargando unidades...</p>
        </div>
      ) : filteredUnidades.length === 0 ? (
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-12 text-center">
          <p className="text-slate-400">
            {searchTerm
              ? 'No se encontraron unidades'
              : 'No hay unidades. Crea una para empezar.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredUnidades.map((unidad) => (
            <UnidadCard
              key={unidad.id}
              unidad={unidad}
              onView={handleViewProductos}
              onEdit={handleEditClick}
              onDelete={() => handleDelete(unidad)}
            />
          ))}
        </div>
      )}

      {/* Modales */}
      <UnidadModal
        isOpen={showFormModal}
        unidad={selectedUnidad}
        onClose={handleCloseModal}
        onSubmit={selectedUnidad ? handleUpdate : handleCreate}
        isLoading={isSubmitting}
      />

      <UnidadProductosModal
        isOpen={showProductosModal}
        unidad={unidadConProductos}
        onClose={() => {
          setShowProductosModal(false);
          setUnidadConProductos(undefined);
        }}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        unitName={selectedUnidad?.nombre || ''}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setSelectedUnidad(undefined);
        }}
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
