import { useState } from 'react'
import { FaShieldAlt, FaHandshake, FaExclamationTriangle, FaUserShield, FaBook } from 'react-icons/fa'

export default function LegalPage() {
  const [activeSection, setActiveSection] = useState('terms')

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">📋 Información Legal</h1>
      <p className="text-gray-600 mb-6">Todo lo que necesitas saber para usar Trueque de forma segura</p>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
        {[
          { id: 'terms', title: 'Términos', icon: '📜' },
          { id: 'safety', title: 'Seguridad', icon: '🛡️' },
          { id: 'tips', title: 'Consejos', icon: '💡' },
          { id: 'privacy', title: 'Privacidad', icon: '🔒' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
              activeSection === tab.id
                ? 'bg-primary text-white shadow-md'
                : 'bg-white shadow hover:bg-gray-50'
            }`}
          >
            {tab.icon} {tab.title}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        
        {activeSection === 'terms' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FaBook className="text-primary" /> Términos de Uso
            </h2>
            
            <div className="space-y-4 text-gray-600">
              <p><strong>1. Aceptación:</strong> Al usar Trueque, aceptas estos términos.</p>
              
              <p><strong>2. Servicio:</strong> Trueque es una plataforma para intercambiar bienes y servicios. NO somos parte de las transacciones entre usuarios.</p>
              
              <p><strong>3. Uso permitido:</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Publicar objetos o servicios legales</li>
                <li>Comunicarte respetuosamente</li>
                <li>Proporcionar información veraz</li>
              </ul>
              
              <p><strong>4. Prohibido:</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Contenido ilegal o fraudulento</li>
                <li>Múltiples cuentas falsas</li>
                <li>Acosar a otros usuarios</li>
              </ul>
            </div>
          </div>
        )}

        {activeSection === 'safety' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FaShieldAlt className="text-green-500" /> Seguridad
            </h2>
            
            <div className="bg-green-50 rounded-xl p-4">
              <h3 className="font-bold text-green-800 mb-2">✅ HACER</h3>
              <ul className="text-green-700 space-y-2">
                <li>• Reunirse en lugares públicos</li>
                <li>• Ir acompañado a los encuentros</li>
                <li>• Verificar el producto antes de aceptar</li>
                <li>• Avisar a alguien de confianza</li>
                <li>• Reportar comportamientos sospechosos</li>
              </ul>
            </div>

            <div className="bg-red-50 rounded-xl p-4">
              <h3 className="font-bold text-red-800 mb-2">❌ NO HACER</h3>
              <ul className="text-red-700 space-y-2">
                <li>• Compartir información personal sensible</li>
                <li>• Enviar dinero por adelantado</li>
                <li>• Reunirse en lugares aislados</li>
                <li>• Ir solo/a de noche</li>
              </ul>
            </div>
          </div>
        )}

        {activeSection === 'tips' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FaHandshake className="text-blue-500" /> Consejos para un buen trueque
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <h3 className="font-bold text-blue-800 mb-2">📸 Fotos</h3>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Buena iluminación</li>
                  <li>• Varios ángulos</li>
                  <li>• Mostrar defectos si hay</li>
                </ul>
              </div>

              <div className="bg-purple-50 rounded-xl p-4">
                <h3 className="font-bold text-purple-800 mb-2">✍️ Descripción</h3>
                <ul className="text-purple-700 text-sm space-y-1">
                  <li>• Sé honesto sobre el estado</li>
                  <li>• Incluye marca y modelo</li>
                  <li>• Menciona defectos</li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-xl p-4">
                <h3 className="font-bold text-green-800 mb-2">💬 Comunicación</h3>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• Responde rápido</li>
                  <li>• Sé claro con expectativas</li>
                  <li>• Confirma detalles</li>
                </ul>
              </div>

              <div className="bg-orange-50 rounded-xl p-4">
                <h3 className="font-bold text-orange-800 mb-2">🤝 Encuentro</h3>
                <ul className="text-orange-700 text-sm space-y-1">
                  <li>• Llega a tiempo</li>
                  <li>• Revisa el producto</li>
                  <li>• Deja valoración después</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'privacy' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FaUserShield className="text-indigo-500" /> Privacidad
            </h2>
            
            <div className="space-y-4 text-gray-600">
              <p><strong>Datos que recopilamos:</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Información de registro (nombre, email)</li>
                <li>Ubicación aproximada</li>
                <li>Publicaciones y mensajes</li>
              </ul>

              <p><strong>Cómo usamos tus datos:</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Mostrar tu perfil a otros usuarios</li>
                <li>Facilitar la comunicación</li>
                <li>Mostrar trueques cercanos</li>
              </ul>

              <div className="bg-indigo-50 rounded-xl p-4 mt-4">
                <p className="text-indigo-700 font-medium">
                  🔒 <strong>No vendemos tus datos.</strong> Tu privacidad es importante para nosotros.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-8 pt-6 border-t">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <FaExclamationTriangle className="text-yellow-500 text-xl flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-yellow-800">Importante</h3>
                <p className="text-yellow-700 text-sm">
                  Trueque es solo una plataforma de conexión. <strong>No nos responsabilizamos</strong> por el resultado de los intercambios entre usuarios.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}