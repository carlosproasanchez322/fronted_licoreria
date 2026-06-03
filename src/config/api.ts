// Configuración de la API
export const API_CONFIG = {
  // URL base del backend
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001',
  
  // URL para archivos estáticos (uploads)
  get UPLOADS_URL() {
    return `${this.BACKEND_URL}/uploads`;
  },
};

// Helper para construir URLs de media
export function getMediaUrl(relativePath: string): string {
  if (relativePath.startsWith('http')) {
    return relativePath;
  }
  return `${API_CONFIG.BACKEND_URL}${relativePath}`;
}
