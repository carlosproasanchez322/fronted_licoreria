'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Usuario, CreateUsuarioRequest, UpdateUsuarioRequest } from '@/services/usuarios.service';

interface UsuarioFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUsuarioRequest | UpdateUsuarioRequest) => Promise<void>;
  usuario?: Usuario;
  roles: Array<{ idRol: number; nombre: string }>;
  isLoading?: boolean;
}

export default function UsuarioFormModal({
  isOpen,
  onClose,
  onSubmit,
  usuario,
  roles,
  isLoading = false,
}: UsuarioFormModalProps) {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    usuario: '',
    password: '',
    idRol: 0,
    estado: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (usuario) {
      setFormData({
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        usuario: usuario.usuario,
        password: '',
        idRol: usuario.idRol,
        estado: usuario.estado,
      });
    } else {
      setFormData({
        nombres: '',
        apellidos: '',
        usuario: '',
        password: '',
        idRol: roles[0]?.idRol || 0,
        estado: true,
      });
    }
    setErrors({});
  }, [usuario, roles, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombres.trim()) {
      newErrors.nombres = 'Los nombres son requeridos';
    }

    if (!formData.apellidos.trim()) {
      newErrors.apellidos = 'Los apellidos son requeridos';
    }

    if (!formData.usuario.trim()) {
      newErrors.usuario = 'El usuario es requerido';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.usuario)) {
      newErrors.usuario = 'Usuario solo puede contener letras, números, guiones y guiones bajos';
    }

    if (!usuario && !formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida para nuevos usuarios';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.idRol) {
      newErrors.idRol = 'El rol es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const data = usuario
        ? ({
            nombres: formData.nombres,
            apellidos: formData.apellidos,
            usuario: formData.usuario,
            idRol: formData.idRol,
            estado: formData.estado,
            ...(formData.password && { password: formData.password }),
          } as UpdateUsuarioRequest)
        : (formData as CreateUsuarioRequest);

      await onSubmit(data);
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      setErrors({ submit: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  if (!isOpen) return null;

  const isEditing = !!usuario;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md rounded-lg border border-slate-800 bg-slate-900 p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting || isLoading}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Error general */}
        {errors.submit && (
          <div className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {errors.submit}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombres */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              Nombres
            </label>
            <input
              type="text"
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              disabled={isSubmitting || isLoading}
              className={`w-full rounded-lg border bg-slate-800 px-3 py-2 text-white placeholder-slate-500 focus:outline-none transition-colors ${
                errors.nombres ? 'border-red-500' : 'border-slate-700 focus:border-blue-500'
              }`}
              placeholder="Ej: Juan"
            />
            {errors.nombres && (
              <p className="mt-1 text-xs text-red-400">{errors.nombres}</p>
            )}
          </div>

          {/* Apellidos */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              Apellidos
            </label>
            <input
              type="text"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              disabled={isSubmitting || isLoading}
              className={`w-full rounded-lg border bg-slate-800 px-3 py-2 text-white placeholder-slate-500 focus:outline-none transition-colors ${
                errors.apellidos ? 'border-red-500' : 'border-slate-700 focus:border-blue-500'
              }`}
              placeholder="Ej: Pérez García"
            />
            {errors.apellidos && (
              <p className="mt-1 text-xs text-red-400">{errors.apellidos}</p>
            )}
          </div>

          {/* Usuario */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              Usuario (username)
            </label>
            <input
              type="text"
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
              disabled={isSubmitting || isLoading || isEditing}
              className={`w-full rounded-lg border bg-slate-800 px-3 py-2 text-white placeholder-slate-500 focus:outline-none transition-colors ${
                errors.usuario ? 'border-red-500' : 'border-slate-700 focus:border-blue-500'
              } ${isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="Ej: juan_perez"
            />
            {errors.usuario && (
              <p className="mt-1 text-xs text-red-400">{errors.usuario}</p>
            )}
            {isEditing && (
              <p className="mt-1 text-xs text-slate-400">No se puede cambiar el usuario</p>
            )}
          </div>

          {/* Email */}
          {/* Email field removed - not in database */}

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              Contraseña {isEditing && '(dejar en blanco para no cambiar)'}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={isSubmitting || isLoading}
              className={`w-full rounded-lg border bg-slate-800 px-3 py-2 text-white placeholder-slate-500 focus:outline-none transition-colors ${
                errors.password ? 'border-red-500' : 'border-slate-700 focus:border-blue-500'
              }`}
              placeholder={isEditing ? 'Dejar en blanco para no cambiar' : 'Mínimo 6 caracteres'}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-400">{errors.password}</p>
            )}
          </div>

          {/* Rol */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              Rol
            </label>
            <select
              name="idRol"
              value={formData.idRol}
              onChange={handleChange}
              disabled={isSubmitting || isLoading}
              className={`w-full rounded-lg border bg-slate-800 px-3 py-2 text-white focus:outline-none transition-colors ${
                errors.idRol ? 'border-red-500' : 'border-slate-700 focus:border-blue-500'
              }`}
            >
              <option value={0}>Seleccionar rol</option>
              {roles.map((rol) => (
                <option key={rol.idRol} value={rol.idRol}>
                  {rol.nombre}
                </option>
              ))}
            </select>
            {errors.idRol && (
              <p className="mt-1 text-xs text-red-400">{errors.idRol}</p>
            )}
          </div>

          {/* Estado */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="estado"
              name="estado"
              checked={formData.estado}
              onChange={handleChange}
              disabled={isSubmitting || isLoading}
              className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="estado" className="text-sm font-medium text-slate-200">
              Usuario activo
            </label>
          </div>

          {/* Botones */}
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting || isLoading}
              className="flex-1 rounded-lg border border-slate-700 px-4 py-2 font-medium text-slate-200 hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
