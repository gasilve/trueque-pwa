import { Link } from 'react-router-dom'
import { FaMapMarkerAlt, FaStar, FaClock, FaHeart } from 'react-icons/fa'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

export default function TruequeCard({ trueque }) {
  return (
    <Link 
      to={`/trueque/${trueque.id}`} 
      className="card group hover:scale-[1.02] transition-all duration-300"
    >
      {/* Imagen */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={trueque.images?.[0] || 'https://via.placeholder.com/300x200?text=Sin+imagen'}
          alt={trueque.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-2">
          {trueque.isUrgent && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
              🔥 URGENTE
            </span>
          )}
        </div>
        
        {/* Like button */}
        <button 
          className="absolute top-2 right-2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white hover:text-red-500 transition-all"
          onClick={(e) => {
            e.preventDefault()
            // TODO: Implementar like
          }}
        >
          <FaHeart className="text-gray-400" />
        </button>

        {/* Categoría overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
          <div className="flex items-center gap-1 text-white text-sm">
            <span>{trueque.categoryIcon}</span>
            <span>{trueque.categoryName}</span>
            {trueque.subcategoryName && (
              <>
                <span>•</span>
                <span>{trueque.subcategoryName}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        {/* Título */}
        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {trueque.title}
        </h3>

        {/* Descripción */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {trueque.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {/* Usuario */}
          <div className="flex items-center gap-2">
            <img
              src={trueque.userPhoto || `https://ui-avatars.com/api/?name=${trueque.userName}&background=3AC9A8&color=fff`}
              alt={trueque.userName}
              className="w-8 h-8 rounded-full border border-gray-200"
            />
            <div>
              <p className="text-sm font-medium text-gray-800">{trueque.userName}</p>
              <div className="flex items-center gap-1">
                <FaStar className="text-yellow-500 text-xs" />
                <span className="text-xs text-gray-500">
                  {trueque.userRating > 0 ? trueque.userRating.toFixed(1) : 'Nuevo'}
                </span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="text-right">
            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <FaMapMarkerAlt />
              <span className="truncate max-w-[100px]">{trueque.location}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
              <FaClock />
              <span>
                {trueque.createdAt && formatDistanceToNow(new Date(trueque.createdAt), {
                  addSuffix: true,
                  locale: es
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}