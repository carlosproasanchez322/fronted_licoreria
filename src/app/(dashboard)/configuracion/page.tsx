'use client';

import { useState, useEffect } from 'react';
import { Settings, Moon, Sun, Save, Bell, Globe, Shield, LucideIcon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface BaseSetting {
  id: string;
  label: string;
  description: string;
  type: string;
}

interface ToggleSetting extends BaseSetting {
  type: 'toggle';
  value: boolean;
  onChange: (value: boolean) => void;
  icon?: LucideIcon;
}

interface SelectSetting extends BaseSetting {
  type: 'select';
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

interface NumberSetting extends BaseSetting {
  type: 'number';
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

type Setting = ToggleSetting | SelectSetting | NumberSetting;

export default function ConfiguracionPage() {
  const { darkMode, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('es');
  const [autoSave, setAutoSave] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Cargar configuración del localStorage al iniciar
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    const savedLanguage = localStorage.getItem('language');
    const savedAutoSave = localStorage.getItem('autoSave');

    if (savedNotifications !== null) setNotifications(savedNotifications === 'true');
    if (savedLanguage !== null) setLanguage(savedLanguage);
    if (savedAutoSave !== null) setAutoSave(savedAutoSave === 'true');
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    
    // Guardar todas las configuraciones
    localStorage.setItem('darkMode', darkMode.toString());
    localStorage.setItem('notifications', notifications.toString());
    localStorage.setItem('language', language);
    localStorage.setItem('autoSave', autoSave.toString());

    // Simular guardado
    setTimeout(() => {
      setIsSaving(false);
      // Aquí podrías mostrar un toast de éxito
    }, 500);
  };

  const configSections: Array<{
    title: string;
    icon: LucideIcon;
    settings: Setting[];
  }> = [
    {
      title: 'Apariencia',
      icon: Settings,
      settings: [
        {
          id: 'darkMode',
          label: 'Modo oscuro',
          description: 'Activar el tema oscuro para una mejor experiencia visual',
          type: 'toggle',
          value: darkMode,
          onChange: setTheme,
          icon: darkMode ? Moon : Sun,
        } as ToggleSetting,
      ],
    },
    {
      title: 'Notificaciones',
      icon: Bell,
      settings: [
        {
          id: 'notifications',
          label: 'Notificaciones del sistema',
          description: 'Recibir notificaciones sobre actividades importantes',
          type: 'toggle',
          value: notifications,
          onChange: setNotifications,
        } as ToggleSetting,
      ],
    },
    {
      title: 'General',
      icon: Globe,
      settings: [
        {
          id: 'language',
          label: 'Idioma',
          description: 'Selecciona el idioma de la interfaz',
          type: 'select',
          value: language,
          onChange: setLanguage,
          options: [
            { value: 'es', label: 'Español' },
            { value: 'en', label: 'English' },
          ],
        } as SelectSetting,
        {
          id: 'autoSave',
          label: 'Guardado automático',
          description: 'Guardar cambios automáticamente mientras trabajas',
          type: 'toggle',
          value: autoSave,
          onChange: setAutoSave,
        } as ToggleSetting,
      ],
    },
    {
      title: 'Seguridad',
      icon: Shield,
      settings: [
        {
          id: 'sessionTimeout',
          label: 'Tiempo de sesión',
          description: 'Tiempo de inactividad antes de cerrar sesión (minutos)',
          type: 'number',
          value: 30,
          onChange: () => {},
          min: 5,
          max: 120,
        } as NumberSetting,
      ],
    },
  ];

  // Para Tailwind v4, necesitamos usar variables CSS en lugar de clases dark:
  const darkModeStyles = darkMode ? {
    backgroundColor: '#0a0a0a',
    color: '#ededed',
    borderColor: '#1f2937',
    cardBackground: 'rgba(15, 23, 42, 0.5)',
    inputBackground: '#1f2937',
  } : {
    backgroundColor: '#ffffff',
    color: '#171717',
    borderColor: '#e5e7eb',
    cardBackground: 'rgba(243, 244, 246, 0.5)',
    inputBackground: '#ffffff',
  };

  return (
    <div className="p-6" style={{ backgroundColor: darkModeStyles.backgroundColor, color: darkModeStyles.color }}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Configuración</h1>
        <p className="mt-2 text-slate-600" style={{ color: darkMode ? '#94a3b8' : '#4b5563' }}>
          Personaliza la apariencia y comportamiento del sistema
        </p>
      </div>

      <div className="grid gap-6">
        {configSections.map((section) => {
          const SectionIcon = section.icon;
          return (
            <div
              key={section.title}
              className="rounded-2xl border"
              style={{ 
                borderColor: darkModeStyles.borderColor,
                backgroundColor: darkModeStyles.cardBackground
              }}
            >
              <div 
                className="border-b px-6 py-4"
                style={{ borderColor: darkModeStyles.borderColor }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                    <SectionIcon className="h-5 w-5 text-amber-500" />
                  </div>
                  <h2 className="text-lg font-semibold">
                    {section.title}
                  </h2>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  {section.settings.map((setting) => {
                    // Renderizar el icono de manera segura
                    const renderIcon = () => {
                      if (setting.type === 'toggle' && setting.icon) {
                        const Icon = setting.icon;
                        return (
                          <div 
                            className="flex h-8 w-8 items-center justify-center rounded-lg"
                            style={{ backgroundColor: darkMode ? '#1f2937' : '#e5e7eb' }}
                          >
                            <Icon className="h-4 w-4" style={{ color: darkMode ? '#94a3b8' : '#4b5563' }} />
                          </div>
                        );
                      }
                      return null;
                    };

                    return (
                      <div
                        key={setting.id}
                        className="flex items-center justify-between rounded-xl border p-4"
                        style={{ 
                          borderColor: darkModeStyles.borderColor,
                          backgroundColor: darkMode ? 'rgba(15, 23, 42, 0.3)' : 'rgba(243, 244, 246, 0.5)'
                        }}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            {renderIcon()}
                            <div>
                              <h3 className="font-medium">
                                {setting.label}
                              </h3>
                              <p className="mt-1 text-sm" style={{ color: darkMode ? '#94a3b8' : '#4b5563' }}>
                                {setting.description}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="ml-4">
                          {setting.type === 'toggle' && (
                            <button
                              onClick={() => setting.onChange(!setting.value)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                setting.value
                                  ? 'bg-amber-500'
                                  : 'bg-slate-300'
                              }`}
                              style={{ backgroundColor: setting.value ? '#f59e0b' : (darkMode ? '#374151' : '#d1d5db') }}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  setting.value ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          )}

                          {setting.type === 'select' && (
                            <select
                              value={setting.value}
                              onChange={(e) => setting.onChange(e.target.value)}
                              className="rounded-lg border px-3 py-2 text-sm"
                              style={{ 
                                borderColor: darkModeStyles.borderColor,
                                backgroundColor: darkModeStyles.inputBackground,
                                color: darkModeStyles.color
                              }}
                            >
                              {setting.options.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          )}

                          {setting.type === 'number' && (
                            <input
                              type="number"
                              value={setting.value}
                              onChange={(e) => setting.onChange(Number(e.target.value))}
                              min={setting.min}
                              max={setting.max}
                              className="w-24 rounded-lg border px-3 py-2 text-sm"
                              style={{ 
                                borderColor: darkModeStyles.borderColor,
                                backgroundColor: darkModeStyles.inputBackground,
                                color: darkModeStyles.color
                              }}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-medium text-white transition hover:bg-amber-600 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Guardar cambios
            </>
          )}
        </button>
      </div>
    </div>
  );
}