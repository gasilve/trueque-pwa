import { createContext, useContext, useState, useEffect } from 'react'
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../utils/firebase'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Registro
  async function register(email, password, name) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    
    // Crear documento de usuario en Firestore
    const userDoc = {
      uid: userCredential.user.uid,
      email: email,
      name: name,
      photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3AC9A8&color=fff&size=200`,
      phone: '',
      location: '',
      rating: 0,
      reviewsCount: 0,
      truequesPublicados: 0,
      truequesRealizados: 0,
      points: 0,
      level: 1,
      levelName: 'Semilla 🌱',
      verified: false,
      createdAt: new Date().toISOString()
    }
    
    await setDoc(doc(db, 'users', userCredential.user.uid), userDoc)
    
    return userCredential
  }

  // Login
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  // Login con Google
  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    
    // Verificar si el usuario ya existe
    const userDoc = await getDoc(doc(db, 'users', result.user.uid))
    
    if (!userDoc.exists()) {
      // Crear nuevo usuario
      const newUserDoc = {
        uid: result.user.uid,
        email: result.user.email,
        name: result.user.displayName,
        photo: result.user.photoURL,
        phone: '',
        location: '',
        rating: 0,
        reviewsCount: 0,
        truequesPublicados: 0,
        truequesRealizados: 0,
        points: 0,
        level: 1,
        levelName: 'Semilla 🌱',
        verified: false,
        createdAt: new Date().toISOString()
      }
      
      await setDoc(doc(db, 'users', result.user.uid), newUserDoc)
    }
    
    return result
  }

  // Logout
  function logout() {
    return signOut(auth)
  }

  // Actualizar puntos
  async function addPoints(points, reason) {
    if (!currentUser) return
    
    const userRef = doc(db, 'users', currentUser.uid)
    const userSnap = await getDoc(userRef)
    
    if (userSnap.exists()) {
      const currentPoints = userSnap.data().points || 0
      const newPoints = currentPoints + points
      
      // Calcular nivel
      let level = 1
      let levelName = 'Semilla 🌱'
      
      if (newPoints >= 1000) {
        level = 5
        levelName = 'Guardián 🏆'
      } else if (newPoints >= 500) {
        level = 4
        levelName = 'Árbol 🌳'
      } else if (newPoints >= 200) {
        level = 3
        levelName = 'Arbusto 🌿'
      } else if (newPoints >= 50) {
        level = 2
        levelName = 'Brote 🌱'
      }
      
      await updateDoc(userRef, {
        points: newPoints,
        level: level,
        levelName: levelName
      })
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      
      if (user) {
        // Cargar datos del usuario desde Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          setUserData(userDoc.data())
        }
      } else {
        setUserData(null)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    userData,
    register,
    login,
    loginWithGoogle,
    logout,
    addPoints
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}