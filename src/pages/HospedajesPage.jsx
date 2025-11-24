import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '../utils/firebase'
import { SPACE_TYPES } from '../utils/categories'
import { FaPlus, FaMapMarkerAlt, FaStar, FaUser, FaCheckCircle } from 'react-icons/fa'

export default function HospedajesPage() {
  const [hospedajes, setHospedajes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState(null)

  useEffect(() => {
    loadHospedajes()
  }, [])

  const loadHospedajes = async () => {
    try {
      const q = query(
        collection(db, 'hospedajes'),
        orderBy('createdAt', 'desc'),
        limit(50)
      )
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setHospedajes(data.filter(h => h.status === 'active' || !h.status))
    } catch (error) {
      console.error('Error:', error)
    }
    setLoading(false)
  }

  const filteredHospedajes = selectedType
    ? hospedajes.filter(h => h.spaceType === selectedType)
    : hospedajes

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent to-pink-400 rounded-xl p-6 text-white mb-6">
        <h1 className="text-3xl font-bold mb-2">🏠 TruequeStay</h1>
        <p className="opacity-90">Hospédate gratis intercambiando tus habilidades</p>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedType(null)}
          className={`px-4 py-2 rounded-full whitespace-nowrap ${
            !selectedType ? 'bg-accent text-white' : 'bg-white shadow'
          }`}
        >
          Todos
        </button>
        {SPACE_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedType(type.id === selectedType ? null : type.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap flex items-center gap-1 ${
              selectedType === type.id ? 'bg-accent text-white' : 'bg-white shadow'
            }`}
          >
            {type.icon} {type.name}
          </button>
        ))}
      </div>

      {/* Botón crear */}
      <Link
        to="/crear-hospedaje"
        className="block bg-accent text-white rounded-xl p-4 mb-6 text-center font-semibold hover:bg-accent/90 shadow-md"
      >
        <FaPlus className="inline mr-2" />
        Publicar mi espacio
      </Link>

      {/* Lista */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-xl animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-xl" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredHospedajes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl">
          <p className="text-6xl mb-4">🏠</p>
          <p className="text-xl text-gray-600 mb-2">No hay hospedajes disponibles</p>
          <p className="text-gray-500 mb-6">¡Sé el primero en publicar!</p>
          <Link to="/crear-hospedaje" className="inline-block bg-accent text-white px-6 py-3 rounded-lg">
            Publicar hospedaje
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHospedajes.map((hospedaje) => (
            <Link
              key={hospedaje.id}
              to={`/hospedaje/${hospedaje.id}`}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all group"
            >
              <div className="relative h-48">
                <img
                  src={hospedaje.images?.[0] || 'https://via.placeholder.com/300x200'}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded-full text-sm">
                  {hospedaje.spaceTypeIcon} {hospedaje.spaceTypeName}
                </div>
                {hospedaje.verified && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                    <FaCheckCircle /> Verificado
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg line-clamp-1">{hospedaje.title}</h3>
                <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                  <FaMapMarkerAlt className="text-accent" />
                  {hospedaje.location}
                </p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <div className="flex items-center gap-2">
                    <img
                      src={hospedaje.userPhoto || `https://ui-avatars.com/api/?name=${hospedaje.userName}`}
                      alt=""
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm">{hospedaje.userName}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <FaStar className="text-yellow-500" />
                    {hospedaje.userRating?.toFixed(1) || 'Nuevo'}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}