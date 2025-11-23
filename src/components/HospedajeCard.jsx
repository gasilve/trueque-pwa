import { Link } from 'react-router-dom'
import { FaMapMarkerAlt, FaStar, FaCheckCircle } from 'react-icons/fa'

export default function HospedajeCard({ hospedaje }) {
  return (
    <Link to={`/hospedaje/${hospedaje.id}`} className="card hover:scale-[1.02] transition-transform">
      {/* Imagen */}
      <div className="relative h-48">
        <img
          src={hospedaje.images[0]}
          alt={hospedaje.title}
          className="w-full h-full object-cover"
        />
        {hospedaje.hostVerified && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <FaCheckCircle />
            Verificado
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4">
        {/* Ubicación */}
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
          <FaMapMarkerAlt />
          <span>{hospedaje.location.city}, {hospedaje.location.country}</span>
        </div>

        {/* Título */}
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{hospedaje.title}</h3>

        {/* Tipo de espacio */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">{hospedaje.spaceTypeIcon}</span>
          <span className="text-sm text-gray-600">{hospedaje.spaceTypeName}</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {/* Anfitrión */}
          <div className="flex items-center gap-2">
            <img
              src={hospedaje.hostPhoto}
              alt={hospedaje.hostName}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm font-semibold">{hospedaje.hostName}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-500" />
            <span className="font-semibold">
              {hospedaje.rating > 0 ? hospedaje.rating.toFixed(1) : 'Nuevo'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}