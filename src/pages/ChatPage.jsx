export default function ChatPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">💬 Chats</h1>
      
      <div className="bg-white rounded-xl p-12 text-center shadow-md">
        <p className="text-xl text-gray-600 mb-4">💬</p>
        <p className="text-gray-600">No tienes conversaciones todavía</p>
        <p className="text-sm text-gray-400 mt-2">
          Los chats aparecerán aquí cuando inicies una conversación
        </p>
      </div>
    </div>
  )
}