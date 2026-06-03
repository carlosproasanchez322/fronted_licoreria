'use client';

import { useState, useEffect } from 'react';
import { Shield, Database, Eye, Trash2, Download, Lock, Bell, Users, Globe, FileText } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import Link from 'next/link';

export default function PoliticaPrivacidadPage() {
  const { darkMode } = useTheme();
  const [consent, setConsent] = useState({
    essential: true,
    analytics: false,
    marketing: false
  });

  // Cargar preferencias de consentimiento
  useEffect(() => {
    const savedConsent = localStorage.getItem('privacyConsent');
    if (savedConsent) {
      setConsent(JSON.parse(savedConsent));
    }
  }, []);

  const handleConsentChange = (key: keyof typeof consent) => {
    const newConsent = { ...consent, [key]: !consent[key] };
    setConsent(newConsent);
    localStorage.setItem('privacyConsent', JSON.stringify(newConsent));
  };

  const handleAcceptAll = () => {
    const allConsent = { essential: true, analytics: true, marketing: true };
    setConsent(allConsent);
    localStorage.setItem('privacyConsent', JSON.stringify(allConsent));
  };

  const handleEssentialOnly = () => {
    const essentialConsent = { essential: true, analytics: false, marketing: false };
    setConsent(essentialConsent);
    localStorage.setItem('privacyConsent', JSON.stringify(essentialConsent));
  };

  const darkModeStyles = darkMode ? {
    backgroundColor: '#0a0a0a',
    color: '#ededed',
    borderColor: '#1f2937',
    cardBackground: 'rgba(15, 23, 42, 0.5)',
    accentColor: '#f59e0b',
  } : {
    backgroundColor: '#ffffff',
    color: '#171717',
    borderColor: '#e5e7eb',
    cardBackground: 'rgba(243, 244, 246, 0.5)',
    accentColor: '#d97706',
  };

  const privacySections = [
    {
      title: 'Información que Recopilamos',
      icon: Database,
      content: `Recopilamos diferentes tipos de información para proporcionar y mejorar nuestro servicio:

      1. Información Personal
         • Nombre completo y datos de contacto
         • Información de la empresa (nombre, dirección, RUC)
         • Credenciales de acceso (email, contraseña encriptada)

      2. Datos del Negocio
         • Información de inventario y productos
         • Registros de ventas y transacciones
         • Datos de clientes y proveedores
         • Información financiera y contable

      3. Datos Técnicos
         • Dirección IP y tipo de dispositivo
         • Navegador y sistema operativo
         • Registros de actividad y errores
         • Cookies y tecnologías similares`
    },
    {
      title: 'Cómo Usamos su Información',
      icon: Eye,
      content: `Utilizamos la información recopilada para los siguientes propósitos:

      • Proporcionar y mantener el servicio
      • Gestionar su cuenta y acceso al sistema
      • Procesar transacciones y generar facturas
      • Mejorar la funcionalidad y experiencia del usuario
      • Enviar notificaciones importantes del sistema
      • Prevenir fraudes y actividades no autorizadas
      • Cumplir con obligaciones legales y regulatorias

      No vendemos ni alquilamos su información personal a terceros.`
    },
    {
      title: 'Protección de Datos',
      icon: Lock,
      content: `Implementamos medidas de seguridad robustas para proteger sus datos:

      🔒 Encriptación de extremo a extremo
      🔒 Autenticación de múltiples factores
      🔒 Firewalls y sistemas de detección de intrusiones
      🔒 Copias de seguridad regulares y redundantes
      🔒 Acceso restringido al personal autorizado
      🔒 Auditorías de seguridad periódicas

      A pesar de nuestras medidas, ningún sistema es 100% seguro. Le recomendamos mantener sus credenciales en secreto y utilizar contraseñas fuertes.`
    },
    {
      title: 'Compartición de Información',
      icon: Users,
      content: `Compartimos información solo en las siguientes circunstancias:

      • Con proveedores de servicios esenciales (hosting, pagos)
      • Para cumplir con requerimientos legales o regulatorios
      • Para proteger nuestros derechos, propiedad o seguridad
      • Con su consentimiento explícito

      Los proveedores de servicios están obligados por contrato a mantener la confidencialidad y solo pueden usar la información para los fines específicos del servicio.`
    },
    {
      title: 'Sus Derechos',
      icon: Shield,
      content: `Usted tiene los siguientes derechos sobre sus datos:

      ✅ Derecho de acceso: Solicitar copia de sus datos personales
      ✅ Derecho de rectificación: Corregir información inexacta
      ✅ Derecho de eliminación: Solicitar borrado de sus datos
      ✅ Derecho de oposición: Oponerse al procesamiento de datos
      ✅ Derecho de portabilidad: Recibir sus datos en formato estructurado
      ✅ Derecho de retiro: Retirar su consentimiento en cualquier momento

      Para ejercer estos derechos, contacte a nuestro equipo de privacidad.`
    },
    {
      title: 'Retención de Datos',
      icon: Trash2,
      content: `Mantenemos sus datos durante el tiempo necesario:

      • Datos de cuenta: Mientras su cuenta esté activa
      • Registros de transacciones: 5 años (requisito legal)
      • Datos de inventario: Hasta que sean eliminados
      • Registros de actividad: 1 año para fines de seguridad
      • Información de contacto: Hasta que solicite eliminación

      Los datos se eliminan de forma segura cuando ya no son necesarios o cuando usted lo solicita.`
    },
    {
      title: 'Cookies y Tecnologías Similares',
      icon: Globe,
      content: `Utilizamos cookies y tecnologías similares para:

      • Mantener su sesión activa
      • Recordar sus preferencias
      • Analizar el uso del sistema
      • Mejorar el rendimiento

      Tipos de cookies que utilizamos:
      
      🍪 Esenciales: Necesarias para el funcionamiento básico
      🍪 Funcionales: Mejoran la experiencia del usuario
      🍪 Analíticas: Nos ayudan a entender cómo se usa el sistema

      Puede controlar las cookies a través de la configuración de su navegador.`
    },
    {
      title: 'Cambios en la Política',
      icon: FileText,
      content: `Podemos actualizar esta Política de Privacidad periódicamente. Le notificaremos sobre cambios significativos mediante:

      • Notificación dentro del sistema
      • Email a la dirección registrada
      • Publicación en nuestro sitio web

      Fecha de entrada en vigor: ${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}

      El uso continuado del sistema después de los cambios constituye aceptación de la política actualizada.`
    }
  ];

  const consentTypes = [
    {
      id: 'essential',
      label: 'Cookies Esenciales',
      description: 'Necesarias para el funcionamiento básico del sistema. No se pueden desactivar.',
      required: true,
      icon: Lock
    },
    {
      id: 'analytics',
      label: 'Cookies Analíticas',
      description: 'Nos ayudan a entender cómo se usa el sistema para mejorarlo.',
      required: false,
      icon: Eye
    },
    {
      id: 'marketing',
      label: 'Cookies de Marketing',
      description: 'Utilizadas para mostrar contenido relevante y ofertas.',
      required: false,
      icon: Bell
    }
  ];

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: darkModeStyles.backgroundColor, color: darkModeStyles.color }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
            <Shield className="h-8 w-8" style={{ color: darkModeStyles.accentColor }} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Política de Privacidad</h1>
          <p className="text-lg" style={{ color: darkMode ? '#94a3b8' : '#4b5563' }}>
            Sistema de Gestión de Licorería POS
          </p>
          <p className="mt-2 text-sm" style={{ color: darkMode ? '#64748b' : '#6b7280' }}>
            Comprometidos con la protección de sus datos
          </p>
        </div>

        {/* Resumen Ejecutivo */}
        <div 
          className="rounded-2xl border p-6 mb-8"
          style={{ 
            borderColor: darkModeStyles.borderColor,
            backgroundColor: darkModeStyles.cardBackground
          }}
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                <Shield className="h-6 w-6" style={{ color: darkModeStyles.accentColor }} />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Nuestro Compromiso</h2>
              <p className="leading-relaxed">
                En Sistema de Gestión de Licorería POS, valoramos y respetamos su privacidad. Esta política describe cómo recopilamos, usamos, protegemos y compartimos su información cuando utiliza nuestro sistema de gestión empresarial.
              </p>
            </div>
          </div>
        </div>

        {/* Secciones de Privacidad */}
        <div className="space-y-6 mb-12">
          {privacySections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div
                key={index}
                className="rounded-2xl border overflow-hidden"
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
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                      <Icon className="h-5 w-5" style={{ color: darkModeStyles.accentColor }} />
                    </div>
                    <h2 className="text-xl font-semibold">
                      {section.title}
                    </h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="prose prose-lg max-w-none" style={{ color: darkMode ? '#d1d5db' : '#374151' }}>
                    <pre className="whitespace-pre-wrap font-sans leading-relaxed">
                      {section.content}
                    </pre>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Gestión de Consentimiento */}
        <div 
          className="rounded-2xl border p-6 mb-8"
          style={{ 
            borderColor: darkModeStyles.borderColor,
            backgroundColor: darkModeStyles.cardBackground
          }}
        >
          <h3 className="text-xl font-semibold mb-6">Preferencias de Privacidad</h3>
          
          <div className="space-y-4 mb-6">
            {consentTypes.map((type) => {
              const Icon = type.icon;
              return (
                <div
                  key={type.id}
                  className="flex items-center justify-between p-4 rounded-xl border"
                  style={{ 
                    borderColor: darkModeStyles.borderColor,
                    backgroundColor: darkMode ? 'rgba(15, 23, 42, 0.3)' : 'rgba(243, 244, 246, 0.5)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: darkMode ? '#1f2937' : '#e5e7eb' }}>
                      <Icon className="h-5 w-5" style={{ color: darkMode ? '#94a3b8' : '#4b5563' }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{type.label}</h4>
                        {type.required && (
                          <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: darkModeStyles.accentColor }}>
                            Requerido
                          </span>
                        )}
                      </div>
                      <p className="text-sm mt-1" style={{ color: darkMode ? '#94a3b8' : '#4b5563' }}>
                        {type.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {type.required ? (
                      <span className="text-sm" style={{ color: darkMode ? '#94a3b8' : '#4b5563' }}>Siempre activo</span>
                    ) : (
                      <button
                        onClick={() => handleConsentChange(type.id as keyof typeof consent)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          consent[type.id as keyof typeof consent]
                            ? 'bg-amber-500'
                            : 'bg-slate-300'
                        }`}
                        style={{ backgroundColor: consent[type.id as keyof typeof consent] ? darkModeStyles.accentColor : (darkMode ? '#374151' : '#d1d5db') }}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            consent[type.id as keyof typeof consent] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleAcceptAll}
              className="px-5 py-2 rounded-lg font-medium transition"
              style={{ 
                backgroundColor: darkModeStyles.accentColor,
                color: '#ffffff'
              }}
            >
              Aceptar Todas
            </button>
            <button
              onClick={handleEssentialOnly}
              className="px-5 py-2 rounded-lg font-medium border transition hover:opacity-80"
              style={{ 
                borderColor: darkModeStyles.borderColor,
                color: darkModeStyles.color
              }}
            >
              Solo Esenciales
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('privacyConsent');
                setConsent({ essential: true, analytics: false, marketing: false });
              }}
              className="px-5 py-2 rounded-lg font-medium border transition hover:opacity-80"
              style={{ 
                borderColor: darkModeStyles.borderColor,
                color: darkModeStyles.color
              }}
            >
              Restablecer
            </button>
          </div>
        </div>

        {/* Información de Contacto */}
        <div 
          className="rounded-2xl border p-6 mb-8"
          style={{ 
            borderColor: darkModeStyles.borderColor,
            backgroundColor: darkModeStyles.cardBackground
          }}
        >
          <h3 className="text-xl font-semibold mb-4">Contacto y Ejercicio de Derechos</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2" style={{ color: darkModeStyles.accentColor }}>Oficial de Privacidad</h4>
              <p style={{ color: darkMode ? '#94a3b8' : '#4b5563' }}>privacy@licoreriados.com</p>
              <p style={{ color: darkMode ? '#94a3b8' : '#4b5563' }}>+1 (555) 987-6543</p>
              <p className="mt-2 text-sm" style={{ color: darkMode ? '#94a3b8' : '#4b5563' }}>
                Para solicitudes de acceso, rectificación o eliminación de datos
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2" style={{ color: darkModeStyles.accentColor }}>Autoridad Supervisora</h4>
              <p style={{ color: darkMode ? '#94a3b8' : '#4b5563' }}>Agencia de Protección de Datos</p>
              <p style={{ color: darkMode ? '#94a3b8' : '#4b5563' }}>www.autoridaddatos.gov</p>
              <p className="mt-2 text-sm" style={{ color: darkMode ? '#94a3b8' : '#4b5563' }}>
                Si tiene una queja sobre el manejo de sus datos
              </p>
            </div>
          </div>
        </div>

        {/* Enlaces relacionados */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Link 
            href="/terminos"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition hover:opacity-80"
            style={{ 
              borderColor: darkModeStyles.borderColor,
              backgroundColor: darkMode ? '#1f2937' : '#f3f4f6',
              color: darkModeStyles.color
            }}
          >
            <FileText className="h-4 w-4" />
            Términos y Condiciones
          </Link>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition hover:opacity-80"
            style={{ 
              borderColor: darkModeStyles.borderColor,
              backgroundColor: darkMode ? '#1f2937' : '#f3f4f6',
              color: darkModeStyles.color
            }}
          >
            ← Volver al inicio
          </Link>
          <button
            onClick={() => {
              const data = {
                consent: consent,
                timestamp: new Date().toISOString(),
                policyVersion: '1.0'
              };
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'preferencias-privacidad.json';
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition hover:opacity-80"
            style={{ 
              borderColor: darkModeStyles.borderColor,
              backgroundColor: darkMode ? '#1f2937' : '#f3f4f6',
              color: darkModeStyles.color
            }}
          >
            <Download className="h-4 w-4" />
            Descargar Preferencias
          </button>
        </div>

        {/* Aviso Final */}
        <div 
          className="rounded-2xl border p-6 text-center"
          style={{ 
            borderColor: darkModeStyles.borderColor,
            backgroundColor: darkModeStyles.cardBackground
          }}
        >
          <p className="text-lg font-medium mb-2">Gracias por confiar en nosotros</p>
          <p style={{ color: darkMode ? '#94a3b8' : '#4b5563' }}>
            Su privacidad es nuestra prioridad. Continuaremos trabajando para proteger sus datos y mantener su confianza.
          </p>
        </div>
      </div>
    </div>
  );
}