import type { LoginResponse } from '@/types';
import { api } from './api';

export async function login(usuario: string, password: string) {
  const { data } = await api.post<LoginResponse>('/auth/login', {
    usuario,
    password,
  });
  return data;
}

export async function getProfile() {
  const { data } = await api.get('/auth/profile');
  return data;
}
