import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../utils/firebase'
import { CATEGORIES } from '../utils/categories'
import { FaList, FaMapMarkerAlt, FaFilter, FaTimes, FaSpinner, FaBed } from 'react-icons/fa'

export default function MapPage() {
  const [trueques, setTrueques] = useState([])
  const [hospedajes, setHospedajes] = useState([])
  const [loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('trueques') // 'trueques' | 'hospedajes'
  const [selectedItem, setSelectedItem] = useState(null)
  const [mapError, setMapError] = useState(null)

  useEffect(() => {
    getUserLocation()
    loadData()
  }, [selectedCategory, selectedSubcategory, viewMode])

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error('Error getting location:', error)
          // Ubicación por defecto (Buenos Aires)
          setUserLocation({ lat: -34.6037, lng: -58.3816 })
        }
      )
    }
  }

  const loadData = async () => {
    setLoading(true)
    try {
      if (viewMode === 'trueques') {
        let q = query(
          collection(db, 'trueques'),
          where('status', '==', 'active')
        )
        
        const snapshot = await getDocs(q)
        let data = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(t => t.coordinates) // Solo los que tienen ubicación
        
        if (selectedCategory) {
          data = data.filter(t => t.category === selectedCategory)
        }
        if (selectedSubcategory) {
          data = data.filter(t => t.subcategory === selectedSubcategory)
        }
        
        setTrueques(data)
      } else {
        const q = query(
          collection(db, 'hospedajes'),
          where('status', '==', 'active')
        )
        
        const snapshot = await getDocs(q)
        const data = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(h => h.coordinates)
        
        setHospedajes(data)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    }
    setLoading(false)
  }

  // Calcular distancia entre dos puntos
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371 // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // Ordenar por distancia
  const sortedItems = useCallback(() => {
    if (!userLocation) return viewMode === 'trueques' ? trueques : hospedajes
    
    const items = viewMode === 'trueques' ? trueques : hospedajes
    return [...items].sort((a, b) => {
      const distA = calculateDistance(
        userLocation.lat, userLocation.lng,
        a.coordinates.lat, a.coordinates.lng
      )
      const distB = calculateDistance(
        userLocation.lat, userLocation.lng,
        b.coordinates.lat, b.coordinates.lng
      )
      return distA - distB
    })
  }, [trueques, hospedajes, userLocation, viewMode])

  const selectedCategoryData = CATEGORIES.find(c => c.id === selectedCategory)

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col">
      {/* Header con filtros */}
      <div className="bg-white shadow-md p-4 z-10">
        {/* Toggle Trueques/Hospedajes */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setViewMode('trueques')}
            className={`flex-1 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'trueques'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            📦 Trueques
          </button>
          <button
            onClick={() => setViewMode('hospedajes')}
            className={`flex-1 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'hospedajes'
                ? 'bg-accent text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            🏠 Hospedajes
          </button>
        </div>

        {/* Filtros para trueques */}
        {viewMode === 'trueques' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                showFilters || selectedCategory
                  ? 'bg-primary text-white'
                  : 'bg-gray-100'
              }`}
            >
              <FaFilter />
              Filtros
              {selectedCategory && (
                <span className="bg-white text-primary text-xs px-1 rounded">1</span>
              )}
            </button>
            
            {selectedCategory && (
              <button
                onClick={() => {
                  setSelectedCategory(null)
                  setSelectedSubcategory(null)
                }}
                className="px-3 py-2 bg-gray-100 rounded-lg flex items-center gap-1 text-sm"
              >
                {CATEGORIES.find(c => c.id === selectedCategory)?.icon}
                {CATEGORIES.find(c => c.id === selectedCategory)?.name}
                <FaTimes className="text-gray-400" />
              </button>
            )}
          </div>
        )}

        {/* Panel de filtros */}
        {showFilters && viewMode === 'trueques' && (
          <div className="mt-4 pt-4 border-t animate-fadeIn">
            <p className="text-sm font-medium mb-2">Categoría</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id === selectedCategory ? null : cat.id)
                    setSelectedSubcategory(null)
                  }}
                  className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                    selectedCategory === cat.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>

            {selectedCategoryData?.subcategories && (
              <div className="mt-3">
                <p className="text-sm font-medium mb-2">Subcategoría</p>
                <div className="flex flex-wrap gap-2">
                  {selectedCategoryData.subcategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSubcategory(
                        sub.id === selectedSubcategory ? null : sub.id
                      )}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedSubcategory === sub.id
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {sub.icon} {sub.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mapa o Lista */}
      <div className="flex-1 relative">
        {loading ? (
          <div className="h-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <FaSpinner className="animate-spin text-4xl text-primary mx-auto mb-4" />
              <p className="text-gray-600">Cargando mapa...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Mapa placeholder - Integrar con Google Maps o Leaflet */}
            <div className="h-full bg-gradient-to-b from-blue-100 to-green-100 relative overflow-hidden">
              {/* Fondo simulando mapa */}
              <div className="absolute inset-0 opacity-20">
                <div className="grid grid-cols-10 h-full">
                  {Array(100).fill(0).map((_, i) => (
                    <div key={i} className="border border-gray-300" />
                  ))}
                </div>
              </div>

              {/* Ubicación del usuario */}
              {userLocation && (
                <div 
                  className="absolute z-10"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div className="relative">
                    <div className="w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg" />
                    <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-30" />
                  </div>
                  <p className="text-xs font-medium text-center mt-1 bg-white px-2 py-1 rounded shadow">
                    Tú
                  </p>
                </div>
              )}

              {/* Markers de trueques/hospedajes */}
              {sortedItems().slice(0, 20).map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="absolute cursor-pointer transform hover:scale-110 transition-transform"
                  style={{
                    left: `${20 + (index % 5) * 15}%`,
                    top: `${20 + Math.floor(index / 5) * 20}%`
                  }}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                    viewMode === 'trueques' ? 'bg-primary' : 'bg-accent'
                  } text-white text-lg`}>
                    {viewMode === 'trueques' ? item.categoryIcon : '🏠'}
                  </div>
                </div>
              ))}

              {/* Info del item seleccionado */}
              {selectedItem && (
                <div className="absolute bottom-4 left-4 right-4 z-20">
                  <div className="bg-white rounded-xl shadow-xl p-4 animate-fadeIn">
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    >
                      <FaTimes />
                    </button>
                    
                    <div className="flex gap-4">
                      <img
                        src={selectedItem.images?.[0]}
                        alt=""
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-gray-800 line-clamp-1">
                          {selectedItem.title}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <FaMapMarkerAlt className="text-primary" />
                          {selectedItem.location}
                        </p>
                        {userLocation && selectedItem.coordinates && (
                          <p className="text-xs text-gray-400 mt-1">
                            A {calculateDistance(
                              userLocation.lat, userLocation.lng,
                              selectedItem.coordinates.lat, selectedItem.coordinates.lng
                            ).toFixed(1)} km
                          </p>
                        )}
                        <Link
                          to={viewMode === 'trueques' 
                            ? `/trueque/${selectedItem.id}`
                            : `/hospedaje/${selectedItem.id}`
                          }
                          className="text-primary text-sm font-medium mt-2 inline-block"
                        >
                          Ver detalle →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Contador */}
            <div className="absolute top-4 right-4 bg-white px-3 py-2 rounded-lg shadow-md">
              <p className="text-sm font-medium">
                {sortedItems().length} {viewMode === 'trueques' ? 'trueques' : 'hospedajes'}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Lista inferior */}
      <div className="bg-white border-t max-h-48 overflow-y-auto">
        <p className="px-4 py-2 text-sm font-medium text-gray-500 border-b sticky top-0 bg-white">
          {viewMode === 'trueques' ? 'Trueques cercanos' : 'Hospedajes cercanos'}
        </p>
        {sortedItems().slice(0, 10).map((item) => (
          <Link
            key={item.id}
            to={viewMode === 'trueques' 
              ? `/trueque/${item.id}`
              : `/hospedaje/${item.id}`
            }
            className="flex items-center gap-3 p-3 border-b hover:bg-gray-50"
          >
            <img
              src={item.images?.[0]}
              alt=""
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{item.title}</p>
              <p className="text-xs text-gray-500 truncate">{item.location}</p>
            </div>
            {userLocation && item.coordinates && (
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {calculateDistance(
                  userLocation.lat, userLocation.lng,
                  item.coordinates.lat, item.coordinates.lng
                ).toFixed(1)} km
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}