import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function CreateTrueque() {
  const navigate = useNavigate()
  const { userData } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    alert('Función de crear trueque en desarrollo. Por ahora solo es un demo.')
    navigate('/')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Publicar Trueque</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-md">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
            placeholder="¿Qué ofreces?"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input"
            rows="4"
            placeholder="Describe tu trueque..."
            required
          />
        </div>

        <button type="submit" className="btn-primary w-full">
          Publicar Trueque
        </button>
      </form>
    </div>
  )
}