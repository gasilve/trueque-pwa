import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../utils/firebase'
import { useAuth } from '../context/AuthContext'
import { uploadMultipleToCloudinary } from '../utils/cloudinary'
import { CATEGORIES, CONDITIONS } from '../utils/categories'
import { FaCamera, FaTimes, FaMapMarkerAlt, FaSpinner, FaArrowLeft, FaArrowRight } from 'react-icons/fa'

export default function CreateTrueque() {
  const navigate = useNavigate()
  const { currentUser, userData, addPoints } = useAuth()
  
  // Form states
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(null)
  const [subcategory, setSubcategory] = useState(null)
  const [item, setItem] = useState(null)
  const [wantsCategories, setWantsCategories] = useState([])
  const [condition, setCondition] = useState('bueno')
  const [size, setSize] = useState('')
  const [images, setImages] = useState([])
  const [imageFiles, setImageFiles] = useState([])
  const [location, setLocation] = useState(null)
  const [locationName, setLocationName] = useState('')
  const [isUrgent, setIsUrgent] = useState(false)
  
  // UI states
  const [loading, setLoading] = useState(false)
  const [loadingLocation, setLoadingLocation] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)

  useEffect(() => {
    getLocation()
  }, [])

  // Reset subcategory when category changes
  useEffect(() => {
    setSubcategory(null)
    setItem(null)
    setSize('')
  }, [category])

  const getLocation = async () => {
    setLoadingLocation(true)
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          setLocation({ lat: latitude, lng: longitude })
          
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            )
            const data = await response.json()
            const city = data.address.city || data.address.town || data.address.village || ''
            const state = data.address.state || ''
            const country = data.address.country || ''
            setLocationName(`${city}${state ? ', ' + state : ''}, ${country}`)
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
    }
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    
    if (images.length + files.length > 5) {
      setError('Máximo 5 fotos')
      return
    }
    
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

  const toggleWantsCategory = (catId) => {
    if (wantsCategories.includes(catId)) {
      setWantsCategories(prev => prev.filter(id => id !== catId))
    } else if (wantsCategories.length < 3) {
      setWantsCategories(prev => [...prev, catId])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!title.trim()) return setError('El título es obligatorio')
    if (!category) return setError('Selecciona una categoría')
    if (!subcategory) return setError('Selecciona una subcategoría')
    if (!description.trim()) return setError('La descripción es obligatoria')
    if (imageFiles.length === 0) return setError('Agrega al menos una foto')
    if (!location) return setError('Necesitamos tu ubicación')
    
    setLoading(true)
    
    try {
      const imageUrls = await uploadMultipleToCloudinary(imageFiles, 'trueques')
      
      if (imageUrls.length === 0) {
        throw new Error('Error al subir las imágenes')
      }
      
      const selectedCategory = CATEGORIES.find(c => c.id === category.id)
      const selectedSubcategory = selectedCategory?.subcategories?.find(s => s.id === subcategory.id)
      const selectedItem = selectedSubcategory?.items?.find(i => i.id === item?.id)
      
      const truequeData = {
        title: title.trim(),
        description: description.trim(),
        
        // Categorías
        category: category.id,
        categoryName: category.name,
        categoryIcon: category.icon,
        subcategory: subcategory.id,
        subcategoryName: subcategory.name,
        item: item?.id || null,
        itemName: item?.name || null,
        
        // Detalles
        condition: condition,
        size: size || null,
        wantsCategories: wantsCategories,
        
        // Media
        images: imageUrls,
        
        // Ubicación
        location: locationName,
        coordinates: location,
        
        // Flags
        isUrgent: isUrgent,
        isRemate: false,
        
        // Usuario
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
      
      if (addPoints) {
        await addPoints(20, 'trueque_publicado')
      }
      
      navigate('/')
      
    } catch (err) {
      console.error('Error creating trueque:', err)
      setError('Error al publicar. Intenta de nuevo.')
    }
    
    setLoading(false)
  }

  const selectedCategoryData = CATEGORIES.find(c => c.id === category?.id)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Publicar Trueque</h1>
        <p className="text-gray-600 mt-1">Paso {step} de 4</p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div 
              onClick={() => s < step && setStep(s)}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all cursor-pointer ${
                step >= s ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {s}
            </div>
            {s < 4 && (
              <div className={`w-12 h-1 mx-1 ${step > s ? 'bg-primary' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        
        {/* PASO 1: Categoría y Subcategoría */}
        {step === 1 && (
          <div className="bg-white rounded-xl p-6 shadow-md space-y-6">
            <h2 className="text-xl font-bold text-gray-800">📦 ¿Qué vas a publicar?</h2>
            
            {/* Categoría Principal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Categoría *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      category?.id === cat.id
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-3xl block mb-2">{cat.icon}</span>
                    <span className="text-sm font-medium">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Subcategoría */}
            {category && (
              <div className="animate-fadeIn">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Subcategoría de {category.name} *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selectedCategoryData?.subcategories?.map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setSubcategory(sub)}
                      className={`p-3 rounded-lg border-2 transition-all text-left ${
                        subcategory?.id === sub.id
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-xl">{sub.icon}</span>
                      <span className="text-sm font-medium ml-2">{sub.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Item específico */}
            {subcategory && subcategory.items && (
              <div className="animate-fadeIn">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tipo específico (opcional)
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setItem(null)}
                    className={`px-3 py-2 rounded-full text-sm transition-all ${
                      !item
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    Cualquiera
                  </button>
                  {subcategory.items.map((it) => (
                    <button
                      key={it.id}
                      type="button"
                      onClick={() => setItem(it)}
                      className={`px-3 py-2 rounded-full text-sm transition-all ${
                        item?.id === it.id
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {it.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Talle (solo para ropa) */}
            {category?.id === 'ropa' && selectedCategoryData?.sizes && (
              <div className="animate-fadeIn">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Talle
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedCategoryData.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={`w-12 h-12 rounded-lg font-medium transition-all ${
                        size === s
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!category || !subcategory}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              Siguiente <FaArrowRight />
            </button>
          </div>
        )}

        {/* PASO 2: Detalles */}
        {step === 2 && (
          <div className="bg-white rounded-xl p-6 shadow-md space-y-6">
            <h2 className="text-xl font-bold text-gray-800">📝 Detalles del trueque</h2>
            
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input"
                placeholder="Ej: Guitarra acústica en excelente estado"
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">{title.length}/100</p>
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
                placeholder="Describe el estado, características, marca, modelo..."
                maxLength={1000}
              />
              <p className="text-xs text-gray-500 mt-1">{description.length}/1000</p>
            </div>

            {/* Condición */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condición
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CONDITIONS.map((cond) => (
                  <button
                    key={cond.id}
                    type="button"
                    onClick={() => setCondition(cond.id)}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      condition === cond.id
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-lg">{cond.icon}</span>
                    <span className="text-sm font-medium ml-2">{cond.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Qué busca a cambio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Qué te gustaría a cambio? (máx. 3 categorías)
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleWantsCategory(cat.id)}
                    className={`px-3 py-2 rounded-full text-sm transition-all flex items-center gap-1 ${
                      wantsCategories.includes(cat.id)
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {wantsCategories.length}/3 seleccionadas
              </p>
            </div>

            {/* Urgente */}
            <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
              <input
                type="checkbox"
                id="urgent"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
                className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
              />
              <label htmlFor="urgent" className="text-sm">
                <span className="font-medium">🔥 Marcar como urgente</span>
                <span className="text-gray-600 block">Aparecerá destacado en los resultados</span>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-secondary flex-1 flex items-center justify-center gap-2"
              >
                <FaArrowLeft /> Anterior
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!title.trim() || !description.trim()}
                className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                Siguiente <FaArrowRight />
              </button>
            </div>
          </div>
        )}

        {/* PASO 3: Fotos */}
        {step === 3 && (
          <div className="bg-white rounded-xl p-6 shadow-md space-y-6">
            <h2 className="text-xl font-bold text-gray-800">📸 Fotos</h2>
            <p className="text-gray-600">Agrega hasta 5 fotos. La primera será la principal.</p>
            
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
                    className="absolute -top-2 -right-2 bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-600 shadow-md"
                  >
                    <FaTimes size={12} />
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                      Principal
                    </span>
                  )}
                </div>
              ))}
              
              {images.length < 5 && (
                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                  <FaCamera className="text-3xl text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Agregar</span>
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

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn-secondary flex-1 flex items-center justify-center gap-2"
              >
                <FaArrowLeft /> Anterior
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                disabled={images.length === 0}
                className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                Siguiente <FaArrowRight />
              </button>
            </div>
          </div>
        )}

        {/* PASO 4: Ubicación y publicar */}
        {step === 4 && (
          <div className="bg-white rounded-xl p-6 shadow-md space-y-6">
            <h2 className="text-xl font-bold text-gray-800">📍 Ubicación</h2>
            
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
                      <p className="font-medium">{locationName || 'Sin ubicación'}</p>
                      <p className="text-sm text-gray-500">Esta será tu ubicación para el trueque</p>
                    </>
                  )}
                </div>
                <button
                  type="button"
                  onClick={getLocation}
                  className="text-primary text-sm font-medium"
                >
                  Actualizar
                </button>
              </div>
            </div>

            {/* Resumen */}
            <div className="border-t pt-6">
              <h3 className="font-bold text-gray-800 mb-4">Resumen</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Categoría:</span>
                  <span>{category?.icon} {category?.name} → {subcategory?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Título:</span>
                  <span className="font-medium">{title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Condición:</span>
                  <span>{CONDITIONS.find(c => c.id === condition)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Fotos:</span>
                  <span>{images.length} foto(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Ubicación:</span>
                  <span>{locationName}</span>
                </div>
                {isUrgent && (
                  <p className="text-orange-600 font-medium">🔥 Marcado como urgente</p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="btn-secondary flex-1"
              >
                <FaArrowLeft /> Anterior
              </button>
              <button
                type="submit"
                disabled={loading || !location}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Publicando...
                  </>
                ) : (
                  '🚀 Publicar (+20 pts)'
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}