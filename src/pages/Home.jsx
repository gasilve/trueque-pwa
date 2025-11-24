import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '../utils/firebase'
import { useAuth } from '../context/AuthContext'
import TruequeCard from '../components/TruequeCard'
import { CATEGORIES } from '../utils/categories'
import { FaPlus, FaBed, FaSearch, FaFilter, FaTimes } from 'react-icons/fa'

export default function Home() {
  const { userData } = useAuth()
  const [trueques, setTrueques] = useState([])
  const [filteredTrueques, setFilteredTrueques] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadTrueques()
  }, [])

  // Filtrar cuando cambian los filtros
  useEffect(() => {
    filterTrueques()
  }, [trueques, selectedCategory, selectedSubcategory, searchQuery])

  const loadTrueques = async () => {
    setLoading(true)
    try {
      // Query simple sin where para evitar problemas de índices
      const q = query(
        collection(db, 'trueques'),
        orderBy('createdAt', 'desc'),
        limit(50)
      )

      const snapshot = await getDocs(q)
      const truequesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      // Filtrar solo los activos en el cliente
      const activeTrueques = truequesData.filter(t => t.status === 'active' || !t.status)
      
      console.log('Trueques cargados:', activeTrueques.length) // Debug
      setTrueques(activeTrueques)
      setFilteredTrueques(activeTrueques)
    } catch (error) {
      console.error('Error loading trueques:', error)
      // Si falla, intentar sin orderBy
      try {
        const q = query(collection(db, 'trueques'), limit(50))
        const snapshot = await getDocs(q)
        const truequesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setTrueques(truequesData)
        setFilteredTrueques(truequesData)
      } catch (err) {
        console.error('Error en fallback:', err)
      }
    }
    setLoading(false)
  }

  const filterTrueques = () => {
    let filtered = [...trueques]

    // Filtrar por categoría
    if (selectedCategory) {
      filtered = filtered.filter(t => t.category === selectedCategory)
    }

    // Filtrar por subcategoría
    if (selectedSubcategory) {
      filtered = filtered.filter(t => t.subcategory === selectedSubcategory)
    }

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(t => 
        t.title?.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query) ||
        t.categoryName?.toLowerCase().includes(query) ||
        t.location?.toLowerCase().includes(query)
      )
    }

    setFilteredTrueques(filtered)
  }

  const clearFilters = () => {
    setSelectedCategory(null)
    setSelectedSubcategory(null)
    setSearchQuery('')
  }

  const handleSearch = () => {
    filterTrueques()
  }

  const selectedCategoryData = CATEGORIES.find(c => c.id === selectedCategory)

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header con gamificación */}
      <div className="bg-gradient-to-r from-primary to-green-400 rounded-xl p-6 text-white mb-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">¡Hola, {userData?.name || 'Usuario'}! 👋</h1>
            <p className="opacity-90">{userData?.levelName || 'Semilla 🌱'}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{userData?.points || 0}</p>
            <p className="text-sm opacity-90">puntos</p>
          </div>
        </div>
        
        {/* Barra de progreso */}
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1">
            <span>Nivel {userData?.level || 1}</span>
            <span>{(userData?.points || 0) % 200}/200 pts</span>
          </div>
          <div className="bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(((userData?.points || 0) % 200) / 2, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Buscador y Filtros */}
      <div className="bg-white rounded-xl p-4 shadow-md mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Buscar trueques..."
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-lg flex items-center gap-2 transition-all ${
              showFilters || selectedCategory
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaFilter />
            <span className="hidden sm:inline">Filtros</span>
            {selectedCategory && (
              <span className="bg-white text-primary text-xs px-1.5 py-0.5 rounded-full">
                1
              </span>
            )}
          </button>
        </div>

        {/* Panel de Filtros */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t animate-fadeIn">
            {/* Categorías */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-3">Categoría</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setSelectedCategory(null)
                    setSelectedSubcategory(null)
                  }}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                    !selectedCategory
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  Todas
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id === selectedCategory ? null : cat.id)
                      setSelectedSubcategory(null)
                    }}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                      selectedCategory === cat.id
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Subcategorías */}
            {selectedCategoryData?.subcategories && (
              <div className="mb-4 animate-fadeIn">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Subcategoría de {selectedCategoryData.name}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedSubcategory(null)}
                    className={`px-3 py-2 rounded-full text-sm transition-all ${
                      !selectedSubcategory
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    Todas
                  </button>
                  {selectedCategoryData.subcategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSubcategory(sub.id === selectedSubcategory ? null : sub.id)}
                      className={`px-3 py-2 rounded-full text-sm transition-all flex items-center gap-1 ${
                        selectedSubcategory === sub.id
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <span>{sub.icon}</span>
                      <span>{sub.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Limpiar filtros */}
            {(selectedCategory || searchQuery) && (
              <button
                onClick={clearFilters}
                className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
              >
                <FaTimes /> Limpiar filtros
              </button>
            )}
          </div>
        )}
      </div>

      {/* Banner TruequeStay */}
      <Link
        to="/hospedajes"
        className="block bg-gradient-to-r from-accent to-pink-400 rounded-xl p-6 mb-6 text-white hover:shadow-xl transition-all group"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              🏠 TruequeStay
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">NUEVO</span>
            </h3>
            <p className="opacity-90 mt-1">Intercambia hospedaje por servicios</p>
          </div>
          <FaBed className="text-4xl opacity-80 group-hover:scale-110 transition-transform" />
        </div>
      </Link>

      {/* Botón crear trueque */}
      <Link
        to="/crear-trueque"
        className="block bg-primary text-white rounded-xl p-4 mb-6 text-center font-semibold hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
      >
        <FaPlus className="inline mr-2" />
        Publicar Trueque
      </Link>

      {/* Contador de resultados */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">
          {selectedCategory
            ? `${CATEGORIES.find(c => c.id === selectedCategory)?.icon} ${CATEGORIES.find(c => c.id === selectedCategory)?.name}`
            : 'Todos los trueques'}
        </h2>
        <span className="text-gray-500 text-sm bg-gray-100 px-3 py-1 rounded-full">
          {filteredTrueques.length} resultado{filteredTrueques.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Lista de trueques */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="card animate-pulse">
              <div className="bg-gray-200 h-48" />
              <div className="p-4 space-y-3">
                <div className="bg-gray-200 h-4 rounded w-3/4" />
                <div className="bg-gray-200 h-4 rounded w-1/2" />
                <div className="bg-gray-200 h-3 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredTrueques.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <p className="text-6xl mb-4">📦</p>
          <p className="text-xl text-gray-600 mb-2">
            {trueques.length === 0 
              ? 'No hay trueques publicados todavía'
              : 'No hay trueques con estos filtros'}
          </p>
          <p className="text-gray-500 mb-6">
            {trueques.length === 0
              ? '¡Sé el primero en publicar un trueque!'
              : 'Intenta con otra categoría o limpia los filtros'}
          </p>
          {trueques.length === 0 ? (
            <Link to="/crear-trueque" className="btn-primary inline-block">
              <FaPlus className="inline mr-2" />
              Publicar el primero
            </Link>
          ) : (
            <button onClick={clearFilters} className="btn-secondary">
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrueques.map(trueque => (
            <TruequeCard key={trueque.id} trueque={trueque} />
          ))}
        </div>
      )}

      {/* Debug info (remover en producción) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs text-gray-500">
          <p>Debug: {trueques.length} trueques cargados, {filteredTrueques.length} mostrados</p>
        </div>
      )}
    </div>
  )
}