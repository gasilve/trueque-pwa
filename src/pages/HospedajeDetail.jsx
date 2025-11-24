import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { doc, getDoc, updateDoc, increment, addDoc, collection } from 'firebase/firestore'
import { db } from '../utils/firebase'
import { useAuth } from '../context/AuthContext'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { 
  FaArrowLeft, FaMapMarkerAlt, FaClock, FaHeart, FaShare, FaFlag,
  FaStar, FaComments, FaEye, FaCheckCircle, FaUser, FaTimes,
  FaChevronLeft, FaChevronRight, FaBed, FaUsers, FaCalendarAlt,
  FaWifi, FaSnowflake, FaTv, FaParking, FaUtensils, FaDog,
  FaSwimmingPool, FaDumbbell, FaTshirt, FaHome
} from 'react-icons/fa'

// Iconos de amenidades
const AMENITY_ICONS = {
  wifi: { icon: FaWifi, label: 'WiFi' },
  ac: { icon: FaSnowflake, label: 'Aire acondicionado' },
  tv: { icon: FaTv, label: 'TV' },
  parking: { icon: FaParking, label: 'Estacionamiento' },
  kitchen: { icon: FaUtensils, label: 'Cocina' },
  pets: { icon: FaDog, label: 'Acepta mascotas' },
  pool: { icon: FaSwimmingPool, label: 'Pileta' },
  gym: { icon: FaDumbbell, label: 'Gimnasio' },
  laundry: { icon: FaTshirt, label: 'Lavandería' },
}

export default function HospedajeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser, userData } = useAuth()
  
  const [hospedaje, setHospedaje] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentImage, setCurrentImage] = useState(0)
  const [liked, setLiked] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [reportDetails, setReportDetails] = useState('')
  const [reporting, setReporting] = useState(false)

  useEffect(() => {
    loadHospedaje()
  }, [id])

  const loadHospedaje = async () => {
    try {
      const docRef = doc(db, 'hospedajes', id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        setHospedaje({ id: docSnap.id, ...docSnap.data() })
        // Incrementar vistas
        await updateDoc(docRef, { views: increment(1) })
      }
    } catch (error) {
      console.error('Error:', error)
    }
    setLoading(false)
  }

  const handleLike = async () => {
    if (!currentUser) return navigate('/login')
    setLiked(!liked)
    try {
      await updateDoc(doc(db, 'hospedajes', id), {
        likes: increment(liked ? -1 : 1)
      })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: hospedaje.title,
      text: `🏠 ${hospedaje.title} - Hospedaje en ${hospedaje.location}`,
      url: window.location.href
    }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
        alert('¡Link copiado!')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleContact = () => {
    if (!currentUser) return navigate('/login')
    navigate(`/chat?userId=${hospedaje.userId}&hospedajeId=${id}`)
  }

  const handleReport = async () => {
    if (!reportReason) return alert('Selecciona un motivo')
    setReporting(true)
    try {
      await addDoc(collection(db, 'reports'), {
        type: 'hospedaje',
        itemId: id,
        itemTitle: hospedaje.title,
        reportedUserId: hospedaje.userId,
        reporterId: currentUser.uid,
        reason: reportReason,
        details: reportDetails,
        status: 'pending',
        createdAt: new Date().toISOString()
      })
      alert('Reporte enviado. ¡Gracias!')
      setShowReportModal(false)
    } catch (error) {
      console.error('Error:', error)
    }
    setReporting(false)
  }

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % hospedaje.images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + hospedaje.images.length) % hospedaje.images.length)
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-80 rounded-xl mb-6" />
          <div className="bg-gray-200 h-8 rounded w-3/4 mb-4" />
          <div className="bg-gray-200 h-4 rounded w-1/2" />
        </div>
      </div>
    )
  }

  if (!hospedaje) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-6xl mb-4">🏠</p>
        <p className="text-xl text-gray-600">Hospedaje no encontrado</p>
        <Link to="/hospedajes" className="btn-primary inline-block mt-4">
          Ver hospedajes
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-primary mb-4"
      >
        <FaArrowLeft /> Volver
      </button>

      {/* Galería */}
      <div className="relative bg-black rounded-xl overflow-hidden mb-6">
        <img
          src={hospedaje.images?.[currentImage] || 'https://via.placeholder.com/800x400'}
          alt={hospedaje.title}
          className="w-full h-80 md:h-96 object-contain"
        />
        
        {hospedaje.images?.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full"
            >
              <FaChevronRight />
            </button>
            
            {/* Indicadores */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {hospedaje.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === currentImage ? 'w-6 bg-white' : 'w-2 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-accent text-white px-3 py-1 rounded-full text-sm font-medium">
            {hospedaje.spaceTypeIcon} {hospedaje.spaceTypeName}
          </span>
          {hospedaje.verified && (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
              <FaCheckCircle /> Verificado
            </span>
          )}
        </div>
      </div>

      {/* Miniaturas */}
      {hospedaje.images?.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {hospedaje.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrentImage(i)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                i === currentImage ? 'border-accent' : 'border-transparent'
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
          {/* Título */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              {hospedaje.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-gray-500 text-sm">
              <span className="flex items-center gap-1">
                <FaMapMarkerAlt className="text-accent" />
                {hospedaje.location}
              </span>
              <span className="flex items-center gap-1">
                <FaClock />
                {formatDistanceToNow(new Date(hospedaje.createdAt), { addSuffix: true, locale: es })}
              </span>
              <span className="flex items-center gap-1">
                <FaEye />
                {hospedaje.views || 0} vistas
              </span>
            </div>
          </div>

          {/* Detalles rápidos */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <FaUsers className="text-2xl text-accent mx-auto mb-2" />
              <p className="text-sm text-gray-500">Huéspedes</p>
              <p className="font-bold">{hospedaje.maxGuests || 1}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <FaCalendarAlt className="text-2xl text-accent mx-auto mb-2" />
              <p className="text-sm text-gray-500">Mín. noches</p>
              <p className="font-bold">{hospedaje.minNights || 1}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <FaCalendarAlt className="text-2xl text-accent mx-auto mb-2" />
              <p className="text-sm text-gray-500">Máx. noches</p>
              <p className="font-bold">{hospedaje.maxNights || 30}</p>
            </div>
          </div>

          {/* Descripción */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h2 className="font-bold text-lg mb-3">📝 Descripción</h2>
            <p className="text-gray-600 whitespace-pre-line">{hospedaje.description}</p>
          </div>

          {/* Amenidades */}
          {hospedaje.amenities?.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="font-bold text-lg mb-3">✨ Amenidades</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {hospedaje.amenities.map((amenityId) => {
                  const amenity = AMENITY_ICONS[amenityId]
                  if (!amenity) return null
                  const Icon = amenity.icon
                  return (
                    <div key={amenityId} className="flex items-center gap-2 text-gray-600">
                      <Icon className="text-accent" />
                      <span>{amenity.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Qué acepta a cambio */}
          {hospedaje.exchangeTypes?.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="font-bold text-lg mb-3">🤝 Acepta a cambio</h2>
              <div className="flex flex-wrap gap-2">
                {hospedaje.exchangeTypes.map((type) => (
                  <span
                    key={type}
                    className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Reglas */}
          {hospedaje.houseRules && (
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="font-bold text-lg mb-3">📋 Reglas de la casa</h2>
              <p className="text-gray-600 whitespace-pre-line">{hospedaje.houseRules}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Anfitrión */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="font-bold text-lg mb-4">🏠 Anfitrión</h3>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={hospedaje.userPhoto || `https://ui-avatars.com/api/?name=${hospedaje.userName}&background=FF6B9D&color=fff`}
                alt={hospedaje.userName}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <p className="font-bold flex items-center gap-2">
                  {hospedaje.userName}
                  {hospedaje.verified && <FaCheckCircle className="text-green-500" />}
                </p>
                <div className="flex items-center gap-1 text-sm">
                  <FaStar className="text-yellow-500" />
                  <span>{hospedaje.userRating?.toFixed(1) || 'Nuevo'}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleContact}
              className="w-full bg-accent text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-accent/90 transition-all"
            >
              <FaComments /> Contactar
            </button>
          </div>

          {/* Acciones */}
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex justify-around">
              <button
                onClick={handleLike}
                className={`flex flex-col items-center p-2 ${liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
              >
                <FaHeart className="text-xl" />
                <span className="text-xs mt-1">{(hospedaje.likes || 0) + (liked ? 1 : 0)}</span>
              </button>
              <button onClick={handleShare} className="flex flex-col items-center p-2 text-gray-500 hover:text-accent">
                <FaShare className="text-xl" />
                <span className="text-xs mt-1">Compartir</span>
              </button>
              <button onClick={() => setShowReportModal(true)} className="flex flex-col items-center p-2 text-gray-500 hover:text-red-500">
                <FaFlag className="text-xl" />
                <span className="text-xs mt-1">Reportar</span>
              </button>
            </div>
          </div>

          {/* Info importante */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-yellow-800 text-sm">
              ⚠️ <strong>Importante:</strong> Verifica la identidad del anfitrión antes de confirmar. 
              <Link to="/legal" className="text-accent hover:underline ml-1">
                Ver consejos de seguridad
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Modal Reportar */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">🚨 Reportar</h3>
              <button onClick={() => setShowReportModal(false)} className="text-gray-400 hover:text-gray-600">
                <FaTimes />
              </button>
            </div>
            
            <div className="space-y-2 mb-4">
              {['spam', 'fake', 'inappropriate', 'scam', 'other'].map((reason) => (
                <button
                  key={reason}
                  onClick={() => setReportReason(reason)}
                  className={`w-full p-3 rounded-lg border-2 text-left ${
                    reportReason === reason ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  {reason === 'spam' && '🗑️ Spam'}
                  {reason === 'fake' && '🎭 Información falsa'}
                  {reason === 'inappropriate' && '⚠️ Inapropiado'}
                  {reason === 'scam' && '🚫 Posible estafa'}
                  {reason === 'other' && '❓ Otro'}
                </button>
              ))}
            </div>
            
            <textarea
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              placeholder="Detalles (opcional)"
              className="input mb-4"
              rows="3"
            />
            
            <div className="flex gap-3">
              <button onClick={() => setShowReportModal(false)} className="flex-1 py-3 bg-gray-100 rounded-lg">
                Cancelar
              </button>
              <button onClick={handleReport} disabled={!reportReason || reporting} className="flex-1 py-3 bg-red-500 text-white rounded-lg disabled:opacity-50">
                {reporting ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}