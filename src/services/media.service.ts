import { api } from './api';

export interface MediaProducto {
  id: number;
  nombreArchivo: string;
  url: string;
  tipo: 'foto' | 'video';
  tamaño: number;
  mimeType: string;
  esPrincipal: boolean;
  createdAt: string;
}

export async function uploadMedia(
  idProducto: number,
  file: File,
  esPrincipal: boolean = false,
) {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await api.post<MediaProducto>(
    `/media/productos/${idProducto}/upload?principal=${esPrincipal}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return data;
}

export async function getMediaProducto(idProducto: number) {
  const { data } = await api.get<MediaProducto[]>(
    `/media/productos/${idProducto}`,
  );
  return data;
}

export async function getMediaPrincipal(idProducto: number) {
  const { data } = await api.get<MediaProducto | null>(
    `/media/productos/${idProducto}/principal`,
  );
  return data;
}

export async function setMediaPrincipal(idMedia: number, idProducto: number) {
  const { data } = await api.post<MediaProducto>(
    `/media/${idMedia}/principal?idProducto=${idProducto}`,
  );
  return data;
}

export async function deleteMedia(idMedia: number, idProducto: number) {
  await api.delete(`/media/${idMedia}?idProducto=${idProducto}`);
}

export async function deleteAllMediaProducto(idProducto: number) {
  await api.delete(`/media/productos/${idProducto}/all`);
}
