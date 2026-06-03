import type { Unidad } from '@/types';
import { api } from './api';

export interface CreateUnidadDto {
  nombre: string;
  abreviatura: string;
}

export interface UpdateUnidadDto extends Partial<CreateUnidadDto> {}

export async function getUnidades() {
  const { data } = await api.get<Unidad[]>('/unidades');
  return data;
}

export async function getUnidad(id: number) {
  const { data } = await api.get<Unidad>(`/unidades/${id}`);
  return data;
}

export async function createUnidad(dto: CreateUnidadDto) {
  const { data } = await api.post<Unidad>('/unidades', dto);
  return data;
}

export async function updateUnidad(id: number, dto: UpdateUnidadDto) {
  const { data } = await api.patch<Unidad>(`/unidades/${id}`, dto);
  return data;
}

export async function deleteUnidad(id: number) {
  await api.delete(`/unidades/${id}`);
}
