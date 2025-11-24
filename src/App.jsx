import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import CreateTrueque from './pages/CreateTrueque'
import TruequeDetail from './pages/TruequeDetail'
import HospedajesPage from './pages/HospedajesPage'
import CreateHospedaje from './pages/CreateHospedaje'
import HospedajeDetail from './pages/HospedajeDetail'
import MapPage from './pages/MapPage'
import ChatPage from './pages/ChatPage'
import ProfilePage from './pages/ProfilePage'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="pb-20">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/crear-trueque" element={<ProtectedRoute><CreateTrueque /></ProtectedRoute>} />
              <Route path="/trueque/:id" element={<ProtectedRoute><TruequeDetail /></ProtectedRoute>} />
              <Route path="/hospedajes" element={<ProtectedRoute><HospedajesPage /></ProtectedRoute>} />
              <Route path="/crear-hospedaje" element={<ProtectedRoute><CreateHospedaje /></ProtectedRoute>} />
              <Route path="/hospedaje/:id" element={<ProtectedRoute><HospedajeDetail /></ProtectedRoute>} />
              <Route path="/mapa" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
              <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
              <Route path="/perfil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              
              {/* Redirect */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App