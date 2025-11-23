import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaHome, FaBed, FaMap, FaUser, FaComments, FaSignOutAlt } from 'react-icons/fa'

export default function Navbar() {
  const { currentUser, userData, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  if (!currentUser) return null

  const navItems = [
    { path: '/', icon: FaHome, label: 'Inicio' },
    { path: '/hospedajes', icon: FaBed, label: 'Hospedaje' },
    { path: '/mapa', icon: FaMap, label: 'Mapa' },
    { path: '/chat', icon: FaComments, label: 'Chat' },
    { path: '/perfil', icon: FaUser, label: 'Perfil' },
  ]

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:block bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <span className="font-bold text-xl text-gray-800">Trueque</span>
            </Link>

            {/* Nav Links */}
            <div className="flex items-center gap-6">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-all"
              >
                <FaSignOutAlt />
                <span>Salir</span>
              </button>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-semibold text-sm">{userData?.name}</p>
                <p className="text-xs text-gray-500">{userData?.levelName}</p>
              </div>
              <img
                src={userData?.photo}
                alt={userData?.name}
                className="w-10 h-10 rounded-full border-2 border-primary"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center flex-1 h-full ${
                  isActive ? 'text-primary' : 'text-gray-400'
                }`}
              >
                <Icon className="text-xl" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}