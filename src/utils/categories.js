export const CATEGORIES = [
  { id: 'objetos', name: 'Objetos', icon: '📦' },
  { id: 'ropa', name: 'Ropa', icon: '👕' },
  { id: 'tecnologia', name: 'Tecnología', icon: '💻' },
  { id: 'hogar', name: 'Hogar', icon: '🏠' },
  { id: 'libros', name: 'Libros', icon: '📚' },
  { id: 'deportes', name: 'Deportes', icon: '⚽' },
  { id: 'musica', name: 'Música', icon: '🎵' },
  { id: 'servicios', name: 'Servicios', icon: '🛠️' }
]

export const SPACE_TYPES = [
  { id: 'private', name: 'Habitación Privada', icon: '🚪' },
  { id: 'shared', name: 'Habitación Compartida', icon: '🛏️' },
  { id: 'entire', name: 'Espacio Completo', icon: '🏡' },
  { id: 'couch', name: 'Sofá', icon: '🛋️' }
]

export const AMENITIES = [
  { id: 'wifi', name: 'WiFi', icon: '📶' },
  { id: 'cocina', name: 'Cocina', icon: '🍳' },
  { id: 'bano', name: 'Baño Privado', icon: '🚿' },
  { id: 'parking', name: 'Estacionamiento', icon: '🚗' },
  { id: 'ac', name: 'Aire Acondicionado', icon: '❄️' },
  { id: 'calefaccion', name: 'Calefacción', icon: '🔥' },
  { id: 'workspace', name: 'Espacio de Trabajo', icon: '💼' },
  { id: 'lavadora', name: 'Lavadora', icon: '🧺' },
  { id: 'mascotas', name: 'Mascotas Permitidas', icon: '🐕' }
]

export const HOSPEDAJE_EXCHANGE_TYPES = {
  trabajo: {
    name: 'Trabajo Doméstico',
    options: [
      { id: 'limpieza', name: 'Limpieza', icon: '🧹' },
      { id: 'cocinar', name: 'Cocinar', icon: '👨‍🍳' },
      { id: 'jardineria', name: 'Jardinería', icon: '🌱' },
      { id: 'mascotas', name: 'Cuidar mascotas', icon: '🐕' },
      { id: 'lavanderia', name: 'Lavandería', icon: '🧺' }
    ]
  },
  habilidades: {
    name: 'Habilidades',
    options: [
      { id: 'diseno', name: 'Diseño', icon: '🎨' },
      { id: 'programacion', name: 'Programación', icon: '💻' },
      { id: 'idiomas', name: 'Enseñar idiomas', icon: '🗣️' },
      { id: 'musica', name: 'Música', icon: '🎵' },
      { id: 'fotografia', name: 'Fotografía', icon: '📸' },
      { id: 'entrenamiento', name: 'Entrenamiento', icon: '💪' }
    ]
  },
  compania: {
    name: 'Compañía & Experiencias',
    options: [
      { id: 'poesia', name: 'Leer poesía', icon: '📜' },
      { id: 'historias', name: 'Contar historias', icon: '📖' },
      { id: 'musica_vivo', name: 'Tocar música', icon: '🎸' },
      { id: 'juegos', name: 'Juegos de mesa', icon: '🎲' },
      { id: 'conversacion', name: 'Conversación', icon: '💬' },
      { id: 'cultural', name: 'Intercambio cultural', icon: '🌍' }
    ]
  },
  ensenanza: {
    name: 'Enseñanza',
    options: [
      { id: 'musica_clase', name: 'Clases de música', icon: '🎹' },
      { id: 'cocina_clase', name: 'Clases de cocina', icon: '🍳' },
      { id: 'yoga', name: 'Yoga/Meditación', icon: '🧘' },
      { id: 'baile', name: 'Clases de baile', icon: '💃' },
      { id: 'arte', name: 'Arte/Manualidades', icon: '🎨' }
    ]
  }
}