import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '../utils/firebase'
import { useAuth } from '../context/AuthContext'
import TruequeCard from '../components/TruequeCard'
import { FaPlus, FaBed } from 'react-icons/fa'
import { CATEGORIES } from '../utils/categories'

export default function Home() {
  const { userData } = useAuth()
  const [trueques, setTrueques] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(null)

  useEffect(() => {
    loadTrueques()
  }, [selectedCategory])

  const loadTrueques = async () => {
    setLoading(true)
    try {
      let q = query(
        collection(db, 'trueques'),
        orderBy('createdAt', 'desc'),
        limit(20)
      )

      const snapshot = await getDocs(q)
      const truequesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      let filtered = truequesData
      if (selectedCategory) {
        filtered = truequesData.filter(t => t.category === selectedCategory)
      }

      setTrueques(filtered)
    } catch (error) {
      console.error('Error loading trueques:', error)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header con gamificación */}
      <div className="bg-gradient-to-r from-primary to-green-400 rounded-xl p-6 text-white mb-6 fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">¡Hola, {userData?.name}! 👋</h1>
            <p className="opacity-90">Nivel: {userData?.levelName}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{userData?.points || 0}</p>
            <p className="text-sm opacity-90">puntos</p>
          </div>
        </div>
        
        {/* Barra de progreso */}
        <div className="mt-4 bg-white/20 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all"
            style={{ width: `${((userData?.points || 0) % 200) / 2}%` }}
          />
        </div>
        <p className="text-sm opacity-90 mt-2">
          {200 - ((userData?.points || 0) % 200)} puntos para el siguiente nivel
        </p>
      </div>

      {/* Banner TruequeStay */}
      <Link
        to="/hospedajes"
        className="block bg-accent/10 border-2 border-accent rounded-xl p-6 mb-6 hover:bg-accent/20 transition-all fade-in"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🏠✨</div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">TruequeStay</h3>
              <p className="text-gray-600">Intercambia hospedaje por servicios</p>
            </div>
          </div>
          <FaBed className="text-3xl text-accent" />
        </div>
      </Link>

      {/* Botón crear trueque */}
      <div className="flex gap-3 mb-6">
        <Link
          to="/crear-trueque"
          className="flex-1 btn-primary flex items-center justify-center gap-2"
        >
          <FaPlus />
          Publicar Trueque
        </Link>
      </div>

      {/* Categorías */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Categorías</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
              !selectedCategory
                ? 'bg-primary text-white'
                : 'bg-white border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Todas
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-primary text-white'
                  : 'bg-white border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de trueques */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">
          {selectedCategory
            ? CATEGORIES.find(c => c.id === selectedCategory)?.name
            : 'Todos los trueques'}
        </h2>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="card animate-pulse">
                <div className="bg-gray-200 h-48" />
                <div className="p-4 space-y-3">
                  <div className="bg-gray-200 h-4 rounded w-3/4" />
                  <div className="bg-gray-200 h-4 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : trueques.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay trueques disponibles</p>
            <Link to="/crear-trueque" className="btn-primary inline-block mt-4">
              Publicar el primero
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trueques.map(trueque => (
              <TruequeCard key={trueque.id} trueque={trueque} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}