import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

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
import LegalPage from './pages/LegalPage'
import VerifyIdentity from './pages/VerifyIdentity'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-background">
          <Navbar />
          <main className="flex-1 pb-20 md:pb-0">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/legal" element={<LegalPage />} />
              
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
              <Route path="/verificar" element={<ProtectedRoute><VerifyIdentity /></ProtectedRoute>} />
              
              {/* Redirect */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App