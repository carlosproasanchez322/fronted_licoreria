'use client';

import { useState, useRef } from 'react';
import { Upload, X, Star, Trash2, Play, AlertCircle } from 'lucide-react';
import { getMediaUrl } from '@/config/api';
import type { MediaProducto } from '@/services/media.service';
import {
  uploadMedia,
  deleteMedia,
  setMediaPrincipal,
} from '@/services/media.service';

interface MediaUploaderProps {
  idProducto: number;
  mediaList: MediaProducto[];
  onMediaAdded: (media: MediaProducto) => void;
  onMediaDeleted: (idMedia: number) => void;
  onMediaUpdated?: (media: MediaProducto) => void;
  isLoading?: boolean;
}

interface UploadProgress {
  [key: string]: number;
}

export function MediaUploader({
  idProducto,
  mediaList,
  onMediaAdded,
  onMediaDeleted,
  onMediaUpdated,
  isLoading = false,
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      setError('');

      // Procesar múltiples archivos
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileKey = `${file.name}-${i}`;

        try {
          // Mostrar progreso
          setUploadProgress((prev) => ({ ...prev, [fileKey]: 0 }));

          // Determinar si es principal (solo el primero si no hay media)
          const esPrincipal = mediaList.length === 0 && i === 0;

          // Subir archivo
          const media = await uploadMedia(idProducto, file, esPrincipal);
          onMediaAdded(media);

          // Actualizar progreso
          setUploadProgress((prev) => ({ ...prev, [fileKey]: 100 }));

          // Limpiar progreso después de 1 segundo
          setTimeout(() => {
            setUploadProgress((prev) => {
              const newProgress = { ...prev };
              delete newProgress[fileKey];
              return newProgress;
            });
          }, 1000);
        } catch (err) {
          setError(
            `Error al subir ${file.name}: ${
              err instanceof Error ? err.message : 'Error desconocido'
            }`
          );
        }
      }

      // Limpiar input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (idMedia: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este archivo?')) return;

    try {
      setError('');
      await deleteMedia(idMedia, idProducto);
      onMediaDeleted(idMedia);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    }
  };

  const handleSetPrincipal = async (idMedia: number) => {
    try {
      setError('');
      const updated = await setMediaPrincipal(idMedia, idProducto);
      if (onMediaUpdated) {
        onMediaUpdated(updated);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar');
    }
  };

  const hasUploadProgress = Object.keys(uploadProgress).length > 0;

  return (
    <div className="space-y-4">
      {/* Errores */}
      {error && (
        <div className="rounded-lg bg-red-500/10 px-4 py-3 text-red-400 text-sm flex items-start gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Área de carga - Drag and Drop */}
      <div
        className="rounded-lg border-2 border-dashed border-slate-700 bg-slate-900/50 p-8 text-center hover:border-blue-500 hover:bg-slate-900 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.classList.add('border-blue-500', 'bg-slate-900');
        }}
        onDragLeave={(e) => {
          e.currentTarget.classList.remove('border-blue-500', 'bg-slate-900');
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove('border-blue-500', 'bg-slate-900');
          if (e.dataTransfer.files) {
            fileInputRef.current!.files = e.dataTransfer.files;
            handleFileSelect({
              target: { files: e.dataTransfer.files },
            } as React.ChangeEvent<HTMLInputElement>);
          }
        }}
      >
        <Upload className="mx-auto h-10 w-10 text-slate-400 mb-3" />
        <p className="text-sm font-medium text-slate-300">
          Arrastra archivos aquí o haz clic para seleccionar
        </p>
        <p className="text-xs text-slate-500 mt-2">
          Puedes subir múltiples fotos o videos
        </p>
        <p className="text-xs text-slate-600 mt-1">
          JPG, PNG, WebP, MP4, WebM (máximo 50MB cada uno)
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
          onChange={handleFileSelect}
          disabled={uploading || isLoading}
          multiple
          className="hidden"
        />
      </div>

      {/* Progreso de carga */}
      {hasUploadProgress && (
        <div className="space-y-2">
          {Object.entries(uploadProgress).map(([fileKey, progress]) => (
            <div key={fileKey} className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span className="truncate">{fileKey.split('-')[0]}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {uploading && !hasUploadProgress && (
        <div className="rounded-lg bg-blue-500/10 px-4 py-3 text-blue-400 text-sm flex items-center gap-2">
          <div className="h-4 w-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
          Procesando archivos...
        </div>
      )}

      {/* Galería de media */}
      {mediaList.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-slate-300 mb-3">
            Archivos ({mediaList.length})
          </h4>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {mediaList.map((media) => (
              <div
                key={media.id}
                className="group relative rounded-lg overflow-hidden bg-slate-800 border border-slate-700 hover:border-slate-600 transition-colors"
              >
                {/* Preview */}
                {media.tipo === 'foto' ? (
                  <img
                    src={getMediaUrl(media.url)}
                    alt={media.nombreArchivo}
                    className="h-32 w-full object-cover"
                    onError={(e) => {
                      // Fallback si la URL no funciona
                      (e.target as HTMLImageElement).src = media.url;
                    }}
                  />
                ) : (
                  <div className="h-32 w-full bg-slate-900 flex items-center justify-center">
                    <Play className="h-8 w-8 text-slate-500" />
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {!media.esPrincipal && (
                    <button
                      onClick={() => handleSetPrincipal(media.id)}
                      className="rounded-lg bg-yellow-600 p-2 hover:bg-yellow-700 transition-colors"
                      title="Establecer como principal"
                    >
                      <Star className="h-4 w-4 text-white" />
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(media.id)}
                    className="rounded-lg bg-red-600 p-2 hover:bg-red-700 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4 text-white" />
                  </button>
                </div>

                {/* Badge principal */}
                {media.esPrincipal && (
                  <div className="absolute top-2 left-2 rounded-full bg-yellow-500 px-2 py-1 text-xs font-medium text-white flex items-center gap-1 z-10">
                    <Star className="h-3 w-3" />
                    Principal
                  </div>
                )}

                {/* Tipo */}
                <div className="absolute bottom-2 right-2 rounded-full bg-slate-900/80 px-2 py-1 text-xs font-medium text-slate-300">
                  {media.tipo === 'foto' ? '🖼️' : '🎬'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {mediaList.length === 0 && !uploading && !hasUploadProgress && (
        <p className="text-center text-sm text-slate-500 py-4">
          No hay archivos. Sube fotos o videos para empezar.
        </p>
      )}
    </div>
  );
}
