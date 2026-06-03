'use client';

import { useState, useEffect } from 'react';
import { FileText, Shield, UserCheck, Lock, AlertTriangle, CheckCircle } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import Link from 'next/link';

export default function TerminosPage() {
  const { darkMode } = useTheme();
  const [accepted, setAccepted] = useState(false);

  // Verificar si el usuario ya aceptó los términos
  useEffect(() => {
    const hasAccepted = localStorage.getItem('termsAccepted') === 'true';
    setAccepted(hasAccepted);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('termsAccepted', 'true');
    setAccepted(true);
    // Redirigir al dashboard o página anterior
    window.history.back();
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

  const sections = [
    {
      title: 'Aceptación de Términos',
      icon: CheckCircle,
      content: `Al acceder y utilizar el Sistema de Gestión de Licorería POS, usted acepta cumplir y estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, no podrá utilizar nuestro servicio.`
    },
    {
      title: 'Uso del Servicio',
      icon: UserCheck,
      content: `El sistema está diseñado exclusivamente para la gestión de inventario, ventas y administración de licorerías. Usted se compromete a:
      
      1. Utilizar el sistema únicamente para fines legítimos de negocio
      2. No realizar actividades fraudulentas o ilegales
      3. Mantener la confidencialidad de sus credenciales de acceso
      4. Reportar cualquier uso no autorizado de su cuenta
      
      Nos reservamos el derecho de suspender o terminar el acceso al sistema si se detecta violación de estos términos.`
    },
    {
      title: 'Propiedad Intelectual',
      icon: Shield,
      content: `Todo el contenido, diseño, código fuente, logotipos y marcas registradas del Sistema de Licorería POS son propiedad exclusiva de la empresa. Usted no puede:
      
      • Copiar, modificar o distribuir el software sin autorización
      • Realizar ingeniería inversa del sistema
      • Utilizar el contenido para fines comerciales no autorizados
      • Crear trabajos derivados basados en nuestro sistema
      
      Se otorga una licencia limitada, no exclusiva y no transferible para usar el sistema según estos términos.`
    },
    {
      title: 'Privacidad y Datos',
      icon: Lock,
      content: `Nos comprometemos a proteger su privacidad y los datos de su negocio. Consulte nuestra Política de Privacidad para más detalles sobre:
      
      • Cómo recopilamos y usamos la información
      • Medidas de seguridad implementadas
      • Sus derechos sobre sus datos personales
      • Retención y eliminación de datos
      
      Los datos de inventario, ventas y clientes son propiedad del usuario y se mantienen confidenciales.`
    },
    {
      title: 'Limitación de Responsabilidad',
      icon: AlertTriangle,
      content: `El sistema se proporciona "tal cual" y "según disponibilidad". No garantizamos:
      
      • Disponibilidad ininterrumpida del servicio
      • Ausencia de errores o interrupciones
      • Exactitud absoluta de los cálculos
      • Compatibilidad con todos los dispositivos o navegadores
      
      En ningún caso seremos responsables por daños indirectos, incidentales o consecuentes derivados del uso del sistema.`
    },
    {
      title: 'Modificaciones',
      icon: FileText,
      content: `Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación en el sistema. Se le notificará sobre cambios significativos.
      
      Es su responsabilidad revisar periódicamente estos términos. El uso continuado del sistema después de los cambios constituye aceptación de los mismos.`
    }
  ];

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: darkModeStyles.backgroundColor, color: darkModeStyles.color }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
            <FileText className="h-8 w-8" style={{ color: darkModeStyles.accentColor }} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Términos y Condiciones</h1>
          <p className="text-lg" style={{ color: darkMode ? '#94a3b8' : '#4b5563' }}>
            Sistema de Gestión de Licorería POS
          </p>
          <p className="mt-2 text-sm" style={{ color: darkMode ? '#64748b' : '#6b7280' }}>
            Última actualización: {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Introducción */}
        <div 
          className="rounded-2xl border p-6 mb-8"
          style={{ 
            borderColor: darkModeStyles.borderColor,
            backgroundColor: darkModeStyles.cardBackground
          }}
        >
          <p className="text-lg leading-relaxed">
            Bienvenido al Sistema de Gestión de Licorería POS. Estos Términos y Condiciones establecen las reglas y pautas para el uso de nuestro sistema de gestión empresarial. Le recomendamos leer detenidamente este documento antes de utilizar nuestros servicios.
          </p>
        </div>

        {/* Secciones de Términos */}
        <div className="space-y-6 mb-12">
          {sections.map((section, index) => {
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

        {/* Información de Contacto */}
        <div 
          className="rounded-2xl border p-6 mb-8"
          style={{ 
            borderColor: darkModeStyles.borderColor,
            backgroundColor: darkModeStyles.cardBackground
          }}
        >
          <h3 className="text-xl font-semibold mb-4">Información de Contacto</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2" style={{ color: darkModeStyles.accentColor }}>Soporte Técnico</h4>
              <p style={{ color: darkMode ? '#94a3b8' : '#4b5563' }}>soporte@licoreriados.com</p>
              <p style={{ color: darkMode ? '#94a3b8' : '#4b5563' }}>+1 (555) 123-4567</p>
            </div>
            <div>
              <h4 className="font-medium mb-2" style={{ color: darkModeStyles.accentColor }}>Atención Legal</h4>
              <p style={{ color: darkMode ? '#94a3b8' : '#4b5563' }}>legal@licoreriados.com</p>
              <p style={{ color: darkMode ? '#94a3b8' : '#4b5563' }}>Lunes a Viernes, 9:00 - 18:00</p>
            </div>
          </div>
        </div>

        {/* Enlaces relacionados */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Link 
            href="/politica-privacidad"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition hover:opacity-80"
            style={{ 
              borderColor: darkModeStyles.borderColor,
              backgroundColor: darkMode ? '#1f2937' : '#f3f4f6',
              color: darkModeStyles.color
            }}
          >
            <Shield className="h-4 w-4" />
            Política de Privacidad
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
        </div>

        {/* Aceptación de Términos */}
        {!accepted && (
          <div 
            className="rounded-2xl border p-6 sticky bottom-4"
            style={{ 
              borderColor: darkModeStyles.borderColor,
              backgroundColor: darkModeStyles.cardBackground,
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold mb-1">¿Acepta los Términos y Condiciones?</h3>
                <p className="text-sm" style={{ color: darkMode ? '#94a3b8' : '#4b5563' }}>
                  Para continuar utilizando el sistema, debe aceptar nuestros términos
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAccept}
                  className="px-6 py-3 rounded-xl font-medium transition"
                  style={{ 
                    backgroundColor: darkModeStyles.accentColor,
                    color: '#ffffff'
                  }}
                >
                  Aceptar Términos
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="px-6 py-3 rounded-xl font-medium border transition hover:opacity-80"
                  style={{ 
                    borderColor: darkModeStyles.borderColor,
                    color: darkModeStyles.color
                  }}
                >
                  Rechazar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}