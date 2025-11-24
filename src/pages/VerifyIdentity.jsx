import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaCamera, FaIdCard, FaCheckCircle, FaSpinner, FaShieldAlt } from 'react-icons/fa'

export default function VerifyIdentity() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selfie, setSelfie] = useState(null)
  const [dniFrente, setDniFrente] = useState(null)
  const [dniDorso, setDniDorso] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      if (type === 'selfie') setSelfie(reader.result)
      else if (type === 'dni-frente') setDniFrente(reader.result)
      else if (type === 'dni-dorso') setDniDorso(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async () => {
    setLoading(true)
    // Simular envío
    setTimeout(() => {
      setLoading(false)
      setStep(4)
    }, 2000)
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <FaShieldAlt className="text-primary text-4xl" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Verificar identidad</h1>
        <p className="text-gray-600 mt-2">
          Verifica tu identidad para mayor seguridad
        </p>
      </div>

      {/* Paso 1: Beneficios */}
      {step === 1 && (
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="font-bold text-lg mb-4">✨ Beneficios</h2>
          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-3">
              <FaCheckCircle className="text-green-500" />
              <span>Badge de verificado</span>
            </li>
            <li className="flex items-center gap-3">
              <FaCheckCircle className="text-green-500" />
              <span>Mayor confianza</span>
            </li>
            <li className="flex items-center gap-3">
              <FaCheckCircle className="text-green-500" />
              <span>Publicar hospedajes</span>
            </li>
          </ul>
          <button onClick={() => setStep(2)} className="btn-primary w-full">
            Comenzar
          </button>
        </div>
      )}

      {/* Paso 2: Selfie */}
      {step === 2 && (
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="font-bold text-lg mb-4">📸 Paso 1: Selfie</h2>
          <label className="block w-full aspect-square border-2 border-dashed rounded-xl cursor-pointer hover:border-primary overflow-hidden">
            {selfie ? (
              <img src={selfie} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <FaCamera className="text-4xl mb-2" />
                <span>Tomar selfie</span>
              </div>
            )}
            <input type="file" accept="image/*" capture="user" onChange={(e) => handleImageUpload(e, 'selfie')} className="hidden" />
          </label>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep(1)} className="flex-1 py-3 bg-gray-100 rounded-lg">Atrás</button>
            <button onClick={() => setStep(3)} disabled={!selfie} className="flex-1 py-3 bg-primary text-white rounded-lg disabled:opacity-50">Siguiente</button>
          </div>
        </div>
      )}

      {/* Paso 3: DNI */}
      {step === 3 && (
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="font-bold text-lg mb-4">🪪 Paso 2: DNI</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Frente</label>
              <label className="block w-full h-32 border-2 border-dashed rounded-xl cursor-pointer hover:border-primary overflow-hidden">
                {dniFrente ? (
                  <img src={dniFrente} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    <FaIdCard className="text-2xl" />
                  </div>
                )}
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'dni-frente')} className="hidden" />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Dorso</label>
              <label className="block w-full h-32 border-2 border-dashed rounded-xl cursor-pointer hover:border-primary overflow-hidden">
                {dniDorso ? (
                  <img src={dniDorso} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    <FaIdCard className="text-2xl" />
                  </div>
                )}
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'dni-dorso')} className="hidden" />
              </label>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep(2)} className="flex-1 py-3 bg-gray-100 rounded-lg">Atrás</button>
            <button onClick={handleSubmit} disabled={loading || !dniFrente || !dniDorso} className="flex-1 py-3 bg-primary text-white rounded-lg disabled:opacity-50">
              {loading ? <FaSpinner className="animate-spin mx-auto" /> : 'Enviar'}
            </button>
          </div>
        </div>
      )}

      {/* Paso 4: Éxito */}
      {step === 4 && (
        <div className="bg-white rounded-xl p-6 shadow-md text-center">
          <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <FaCheckCircle className="text-green-500 text-4xl" />
          </div>
          <h2 className="font-bold text-xl mb-2">¡Enviado!</h2>
          <p className="text-gray-600 mb-6">Revisaremos tu documentación en 24-48 horas.</p>
          <button onClick={() => navigate('/perfil')} className="btn-primary w-full">
            Volver al perfil
          </button>
        </div>
      )}
    </div>
  )
}