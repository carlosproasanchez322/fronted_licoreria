'use client';

import { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import type { Categoria } from '@/types';
import {
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
  getCategoria,
  type CreateCategoriaDto,
} from '@/services/categorias.service';
import { CategoriaCard } from './components/CategoriaCard';
import { CategoriaModal } from './components/CategoriaModal';
import { CategoriaProductosModal } from './components/CategoriaProductosModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { Toast, useToast } from '@/components/Toast';

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { toasts, showToast } = useToast();

  // Modales
  const [showFormModal, setShowFormModal] = useState(false);
  const [showProductosModal, setShowProductosModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | undefined>();
  const [categoriaConProductos, setCategoriaConProductos] = useState<Categoria | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadingProductos, setLoadingProductos] = useState(false);

  // Cargar categorías
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getCategorias();
      setCategorias(data);
    } catch (err) {
      setError('Error al cargar categorías');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar categorías
  const filteredCategorias = categorias.filter((c) =>
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ver productos de una categoría
  const handleViewProductos = async (categoria: Categoria) => {
    try {
      setLoadingProductos(true);
      const categoriaConDetalles = await getCategoria(categoria.id);
      setCategoriaConProductos(categoriaConDetalles);
      setShowProductosModal(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar productos';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoadingProductos(false);
    }
  };

  // Crear categoría
  const handleCreate = async (data: CreateCategoriaDto) => {
    try {
      setIsSubmitting(true);
      setError('');
      const newCategoria = await createCategoria(data);
      setCategorias([...categorias, newCategoria]);
      setShowFormModal(false);
      showToast(`Categoría "${newCategoria.nombre}" creada exitosamente`, 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear categoría';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Actualizar categoría
  const handleUpdate = async (data: CreateCategoriaDto) => {
    if (!selectedCategoria) return;

    try {
      setIsSubmitting(true);
      setError('');
      const updated = await updateCategoria(selectedCategoria.id, data);
      setCategorias(
        categorias.map((c) => (c.id === updated.id ? updated : c))
      );
      setShowFormModal(false);
      setSelectedCategoria(undefined);
      showToast(`Categoría "${updated.nombre}" actualizada exitosamente`, 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar categoría';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Eliminar categoría
  const handleDelete = (categoria: Categoria) => {
    setSelectedCategoria(categoria);
    setShowDeleteModal(true);
  };

  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    if (!selectedCategoria) return;

    try {
      setIsDeleting(true);
      setError('');
      await deleteCategoria(selectedCategoria.id);
      setCategorias(categorias.filter((c) => c.id !== selectedCategoria.id));
      setShowDeleteModal(false);
      showToast(`Categoría "${selectedCategoria.nombre}" eliminada exitosamente`, 'success');
      setSelectedCategoria(undefined);
    } catch (err) {
      let errorMessage = 'Error al eliminar categoría';
      
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
  const handleEditClick = (categoria: Categoria) => {
    setSelectedCategoria(categoria);
    setShowFormModal(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setShowFormModal(false);
    setSelectedCategoria(undefined);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Categorías</h1>
            <p className="mt-1 text-sm sm:text-base text-slate-400">
              {filteredCategorias.length} de {categorias.length} categorías
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategoria(undefined);
              setShowFormModal(true);
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">Nueva Categoría</span>
            <span className="sm:hidden">Nueva</span>
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
            placeholder="Buscar categorías..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Contenido */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-400">Cargando categorías...</p>
        </div>
      ) : filteredCategorias.length === 0 ? (
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6 sm:p-8 md:p-12 text-center">
          <p className="text-slate-400 text-sm sm:text-base">
            {searchTerm
              ? 'No se encontraron categorías'
              : 'No hay categorías. Crea una para empezar.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCategorias.map((categoria) => (
            <CategoriaCard
              key={categoria.id}
              categoria={categoria}
              onView={handleViewProductos}
              onEdit={handleEditClick}
              onDelete={() => handleDelete(categoria)}
            />
          ))}
        </div>
      )}

      {/* Modales */}
      <CategoriaModal
        isOpen={showFormModal}
        categoria={selectedCategoria}
        onClose={handleCloseModal}
        onSubmit={selectedCategoria ? handleUpdate : handleCreate}
        isLoading={isSubmitting}
      />

      <CategoriaProductosModal
        isOpen={showProductosModal}
        categoria={categoriaConProductos}
        onClose={() => {
          setShowProductosModal(false);
          setCategoriaConProductos(undefined);
        }}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        categoryName={selectedCategoria?.nombre || ''}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setSelectedCategoria(undefined);
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
