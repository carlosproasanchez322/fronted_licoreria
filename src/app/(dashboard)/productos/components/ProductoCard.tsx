'use client';

import { useEffect, useState } from 'react';
import { getMediaUrl } from '@/config/api';
import type { Producto } from '@/types';
import type { MediaProducto } from '@/services/media.service';
import { getMediaPrincipal } from '@/services/media.service';
import { Package, AlertCircle } from 'lucide-react';

interface ProductoCardProps {
  producto: Producto;
  onEdit: (producto: Producto) => void;
  onDelete: (id: number) => void;
  onView: (producto: Producto) => void;
}

export function ProductoCard({
  producto,
  onEdit,
  onDelete,
  onView,
}: ProductoCardProps) {
  const [mediaPrincipal, setMediaPrincipal] = useState<MediaProducto | null>(null);
  const [loadingMedia, setLoadingMedia] = useState(true);

  useEffect(() => {
    const loadMedia = async () => {
      try {
        const media = await getMediaPrincipal(producto.id);
        setMediaPrincipal(media);
      } catch (err) {
        console.error('Error al cargar media:', err);
      } finally {
        setLoadingMedia(false);
      }
    };

    loadMedia();
  }, [producto.id]);

  const margenGanancia = (
    ((producto.precioVenta - producto.precioCompra) / producto.precioCompra) *
    100
  ).toFixed(1);

  const stockBajo = producto.stock <= 5;

  return (
    <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900 transition-all">
      {/* Header con imagen */}
      <div className="relative h-40 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center overflow-hidden">
        {!loadingMedia && mediaPrincipal ? (
          mediaPrincipal.tipo === 'foto' ? (
            <img
              src={getMediaUrl(mediaPrincipal.url)}
              alt={producto.nombre}
              className="h-full w-full object-cover"
              onError={(e) => {
                // Fallback si la URL no funciona
                (e.target as HTMLImageElement).src = mediaPrincipal.url;
              }}
            />
          ) : (
            <div className="h-full w-full bg-slate-800 flex items-center justify-center">
              <span className="text-4xl">🎬</span>
            </div>
          )
        ) : (
          <>
            <div className="absolute inset-0 bg-slate-800/50" />
            <Package className="relative z-10 h-16 w-16 text-slate-600" />
          </>
        )}

        {/* Badge de stock bajo */}
        {stockBajo && (
          <div className="absolute top-2 right-2 z-20 flex items-center gap-1 rounded-full bg-red-500/90 px-2 py-1 text-xs font-medium text-white">
            <AlertCircle className="h-3 w-3" />
            Stock bajo
          </div>
        )}

        {/* Badge de margen */}
        <div className="absolute bottom-2 left-2 z-20 rounded-full bg-blue-500/90 px-2 py-1 text-xs font-medium text-white">
          {margenGanancia}% margen
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        {/* Nombre y código */}
        <div className="mb-3">
          <h3 className="font-semibold text-white truncate">{producto.nombre}</h3>
          {producto.codigoBarra && (
            <p className="text-xs text-slate-500 truncate">
              {producto.codigoBarra}
            </p>
          )}
        </div>

        {/* Categoría y Marca */}
        <div className="mb-3 flex flex-wrap gap-2">
          <span className="inline-block rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">
            {producto.categoria.nombre}
          </span>
          {producto.marca && (
            <span className="inline-block rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">
              {producto.marca.nombre}
            </span>
          )}
        </div>

        {/* Precios */}
        <div className="mb-3 space-y-1 border-t border-slate-800 pt-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Compra:</span>
            <span className="text-slate-300">
              S/ {producto.precioCompra.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Venta:</span>
            <span className="font-medium text-emerald-400">
              S/ {producto.precioVenta.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Stock */}
        <div className="mb-4 rounded-lg bg-slate-800/50 p-2 text-center">
          <p className="text-xs text-slate-400">Stock disponible</p>
          <p
            className={`text-lg font-bold ${
              stockBajo ? 'text-red-400' : 'text-emerald-400'
            }`}
          >
            {producto.stock} {producto.unidad.abreviatura}
          </p>
        </div>

        {/* Descripción */}
        {producto.descripcion && (
          <p className="mb-4 text-xs text-slate-400 line-clamp-2">
            {producto.descripcion}
          </p>
        )}

        {/* Botones */}
        <div className="flex gap-2">
          <button
            onClick={() => onView(producto)}
            className="flex-1 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors"
          >
            Ver
          </button>
          <button
            onClick={() => onEdit(producto)}
            className="flex-1 rounded-lg bg-blue-600/20 px-3 py-2 text-sm font-medium text-blue-400 hover:bg-blue-600/30 transition-colors"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(producto.id)}
            className="flex-1 rounded-lg bg-red-600/20 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-600/30 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
