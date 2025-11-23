import { Link } from 'react-router-dom'
import { FaMapMarkerAlt, FaStar, FaClock } from 'react-icons/fa'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

export default function TruequeCard({ trueque }) {
  return (
    <Link to={`/trueque/${trueque.id}`} className="card hover:scale-[1.02] transition-transform">
      {/* Imagen */}
      <div className="relative h-48">
        <img
          src={trueque.images[0]}
          alt={trueque.title}
          className="w-full h-full object-cover"
        />
        {trueque.isUrgent && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            🔥 URGENTE
          </div>
        )}
        {trueque.isRemate && (
          <div className="absolute top-2 left-2 bg-accent text-white px-3 py-1 rounded-full text-sm font-bold">
            💰 REMATE
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4">
        {/* Categoría */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{trueque.categoryIcon}</span>
          <span className="text-sm text-gray-500">{trueque.categoryName}</span>
        </div>

        {/* Título */}
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{trueque.title}</h3>

        {/* Descripción */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{trueque.description}</p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {/* Usuario */}
          <div className="flex items-center gap-2">
            <img
              src={trueque.userPhoto}
              alt={trueque.userName}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="text-sm font-semibold">{trueque.userName}</p>
              <div className="flex items-center gap-1">
                <FaStar className="text-yellow-500 text-xs" />
                <span className="text-xs text-gray-500">
                  {trueque.userRating > 0 ? trueque.userRating.toFixed(1) : 'Nuevo'}
                </span>
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div className="text-right">
            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <FaMapMarkerAlt />
              <span>{trueque.location}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
              <FaClock />
              <span>
                {formatDistanceToNow(new Date(trueque.createdAt), {
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