import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore'
import { db } from '../utils/firebase'
import { useAuth } from '../context/AuthContext'
import { CONDITIONS } from '../utils/categories'
import { 
  FaArrowLeft, FaMapMarkerAlt, FaStar, FaClock, FaHeart, 
  FaShare, FaFlag, FaComments, FaChevronLeft, FaChevronRight 
} from 'react-icons/fa'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

export default function TruequeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser, userData } = useAuth()
  
  const [trueque, setTrueque] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentImage, setCurrentImage] = useState(0)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    loadTrueque()
  }, [id])

  const loadTrueque = async () => {
    try {
      const docRef = doc(db, 'trueques', id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        setTrueque({ id: docSnap.id, ...docSnap.data() })
        
        // Incrementar vistas
        await updateDoc(docRef, {
          views: increment(1)
        })
      }
    } catch (error) {
      console.error('Error loading trueque:', error)
    }
    setLoading(false)
  }

  const handleLike = async () => {
    setLiked(!liked)
    const docRef = doc(db, 'trueques', id)
    await updateDoc(docRef, {
      likes: increment(liked ? -1 : 1)
    })
  }

  const handleContact = () => {
    navigate(`/chat?userId=${trueque.userId}&truequeId=${id}`)
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-80 rounded-xl mb-6" />
          <div className="space-y-4">
            <div className="bg-gray-200 h-8 rounded w-3/4" />
            <div className="bg-gray-200 h-4 rounded w-1/2" />
          </div>
        </div>
      </div>
    )
  }

  if (!trueque) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 text-center">
        <p className="text-xl">Trueque no encontrado</p>
        <Link to="/" className="btn-primary mt-4 inline-block">Volver al inicio</Link>
      </div>
    )
  }

  const condition = CONDITIONS.find(c => c.id === trueque.condition)
  const isOwner = currentUser?.uid === trueque.userId

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-primary mb-4"
      >
        <FaArrowLeft /> Volver
      </button>

      {/* Galería de imágenes */}
      <div className="relative bg-black rounded-xl overflow-hidden mb-6">
        <img
          src={trueque.images[currentImage]}
          alt={trueque.title}
          className="w-full h-80 object-contain"
        />
        
        {trueque.images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentImage(prev => prev > 0 ? prev - 1 : trueque.images.length - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={() => setCurrentImage(prev => prev < trueque.images.length - 1 ? prev + 1 : 0)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
            >
              <FaChevronRight />
            </button>
            
            {/* Indicadores */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {trueque.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentImage ? 'bg-white w-4' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {trueque.isUrgent && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              🔥 URGENTE
            </span>
          )}
        </div>
      </div>

      {/* Miniaturas */}
      {trueque.images.length > 1 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {trueque.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrentImage(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                i === currentImage ? 'border-primary' : 'border-transparent'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Info principal */}
        <div className="md:col-span-2 space-y-6">
          {/* Categoría y título */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
              <span className="text-lg">{trueque.categoryIcon}</span>
              <span>{trueque.categoryName}</span>
              <span>→</span>
              <span>{trueque.subcategoryName}</span>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-800 mb-4">{trueque.title}</h1>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <FaMapMarkerAlt className="text-primary" />
                <span>{trueque.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <FaClock className="text-gray-400" />
                <span>
                  {formatDistanceToNow(new Date(trueque.createdAt), {
                    addSuffix: true,
                    locale: es
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span>{condition?.icon}</span>
                <span>{condition?.name}</span>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h2 className="text-lg font-bold text-gray-800 mb-3">Descripción</h2>
            <p className="text-gray-600 whitespace-pre-line">{trueque.description}</p>
          </div>

          {/* Qué busca a cambio */}
          {trueque.wantsCategories?.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-lg font-bold text-gray-800 mb-3">Busca a cambio</h2>
              <div className="flex flex-wrap gap-2">
                {/* Aquí iría el mapeo de categorías */}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Usuario */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={trueque.userPhoto}
                alt={trueque.userName}
                className="w-16 h-16 rounded-full border-2 border-primary"
              />
              <div>
                <p className="font-bold text-gray-800">{trueque.userName}</p>
                <div className="flex items-center gap-1 text-sm">
                  <FaStar className="text-yellow-500" />
                  <span>{trueque.userRating?.toFixed(1) || 'Nuevo'}</span>
                </div>
              </div>
            </div>
            
            {!isOwner && (
              <button
                onClick={handleContact}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <FaComments />
                Contactar
              </button>
            )}
          </div>

          {/* Acciones */}
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex justify-around">
              <button
                onClick={handleLike}
                className={`flex flex-col items-center p-2 ${liked ? 'text-red-500' : 'text-gray-500'}`}
              >
                <FaHeart className="text-xl" />
                <span className="text-xs mt-1">{(trueque.likes || 0) + (liked ? 1 : 0)}</span>
              </button>
              <button className="flex flex-col items-center p-2 text-gray-500">
                <FaShare className="text-xl" />
                <span className="text-xs mt-1">Compartir</span>
              </button>
              <button className="flex flex-col items-center p-2 text-gray-500">
                <FaFlag className="text-xl" />
                <span className="text-xs mt-1">Reportar</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-xl p-4 shadow-md">
            <p className="text-sm text-gray-500 text-center">
              👁️ {trueque.views || 0} visitas
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}