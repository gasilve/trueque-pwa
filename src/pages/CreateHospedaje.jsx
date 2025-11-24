import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../utils/firebase'
import { useAuth } from '../context/AuthContext'
import { uploadMultipleToCloudinary } from '../utils/cloudinary'
import { SPACE_TYPES, AMENITIES, HOSPEDAJE_EXCHANGE_TYPES } from '../utils/categories'
import { FaCamera, FaTimes, FaMapMarkerAlt, FaSpinner, FaArrowLeft, FaArrowRight } from 'react-icons/fa'

export default function CreateHospedaje() {
  const navigate = useNavigate()
  const { currentUser, userData, addPoints } = useAuth()
  
  // Form states
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [spaceType, setSpaceType] = useState(null)
  const [amenities, setAmenities] = useState([])
  const [exchangeTypes, setExchangeTypes] = useState([])
  const [maxGuests, setMaxGuests] = useState(1)
  const [minNights, setMinNights] = useState(1)
  const [maxNights, setMaxNights] = useState(30)
  const [images, setImages] = useState([])
  const [imageFiles, setImageFiles] = useState([])
  const [location, setLocation] = useState(null)
  const [locationName, setLocationName] = useState('')
  const [houseRules, setHouseRules] = useState('')
  
  // UI states
  const [loading, setLoading] = useState(false)
  const [loadingLocation, setLoadingLocation] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)

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
          
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            )
            const data = await response.json()
            const city = data.address.city || data.address.town || data.address.village || ''
            const state = data.address.state || ''
            const country = data.address.country || ''
            setLocationName(`${city}${state ? ', ' + state : ''}, ${country}`)
          } catch {
            setLocationName('Ubicación detectada')
          }
          setLoadingLocation(false)
        },
        () => {
          setLocationName('No se pudo obtener ubicación')
          setLoadingLocation(false)
        }
      )
    }
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (images.length + files.length > 10) {
      setError('Máximo 10 fotos')
      return
    }
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => setImages(prev => [...prev, reader.result])
      reader.readAsDataURL(file)
    })
    setImageFiles(prev => [...prev, ...files])
  }

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setImageFiles(prev => prev.filter((_, i) => i !== index))
  }

  const toggleAmenity = (id) => {
    if (amenities.includes(id)) {
      setAmenities(prev => prev.filter(a => a !== id))
    } else {
      setAmenities(prev => [...prev, id])
    }
  }

  const toggleExchange = (id) => {
    if (exchangeTypes.includes(id)) {
      setExchangeTypes(prev => prev.filter(e => e !== id))
    } else if (exchangeTypes.length < 5) {
      setExchangeTypes(prev => [...prev, id])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!title.trim()) return setError('El título es obligatorio')
    if (!spaceType) return setError('Selecciona el tipo de espacio')
    if (!description.trim()) return setError('La descripción es obligatoria')
    if (imageFiles.length < 3) return setError('Agrega al menos 3 fotos')
    if (exchangeTypes.length === 0) return setError('Selecciona al menos un tipo de intercambio')
    if (!location) return setError('Necesitamos tu ubicación')
    
    setLoading(true)
    
    try {
      const imageUrls = await uploadMultipleToCloudinary(imageFiles, 'hospedajes')
      
      const hospedajeData = {
        title: title.trim(),
        description: description.trim(),
        spaceType: spaceType.id,
        spaceTypeName: spaceType.name,
        spaceTypeIcon: spaceType.icon,
        amenities,
        exchangeTypes,
        maxGuests,
        minNights,
        maxNights,
        houseRules: houseRules.trim(),
        images: imageUrls,
        location: locationName,
        coordinates: location,
        
        // Usuario
        userId: currentUser.uid,
        userName: userData?.name || 'Anfitrión',
        userPhoto: userData?.photo || '',
        userRating: userData?.rating || 0,
        verified: userData?.verified || false,
        
        // Metadata
        status: 'active',
        views: 0,
        likes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      await addDoc(collection(db, 'hospedajes'), hospedajeData)
      
      if (addPoints) {
        await addPoints(50, 'hospedaje_publicado')
      }
      
      navigate('/hospedajes')
    } catch (err) {
      console.error('Error:', err)
      setError('Error al publicar. Intenta de nuevo.')
    }
    
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">🏠 Publicar Hospedaje</h1>
        <p className="text-gray-600 mt-1">Ofrece tu espacio a cambio de servicios</p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                step >= s ? 'bg-accent text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {s}
            </div>
            {s < 4 && <div className={`w-12 h-1 mx-1 ${step > s ? 'bg-accent' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* PASO 1: Tipo de espacio */}
        {step === 1 && (
          <div className="bg-white rounded-xl p-6 shadow-md space-y-6">
            <h2 className="text-xl font-bold">🏡 Tipo de espacio</h2>
            
            <div className="grid grid-cols-2 gap-4">
              {SPACE_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSpaceType(type)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    spaceType?.id === type.id
                      ? 'border-accent bg-accent/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-3xl block mb-2">{type.icon}</span>
                  <span className="font-medium block">{type.name}</span>
                  <span className="text-xs text-gray-500">{type.description}</span>
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Título del hospedaje</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input"
                placeholder="Ej: Habitación acogedora en el centro"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Descripción</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input"
                rows="4"
                placeholder="Describe tu espacio, el barrio, transporte cercano..."
              />
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!spaceType || !title.trim()}
              className="w-full py-3 bg-accent text-white rounded-lg font-medium disabled:opacity-50"
            >
              Siguiente <FaArrowRight className="inline ml-2" />
            </button>
          </div>
        )}

        {/* PASO 2: Amenidades y detalles */}
        {step === 2 && (
          <div className="bg-white rounded-xl p-6 shadow-md space-y-6">
            <h2 className="text-xl font-bold">✨ Amenidades</h2>
            
            <div className="grid grid-cols-3 gap-3">
              {AMENITIES.map((amenity) => (
                <button
                  key={amenity.id}
                  type="button"
                  onClick={() => toggleAmenity(amenity.id)}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    amenities.includes(amenity.id)
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xl block">{amenity.icon}</span>
                  <span className="text-xs">{amenity.name}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Huéspedes max</label>
                <select
                  value={maxGuests}
                  onChange={(e) => setMaxGuests(Number(e.target.value))}
                  className="input"
                >
                  {[1,2,3,4,5,6].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Noches mín</label>
                <select
                  value={minNights}
                  onChange={(e) => setMinNights(Number(e.target.value))}
                  className="input"
                >
                  {[1,2,3,5,7,14,30].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Noches máx</label>
                <select
                  value={maxNights}
                  onChange={(e) => setMaxNights(Number(e.target.value))}
                  className="input"
                >
                  {[7,14,30,60,90,180,365].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Reglas de la casa (opcional)</label>
              <textarea
                value={houseRules}
                onChange={(e) => setHouseRules(e.target.value)}
                className="input"
                rows="3"
                placeholder="No fumar, horarios de silencio, mascotas..."
              />
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 bg-gray-100 rounded-lg">
                <FaArrowLeft className="inline mr-2" /> Anterior
              </button>
              <button type="button" onClick={() => setStep(3)} className="flex-1 py-3 bg-accent text-white rounded-lg">
                Siguiente <FaArrowRight className="inline ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* PASO 3: Tipo de intercambio */}
        {step === 3 && (
          <div className="bg-white rounded-xl p-6 shadow-md space-y-6">
            <h2 className="text-xl font-bold">🤝 ¿Qué aceptas a cambio?</h2>
            <p className="text-gray-600 text-sm">Selecciona hasta 5 tipos de intercambio</p>
            
            {Object.entries(HOSPEDAJE_EXCHANGE_TYPES).map(([key, category]) => (
              <div key={key}>
                <h3 className="font-medium text-gray-700 mb-2">{category.icon} {category.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {category.options.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => toggleExchange(option.id)}
                      className={`px-3 py-2 rounded-full text-sm transition-all ${
                        exchangeTypes.includes(option.id)
                          ? 'bg-accent text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {option.icon} {option.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            
            <p className="text-sm text-gray-500">{exchangeTypes.length}/5 seleccionados</p>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(2)} className="flex-1 py-3 bg-gray-100 rounded-lg">
                <FaArrowLeft className="inline mr-2" /> Anterior
              </button>
              <button 
                type="button" 
                onClick={() => setStep(4)} 
                disabled={exchangeTypes.length === 0}
                className="flex-1 py-3 bg-accent text-white rounded-lg disabled:opacity-50"
              >
                Siguiente <FaArrowRight className="inline ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* PASO 4: Fotos y ubicación */}
        {step === 4 && (
          <div className="bg-white rounded-xl p-6 shadow-md space-y-6">
            <h2 className="text-xl font-bold">📸 Fotos (mín. 3)</h2>
            
            <div className="grid grid-cols-3 gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square">
                  <img src={img} alt="" className="w-full h-full object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
              {images.length < 10 && (
                <label className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-accent">
                  <FaCamera className="text-2xl text-gray-400" />
                  <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-accent text-xl" />
                <div className="flex-1">
                  {loadingLocation ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <p className="font-medium">{locationName || 'Sin ubicación'}</p>
                  )}
                </div>
                <button type="button" onClick={getLocation} className="text-accent text-sm">
                  Actualizar
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(3)} className="flex-1 py-3 bg-gray-100 rounded-lg">
                <FaArrowLeft className="inline mr-2" /> Anterior
              </button>
              <button 
                type="submit" 
                disabled={loading || images.length < 3}
                className="flex-1 py-3 bg-accent text-white rounded-lg disabled:opacity-50"
              >
                {loading ? <FaSpinner className="animate-spin inline" /> : '🚀 Publicar (+50 pts)'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}