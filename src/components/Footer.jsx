import { Link } from 'react-router-dom'
import { FaHeart, FaShieldAlt, FaQuestionCircle, FaEnvelope } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      {/* Links principales */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Columna 1: Trueque */}
          <div>
            <h3 className="font-bold text-lg mb-4">🔄 Trueque</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Explorar trueques
                </Link>
              </li>
              <li>
                <Link to="/crear-trueque" className="hover:text-primary transition-colors">
                  Publicar trueque
                </Link>
              </li>
              <li>
                <Link to="/mapa" className="hover:text-primary transition-colors">
                  Mapa
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 2: TruequeStay */}
          <div>
            <h3 className="font-bold text-lg mb-4">🏠 TruequeStay</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/hospedajes" className="hover:text-accent transition-colors">
                  Ver hospedajes
                </Link>
              </li>
              <li>
                <Link to="/crear-hospedaje" className="hover:text-accent transition-colors">
                  Publicar hospedaje
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Seguridad */}
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <FaShieldAlt className="text-green-400" /> Seguridad
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/legal" className="hover:text-white transition-colors">
                  Términos de uso
                </Link>
              </li>
              <li>
                <Link to="/legal" className="hover:text-white transition-colors">
                  Consejos de seguridad
                </Link>
              </li>
              <li>
                <Link to="/legal" className="hover:text-white transition-colors">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link to="/verificar" className="hover:text-white transition-colors">
                  Verificar identidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Ayuda */}
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <FaQuestionCircle className="text-blue-400" /> Ayuda
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/legal" className="hover:text-white transition-colors">
                  Cómo funciona
                </Link>
              </li>
              <li>
                <a href="mailto:soporte@trueque.app" className="hover:text-white transition-colors flex items-center gap-1">
                  <FaEnvelope className="text-sm" /> Contacto
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Línea divisoria */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Logo y copyright */}
            <div className="flex items-center gap-2 text-gray-400">
              <span className="text-2xl">🔄</span>
              <span>© {new Date().getFullYear()} Trueque. Todos los derechos reservados.</span>
            </div>

            {/* Hecho con amor */}
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              Hecho con <FaHeart className="text-red-500 animate-pulse" /> en Argentina 🇦🇷
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}