'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { ProductoForm } from './ProductoForm';
import { MediaUploader } from './MediaUploader';
import type { Producto } from '@/types';
import type { CreateProductoDto } from '@/services/productos.service';
import type { MediaProducto } from '@/services/media.service';
import { getMediaProducto } from '@/services/media.service';

interface ProductoFormModalProps {
  isOpen: boolean;
  producto?: Producto;
  onClose: () => void;
  onSubmit: (data: CreateProductoDto) => Promise<void>;
  isLoading?: boolean;
}

export function ProductoFormModal({
  isOpen,
  producto,
  onClose,
  onSubmit,
  isLoading = false,
}: ProductoFormModalProps) {
  const [mediaList, setMediaList] = useState<MediaProducto[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);

  useEffect(() => {
    if (isOpen && producto) {
      loadMedia();
    } else if (isOpen && !producto) {
      // Limpiar media al crear nuevo producto
      setMediaList([]);
    }
  }, [isOpen, producto]);

  const loadMedia = async () => {
    if (!producto) return;

    try {
      setLoadingMedia(true);
      const media = await getMediaProducto(producto.id);
      setMediaList(media);
    } catch (err) {
      console.error('Error al cargar media:', err);
    } finally {
      setLoadingMedia(false);
    }
  };

  if (!isOpen) return null;

  const initialData = producto
    ? {
        id: producto.id,
        nombre: producto.nombre,
        descripcion: producto.descripcion || undefined,
        precioCompra: producto.precioCompra,
        precioVenta: producto.precioVenta,
        stock: producto.stock,
        codigoBarra: producto.codigoBarra || undefined,
        idCategoria: producto.categoria.id,
        idMarca: producto.marca?.id,
        idUnidad: producto.unidad.id,
      }
    : undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-xl border border-slate-800 bg-slate-900 shadow-xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-6">
          <h2 className="text-xl font-bold text-white">
            {producto && initialData?.id
              ? 'Editar Producto'
              : producto
              ? 'Agregar Fotos al Producto'
              : 'Crear Nuevo Producto'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Formulario - Solo si es crear o editar existente */}
          {!producto || initialData?.id ? (
            <div>
              <h3 className="text-sm font-medium text-slate-300 mb-4">
                Información del Producto
              </h3>
              <ProductoForm
                initialData={initialData}
                onSubmit={onSubmit}
                onCancel={onClose}
                isLoading={isLoading}
              />
            </div>
          ) : null}

          {/* Media - Aparece siempre si hay producto (crear o editar) */}
          {producto && (
            <div className={initialData?.id ? '' : 'border-t border-slate-800 pt-6'}>
              <h3 className="text-sm font-medium text-slate-300 mb-4">
                Fotos y Videos
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Agrega fotos o videos para tu producto. Puedes subir múltiples archivos.
              </p>
              <MediaUploader
                idProducto={producto.id}
                mediaList={mediaList}
                onMediaAdded={(media) => setMediaList([...mediaList, media])}
                onMediaDeleted={(idMedia) =>
                  setMediaList(mediaList.filter((m) => m.id !== idMedia))
                }
                onMediaUpdated={(updated) =>
                  setMediaList(
                    mediaList.map((m) => ({
                      ...m,
                      esPrincipal: m.id === updated.id,
                    }))
                  )
                }
                isLoading={loadingMedia}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
