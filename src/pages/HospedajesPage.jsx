export default function HospedajesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">🏠 TruequeStay</h1>
      
      <div className="bg-accent/10 border-2 border-accent rounded-xl p-8 mb-6">
        <h2 className="text-2xl font-bold mb-2">Intercambia hospedaje por servicios</h2>
        <p className="text-gray-600">
          Viaja y hospédate gratis ofreciendo tus habilidades
        </p>
      </div>

      <div className="bg-white rounded-xl p-12 text-center shadow-md">
        <p className="text-xl text-gray-600 mb-4">🏡✨</p>
        <p className="text-gray-600">No hay hospedajes disponibles todavía</p>
        <p className="text-sm text-gray-400 mt-2">
          Sé el primero en publicar un hospedaje
        </p>
      </div>
    </div>
  )
}