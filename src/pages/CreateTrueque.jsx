import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../utils/firebase'
import { useAuth } from '../context/AuthContext'
import { uploadMultipleToCloudinary } from '../utils/cloudinary'
import { CATEGORIES } from '../utils/categories'
import { FaCamera, FaTimes, FaMapMarkerAlt, FaSpinner } from 'react-icons/fa'

export default function CreateTrueque() {
  const navigate = useNavigate()
  const { currentUser, userData, addPoints } = useAuth()
  
  // Form states
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [wantsInReturn, setWantsInReturn] = useState('')
  const [condition, setCondition] = useState('bueno')
  const [images, setImages] = useState([])
  const [imageFiles, setImageFiles] = useState([])
  const [location, setLocation] = useState(null)
  const [locationName, setLocationName] = useState('')
  const [isUrgent, setIsUrgent] = useState(false)
  
  // UI states
  const [loading, setLoading] = useState(false)
  const [loadingLocation, setLoadingLocation] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1) // 1: Info, 2: Fotos, 3: Ubicación

  // Obtener ubicación al cargar
  useEffect(() => {
    getLocation()
  }, [])

  const getLocation = async () => {
    setLoadingLocation(true)
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          setLocation({ lat: latitude, lng: longitude })
          
          // Obtener nombre de la ubicación con API de geocoding
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            )
            const data = await response.json()
            const city = data.address.city || data.address.town || data.address.village || ''
            const country = data.address.country || ''
            setLocationName(`${city}, ${country}`)
          } catch (err) {
            setLocationName('Ubicación detectada')
          }
          
          setLoadingLocation(false)
        },
        (error) => {
          console.error('Error getting location:', error)
          setLocationName('No se pudo obtener ubicación')
          setLoadingLocation(false)
        },
        { enableHighAccuracy: true }
      )
    } else {
      setLocationName('Geolocalización no soportada')
      setLoadingLocation(false)
    }
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    
    if (images.length + files.length > 5) {
      setError('Máximo 5 fotos')
      return
    }
    
    // Preview de imágenes
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result])
      }
      reader.readAsDataURL(file)
    })
    
    setImageFiles(prev => [...prev, ...files])
  }

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setImageFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Validaciones
    if (!title.trim()) {
      setError('El título es obligatorio')
      return
    }
    if (!category) {
      setError('Selecciona una categoría')
      return
    }
    if (!description.trim()) {
      setError('La descripción es obligatoria')
      return
    }
    if (imageFiles.length === 0) {
      setError('Agrega al menos una foto')
      return
    }
    if (!location) {
      setError('Necesitamos tu ubicación para el trueque')
      return
    }
    
    setLoading(true)
    
    try {
      // Subir imágenes a Cloudinary
      const imageUrls = await uploadMultipleToCloudinary(imageFiles, 'trueques')
      
      if (imageUrls.length === 0) {
        throw new Error('Error al subir las imágenes')
      }
      
      // Obtener info de la categoría
      const categoryData = CATEGORIES.find(c => c.id === category)
      
      // Crear documento en Firestore
      const truequeData = {
        title: title.trim(),
        description: description.trim(),
        category: category,
        categoryName: categoryData?.name || '',
        categoryIcon: categoryData?.icon || '📦',
        wantsInReturn: wantsInReturn.trim(),
        condition: condition,
        images: imageUrls,
        location: locationName,
        coordinates: location,
        isUrgent: isUrgent,
        isRemate: false,
        
        // Info del usuario
        userId: currentUser.uid,
        userName: userData?.name || 'Usuario',
        userPhoto: userData?.photo || '',
        userRating: userData?.rating || 0,
        
        // Metadata
        status: 'active',
        views: 0,
        likes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      await addDoc(collection(db, 'trueques'), truequeData)
      
      // Agregar puntos de gamificación
      if (addPoints) {
        await addPoints(20, 'trueque_publicado')
      }
      
      // Redirigir al inicio
      navigate('/')
      
    } catch (err) {
      console.error('Error creating trueque:', err)
      setError('Error al publicar el trueque. Intenta de nuevo.')
    }
    
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Publicar Trueque</h1>
        <p className="text-gray-600 mt-1">Comparte lo que tienes y encuentra lo que necesitas</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                step >= s 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div className={`w-16 h-1 mx-2 ${step > s ? 'bg-primary' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* PASO 1: Información básica */}
        {step === 1 && (
          <div className="bg-white rounded-xl p-6 shadow-md space-y-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📝 Información del trueque</h2>
            
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Qué ofreces? *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input"
                placeholder="Ej: Bicicleta montañera en buen estado"
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">{title.length}/100 caracteres</p>
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      category === cat.id
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{cat.icon}</span>
                    <span className="text-sm font-medium">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input"
                rows="4"
                placeholder="Describe el estado, características y cualquier detalle importante..."
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">{description.length}/500 caracteres</p>
            </div>

            {/* Condición */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condición
              </label>
              <div className="flex gap-3 flex-wrap">
                {[
                  { id: 'nuevo', label: '✨ Nuevo' },
                  { id: 'como_nuevo', label: '🌟 Como nuevo' },
                  { id: 'bueno', label: '👍 Bueno' },
                  { id: 'usado', label: '📦 Usado' }
                ].map((cond) => (
                  <button
                    key={cond.id}
                    type="button"
                    onClick={() => setCondition(cond.id)}
                    className={`px-4 py-2 rounded-full border-2 transition-all ${
                      condition === cond.id
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {cond.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Qué busca a cambio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Qué te gustaría a cambio?
              </label>
              <input
                type="text"
                value={wantsInReturn}
                onChange={(e) => setWantsInReturn(e.target.value)}
                className="input"
                placeholder="Ej: Celular, tablet, o propuestas..."
              />
            </div>

            {/* Es urgente */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="urgent"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
                className="w-5 h-5 text-primary rounded focus:ring-primary"
              />
              <label htmlFor="urgent" className="text-sm font-medium text-gray-700">
                🔥 Marcar como urgente (aparecerá destacado)
              </label>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn-primary w-full"
            >
              Siguiente: Agregar fotos →
            </button>
          </div>
        )}

        {/* PASO 2: Fotos */}
        {step === 2 && (
          <div className="bg-white rounded-xl p-6 shadow-md space-y-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📸 Fotos del trueque</h2>
            <p className="text-gray-600 text-sm">Agrega hasta 5 fotos para mostrar lo que ofreces</p>
            
            {/* Preview de imágenes */}
            <div className="grid grid-cols-3 gap-4">
              {images.map((img, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={img}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <FaTimes size={12} />
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                      Principal
                    </span>
                  )}
                </div>
              ))}
              
              {images.length < 5 && (
                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                  <FaCamera className="text-3xl text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Agregar foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <p className="text-xs text-gray-500">
              {images.length}/5 fotos • La primera foto será la principal
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-secondary flex-1"
              >
                ← Anterior
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="btn-primary flex-1"
              >
                Siguiente: Ubicación →
              </button>
            </div>
          </div>
        )}

        {/* PASO 3: Ubicación y publicar */}
        {step === 3 && (
          <div className="bg-white rounded-xl p-6 shadow-md space-y-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📍 Ubicación del trueque</h2>
            
            {/* Ubicación actual */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <FaMapMarkerAlt className="text-primary text-xl" />
                </div>
                <div className="flex-1">
                  {loadingLocation ? (
                    <div className="flex items-center gap-2 text-gray-500">
                      <FaSpinner className="animate-spin" />
                      <span>Obteniendo ubicación...</span>
                    </div>
                  ) : (
                    <>
                      <p className="font-medium text-gray-800">{locationName || 'Ubicación no disponible'}</p>
                      <p className="text-sm text-gray-500">
                        Esta será la ubicación de tu trueque
                      </p>
                    </>
                  )}
                </div>
                <button
                  type="button"
                  onClick={getLocation}
                  className="text-primary text-sm font-medium hover:underline"
                >
                  Actualizar
                </button>
              </div>
            </div>

            {/* Resumen */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-800 mb-4">Resumen del trueque</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500">Título:</span> {title}</p>
                <p><span className="text-gray-500">Categoría:</span> {CATEGORIES.find(c => c.id === category)?.icon} {CATEGORIES.find(c => c.id === category)?.name}</p>
                <p><span className="text-gray-500">Condición:</span> {condition}</p>
                <p><span className="text-gray-500">Fotos:</span> {images.length}</p>
                <p><span className="text-gray-500">Ubicación:</span> {locationName}</p>
                {isUrgent && <p className="text-red-500 font-medium">🔥 Marcado como urgente</p>}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn-secondary flex-1"
              >
                ← Anterior
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Publicando...
                  </>
                ) : (
                  '🚀 Publicar Trueque'
                )}
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              Al publicar, ganarás +20 puntos 🌱
            </p>
          </div>
        )}
      </form>
    </div>
  )
}