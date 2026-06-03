import type { Categoria } from '@/types';
import { api } from './api';

export interface CreateCategoriaDto {
  nombre: string;
  descripcion?: string;
}

export interface UpdateCategoriaDto extends Partial<CreateCategoriaDto> {}

export async function getCategorias() {
  const { data } = await api.get<Categoria[]>('/categorias');
  return data;
}

export async function getCategoria(id: number) {
  const { data } = await api.get<Categoria>(`/categorias/${id}`);
  return data;
}

export async function createCategoria(dto: CreateCategoriaDto) {
  const { data } = await api.post<Categoria>('/categorias', dto);
  return data;
}

export async function updateCategoria(id: number, dto: UpdateCategoriaDto) {
  const { data } = await api.patch<Categoria>(`/categorias/${id}`, dto);
  return data;
}

export async function deleteCategoria(id: number) {
  await api.delete(`/categorias/${id}`);
}
