import { API_CONFIG } from '@/config/api';

export interface Usuario {
  idUsuario?: number;
  nombres: string;
  apellidos: string;
  usuario: string;
  estado: boolean;
  idRol: number;
  rol?: {
    idRol: number;
    nombre: string;
  };
}

export interface CreateUsuarioRequest {
  nombres: string;
  apellidos: string;
  usuario: string;
  password: string;
  idRol: number;
  estado?: boolean;
}

export interface UpdateUsuarioRequest {
  nombres?: string;
  apellidos?: string;
  usuario?: string;
  password?: string;
  idRol?: number;
  estado?: boolean;
}

class UsuariosService {
  private baseUrl = `${API_CONFIG.BACKEND_URL}/usuarios`;

  async getUsuarios(): Promise<Usuario[]> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${error}`);
    }
  }

  async getUsuario(id: number): Promise<Usuario> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error al obtener usuario: ${error}`);
    }
  }

  async createUsuario(data: CreateUsuarioRequest): Promise<Usuario> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error al crear usuario: ${error}`);
    }
  }

  async updateUsuario(
    id: number,
    data: UpdateUsuarioRequest
  ): Promise<Usuario> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error al actualizar usuario: ${error}`);
    }
  }

  async deleteUsuario(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getToken()}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Error al eliminar usuario: ${error}`);
    }
  }

  async getRoles(): Promise<Array<{ idRol: number; nombre: string }>> {
    try {
      const response = await fetch(`${this.baseUrl}/roles/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error al obtener roles: ${error}`);
    }
  }

  private getToken(): string {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('access_token') || '';
  }
}

export default new UsuariosService();
