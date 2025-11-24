import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, getDocs } from 'firebase/firestore'
import { db } from '../utils/firebase'
import { CATEGORIES } from '../utils/categories'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { FaFilter, FaTimes, FaSpinner, FaMapMarkerAlt, FaList } from 'react-icons/fa'

// Fix para iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Iconos personalizados por categoría
const createCategoryIcon = (emoji, color = '#3AC9A8') => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        border: 3px solid white;
      ">${emoji}</div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  })
}

// Icono del usuario
const userIcon = L.divIcon({
  className: 'user-marker',
  html: `
    <div style="
      background-color: #3B82F6;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 4px solid white;
      box-shadow: 0 0 0 2px #3B82F6, 0 2px 10px rgba(0,0,0,0.3);
    "></div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
})

// Componente para centrar el mapa
function SetViewOnLocation({ coords }) {
  const map = useMap()
  useEffect(() => {
    if (coords) {
      map.setView([coords.lat, coords.lng], 13)
    }
  }, [coords, map])
  return null
}

export default function MapPage() {
  const [trueques, setTrueques] = useState([])
  const [hospedajes, setHospedajes] = useState([])
  const [loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('trueques')
  const [showList, setShowList] = useState(false)

  // Ubicación por defecto (Buenos Aires)
  const defaultLocation = { lat: -34.6037, lng: -58.3816 }

  useEffect(() => {
    getUserLocation()
    loadData()
  }, [viewMode])

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
          setUserLocation(defaultLocation)
        },
        { enableHighAccuracy: true }
      )
    } else {
      setUserLocation(defaultLocation)
    }
  }

  const loadData = async () => {
    setLoading(true)
    try {
      if (viewMode === 'trueques') {
        const q = query(collection(db, 'trueques'))
        const snapshot = await getDocs(q)
        const data = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(t => t.coordinates && (t.status === 'active' || !t.status))
        setTrueques(data)
      } else {
        const q = query(collection(db, 'hospedajes'))
        const snapshot = await getDocs(q)
        const data = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(h => h.coordinates && (h.status === 'active' || !h.status))
        setHospedajes(data)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    }
    setLoading(false)
  }

  // Filtrar items
  const filteredItems = () => {
    const items = viewMode === 'trueques' ? trueques : hospedajes
    if (!selectedCategory) return items
    return items.filter(item => item.category === selectedCategory)
  }

  // Calcular distancia
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const mapCenter = userLocation || defaultLocation

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-md p-4 z-20 relative">
        {/* Toggle Trueques/Hospedajes */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setViewMode('trueques')}
            className={`flex-1 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'trueques'
                ? 'bg-primary text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            📦 Trueques ({trueques.length})
          </button>
          <button
            onClick={() => setViewMode('hospedajes')}
            className={`flex-1 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'hospedajes'
                ? 'bg-accent text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            🏠 Hospedajes ({hospedajes.length})
          </button>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 flex-1 justify-center ${
              showFilters || selectedCategory
                ? 'bg-primary text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <FaFilter />
            Filtros
            {selectedCategory && <span className="bg-white text-primary text-xs px-1.5 rounded-full">1</span>}
          </button>
          <button
            onClick={() => setShowList(!showList)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              showList ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <FaList />
          </button>
          <button
            onClick={getUserLocation}
            className="px-4 py-2 rounded-lg bg-blue-500 text-white flex items-center gap-2"
          >
            <FaMapMarkerAlt />
          </button>
        </div>

        {/* Panel de filtros */}
        {showFilters && viewMode === 'trueques' && (
          <div className="mt-3 pt-3 border-t animate-fadeIn">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1 rounded-full text-sm ${
                  !selectedCategory ? 'bg-primary text-white' : 'bg-gray-100'
                }`}
              >
                Todas
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
                  className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                    selectedCategory === cat.id ? 'bg-primary text-white' : 'bg-gray-100'
                  }`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mapa */}
      <div className="flex-1 relative">
        {loading ? (
          <div className="h-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <FaSpinner className="animate-spin text-4xl text-primary mx-auto mb-4" />
              <p className="text-gray-600">Cargando mapa...</p>
            </div>
          </div>
        ) : (
          <MapContainer
            center={[mapCenter.lat, mapCenter.lng]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            className="z-10"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <SetViewOnLocation coords={userLocation} />

            {/* Marcador del usuario */}
            {userLocation && (
              <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                <Popup>
                  <div className="text-center">
                    <p className="font-bold">📍 Tu ubicación</p>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Marcadores de trueques/hospedajes */}
            {filteredItems().map((item) => {
              const category = CATEGORIES.find(c => c.id === item.category)
              const icon = createCategoryIcon(
                viewMode === 'hospedajes' ? '🏠' : (category?.icon || '📦'),
                viewMode === 'hospedajes' ? '#FF6B9D' : (category?.color || '#3AC9A8')
              )
              
              return (
                <Marker
                  key={item.id}
                  position={[item.coordinates.lat, item.coordinates.lng]}
                  icon={icon}
                >
                  <Popup>
                    <div className="min-w-[200px]">
                      {item.images?.[0] && (
                        <img 
                          src={item.images[0]} 
                          alt="" 
                          className="w-full h-24 object-cover rounded-t-lg -mt-3 -mx-3 mb-2"
                          style={{ width: 'calc(100% + 24px)' }}
                        />
                      )}
                      <h3 className="font-bold text-gray-800 line-clamp-1">{item.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">{item.description}</p>
                      <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                        <FaMapMarkerAlt className="text-primary" />
                        {item.location}
                      </p>
                      {userLocation && (
                        <p className="text-xs text-gray-400">
                          A {calculateDistance(
                            userLocation.lat, userLocation.lng,
                            item.coordinates.lat, item.coordinates.lng
                          ).toFixed(1)} km
                        </p>
                      )}
                      <Link
                        to={viewMode === 'trueques' ? `/trueque/${item.id}` : `/hospedaje/${item.id}`}
                        className="block mt-3 text-center bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary/90"
                      >
                        Ver detalle
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              )
            })}
          </MapContainer>
        )}

        {/* Lista lateral */}
        {showList && (
          <div className="absolute top-0 right-0 w-80 h-full bg-white shadow-xl z-20 overflow-hidden animate-fadeIn">
            <div className="p-3 border-b flex items-center justify-between bg-gray-50">
              <h3 className="font-bold text-gray-800">
                {filteredItems().length} {viewMode === 'trueques' ? 'trueques' : 'hospedajes'}
              </h3>
              <button onClick={() => setShowList(false)} className="text-gray-400 hover:text-gray-600">
                <FaTimes />
              </button>
            </div>
            <div className="overflow-y-auto h-[calc(100%-50px)]">
              {filteredItems().map((item) => (
                <Link
                  key={item.id}
                  to={viewMode === 'trueques' ? `/trueque/${item.id}` : `/hospedaje/${item.id}`}
                  className="flex gap-3 p-3 border-b hover:bg-gray-50"
                >
                  <img
                    src={item.images?.[0] || 'https://via.placeholder.com/60'}
                    alt=""
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-clamp-1">{item.title}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{item.location}</p>
                    {userLocation && item.coordinates && (
                      <p className="text-xs text-primary mt-1">
                        {calculateDistance(
                          userLocation.lat, userLocation.lng,
                          item.coordinates.lat, item.coordinates.lng
                        ).toFixed(1)} km
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}