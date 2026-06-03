'use client';

import { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import type { Marca } from '@/types';
import {
  getMarcas,
  createMarca,
  updateMarca,
  deleteMarca,
  getMarca,
  type CreateMarcaDto,
} from '@/services/marcas.service';
import { MarcaCard } from './components/MarcaCard';
import { MarcaModal } from './components/MarcaModal';
import { MarcaProductosModal } from './components/MarcaProductosModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { Toast, useToast } from '@/components/Toast';

export default function MarcasPage() {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { toasts, showToast } = useToast();

  // Modales
  const [showFormModal, setShowFormModal] = useState(false);
  const [showProductosModal, setShowProductosModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMarca, setSelectedMarca] = useState<Marca | undefined>();
  const [marcaConProductos, setMarcaConProductos] = useState<Marca | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadingProductos, setLoadingProductos] = useState(false);

  // Cargar marcas
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getMarcas();
      setMarcas(data);
    } catch (err) {
      setError('Error al cargar marcas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar marcas
  const filteredMarcas = marcas.filter((m) =>
    m.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ver productos de una marca
  const handleViewProductos = async (marca: Marca) => {
    try {
      setLoadingProductos(true);
      const marcaConDetalles = await getMarca(marca.id);
      setMarcaConProductos(marcaConDetalles);
      setShowProductosModal(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar productos';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoadingProductos(false);
    }
  };

  // Crear marca
  const handleCreate = async (data: CreateMarcaDto) => {
    try {
      setIsSubmitting(true);
      setError('');
      const newMarca = await createMarca(data);
      setMarcas([...marcas, newMarca]);
      setShowFormModal(false);
      showToast(`Marca "${newMarca.nombre}" creada exitosamente`, 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear marca';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Actualizar marca
  const handleUpdate = async (data: CreateMarcaDto) => {
    if (!selectedMarca) return;

    try {
      setIsSubmitting(true);
      setError('');
      const updated = await updateMarca(selectedMarca.id, data);
      setMarcas(
        marcas.map((m) => (m.id === updated.id ? updated : m))
      );
      setShowFormModal(false);
      setSelectedMarca(undefined);
      showToast(`Marca "${updated.nombre}" actualizada exitosamente`, 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar marca';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Eliminar marca
  const handleDelete = (marca: Marca) => {
    setSelectedMarca(marca);
    setShowDeleteModal(true);
  };

  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    if (!selectedMarca) return;

    try {
      setIsDeleting(true);
      setError('');
      await deleteMarca(selectedMarca.id);
      setMarcas(marcas.filter((m) => m.id !== selectedMarca.id));
      setShowDeleteModal(false);
      showToast(`Marca "${selectedMarca.nombre}" eliminada exitosamente`, 'success');
      setSelectedMarca(undefined);
    } catch (err) {
      let errorMessage = 'Error al eliminar marca';
      
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
  const handleEditClick = (marca: Marca) => {
    setSelectedMarca(marca);
    setShowFormModal(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setShowFormModal(false);
    setSelectedMarca(undefined);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Marcas</h1>
            <p className="mt-1 text-slate-400">
              {filteredMarcas.length} de {marcas.length} marcas
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedMarca(undefined);
              setShowFormModal(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Nueva Marca
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
            placeholder="Buscar marcas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Contenido */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-400">Cargando marcas...</p>
        </div>
      ) : filteredMarcas.length === 0 ? (
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-12 text-center">
          <p className="text-slate-400">
            {searchTerm
              ? 'No se encontraron marcas'
              : 'No hay marcas. Crea una para empezar.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMarcas.map((marca) => (
            <MarcaCard
              key={marca.id}
              marca={marca}
              onView={handleViewProductos}
              onEdit={handleEditClick}
              onDelete={() => handleDelete(marca)}
            />
          ))}
        </div>
      )}

      {/* Modales */}
      <MarcaModal
        isOpen={showFormModal}
        marca={selectedMarca}
        onClose={handleCloseModal}
        onSubmit={selectedMarca ? handleUpdate : handleCreate}
        isLoading={isSubmitting}
      />

      <MarcaProductosModal
        isOpen={showProductosModal}
        marca={marcaConProductos}
        onClose={() => {
          setShowProductosModal(false);
          setMarcaConProductos(undefined);
        }}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        brandName={selectedMarca?.nombre || ''}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setSelectedMarca(undefined);
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
