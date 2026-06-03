import type { Marca } from '@/types';
import { api } from './api';

export interface CreateMarcaDto {
  nombre: string;
}

export interface UpdateMarcaDto extends Partial<CreateMarcaDto> {}

export async function getMarcas() {
  const { data } = await api.get<Marca[]>('/marcas');
  return data;
}

export async function getMarca(id: number) {
  const { data } = await api.get<Marca>(`/marcas/${id}`);
  return data;
}

export async function createMarca(dto: CreateMarcaDto) {
  const { data } = await api.post<Marca>('/marcas', dto);
  return data;
}

export async function updateMarca(id: number, dto: UpdateMarcaDto) {
  const { data } = await api.patch<Marca>(`/marcas/${id}`, dto);
  return data;
}

export async function deleteMarca(id: number) {
  await api.delete(`/marcas/${id}`);
}
