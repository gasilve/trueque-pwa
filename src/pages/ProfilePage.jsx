import { useAuth } from '../context/AuthContext'

export default function ProfilePage() {
  const { userData, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="text-center mb-6">
          <img
            src={userData?.photo}
            alt={userData?.name}
            className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-primary"
          />
          <h1 className="text-2xl font-bold">{userData?.name}</h1>
          <p className="text-gray-600">{userData?.email}</p>
          <p className="text-primary font-semibold mt-2">{userData?.levelName}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-primary">{userData?.points || 0}</p>
            <p className="text-sm text-gray-600">Puntos</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-primary">{userData?.truequesPublicados || 0}</p>
            <p className="text-sm text-gray-600">Publicados</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-primary">{userData?.truequesRealizados || 0}</p>
            <p className="text-sm text-gray-600">Realizados</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-all"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  )
}