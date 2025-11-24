import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { 
  collection, query, where, orderBy, onSnapshot, addDoc, 
  getDocs, doc, getDoc, updateDoc, serverTimestamp 
} from 'firebase/firestore'
import { db } from '../utils/firebase'
import { useAuth } from '../context/AuthContext'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { FaPaperPlane, FaArrowLeft, FaUser, FaImage } from 'react-icons/fa'

export default function ChatPage() {
  const [searchParams] = useSearchParams()
  const { currentUser, userData } = useAuth()
  
  const [conversations, setConversations] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Cargar conversaciones
  useEffect(() => {
    if (!currentUser) return

    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', currentUser.uid),
      orderBy('lastMessageAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setConversations(chats)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [currentUser])

  // Crear o abrir chat si viene de un trueque
  useEffect(() => {
    const userId = searchParams.get('userId')
    const truequeId = searchParams.get('truequeId')
    
    if (userId && userId !== currentUser?.uid) {
      createOrOpenChat(userId, truequeId)
    }
  }, [searchParams, currentUser])

  // Cargar mensajes del chat seleccionado
  useEffect(() => {
    if (!selectedChat) return

    const q = query(
      collection(db, 'chats', selectedChat.id, 'messages'),
      orderBy('createdAt', 'asc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setMessages(msgs)
      scrollToBottom()
    })

    return () => unsubscribe()
  }, [selectedChat])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const createOrOpenChat = async (otherUserId, truequeId) => {
    try {
      // Buscar chat existente
      const existingChat = conversations.find(c => 
        c.participants.includes(otherUserId)
      )

      if (existingChat) {
        setSelectedChat(existingChat)
        return
      }

      // Obtener info del otro usuario
      const otherUserDoc = await getDoc(doc(db, 'users', otherUserId))
      const otherUser = otherUserDoc.data()

      // Crear nuevo chat
      const chatData = {
        participants: [currentUser.uid, otherUserId],
        participantsInfo: {
          [currentUser.uid]: {
            name: userData?.name,
            photo: userData?.photo
          },
          [otherUserId]: {
            name: otherUser?.name,
            photo: otherUser?.photo
          }
        },
        truequeId: truequeId || null,
        lastMessage: '',
        lastMessageAt: serverTimestamp(),
        createdAt: serverTimestamp()
      }

      const docRef = await addDoc(collection(db, 'chats'), chatData)
      setSelectedChat({ id: docRef.id, ...chatData })
      
    } catch (error) {
      console.error('Error creating chat:', error)
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedChat || sending) return

    setSending(true)
    const messageText = newMessage.trim()
    setNewMessage('')

    try {
      // Agregar mensaje
      await addDoc(collection(db, 'chats', selectedChat.id, 'messages'), {
        text: messageText,
        senderId: currentUser.uid,
        senderName: userData?.name,
        senderPhoto: userData?.photo,
        createdAt: serverTimestamp()
      })

      // Actualizar último mensaje del chat
      await updateDoc(doc(db, 'chats', selectedChat.id), {
        lastMessage: messageText,
        lastMessageAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error sending message:', error)
      setNewMessage(messageText)
    }

    setSending(false)
    inputRef.current?.focus()
  }

  const getOtherUser = (chat) => {
    const otherUserId = chat.participants.find(id => id !== currentUser?.uid)
    return chat.participantsInfo?.[otherUserId] || { name: 'Usuario', photo: null }
  }

  // Vista de lista de conversaciones
  const ConversationsList = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-white">
        <h1 className="text-2xl font-bold text-gray-800">💬 Chats</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-40" />
                </div>
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-12 px-4">
            <p className="text-6xl mb-4">💬</p>
            <p className="text-xl text-gray-600 mb-2">No tienes conversaciones</p>
            <p className="text-gray-500">
              Cuando contactes a alguien por un trueque, aparecerá aquí
            </p>
          </div>
        ) : (
          conversations.map(chat => {
            const otherUser = getOtherUser(chat)
            return (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 border-b text-left"
              >
                {otherUser.photo ? (
                  <img
                    src={otherUser.photo}
                    alt=""
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <FaUser className="text-primary" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800">{otherUser.name}</p>
                  <p className="text-sm text-gray-500 truncate">
                    {chat.lastMessage || 'Nuevo chat'}
                  </p>
                </div>
                {chat.lastMessageAt && (
                  <span className="text-xs text-gray-400">
                    {formatDistanceToNow(chat.lastMessageAt.toDate(), {
                      addSuffix: false,
                      locale: es
                    })}
                  </span>
                )}
              </button>
            )
          })
        )}
      </div>
    </div>
  )

  // Vista del chat
  const ChatView = () => {
    const otherUser = getOtherUser(selectedChat)
    
    return (
      <div className="flex flex-col h-full bg-gray-50">
        {/* Header */}
        <div className="p-4 bg-white border-b flex items-center gap-3">
          <button
            onClick={() => setSelectedChat(null)}
            className="text-gray-600 hover:text-primary"
          >
            <FaArrowLeft />
          </button>
          {otherUser.photo ? (
            <img
              src={otherUser.photo}
              alt=""
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <FaUser className="text-primary" />
            </div>
          )}
          <div>
            <p className="font-medium text-gray-800">{otherUser.name}</p>
            <p className="text-xs text-green-500">En línea</p>
          </div>
        </div>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUser?.uid
            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    isMe
                      ? 'bg-primary text-white rounded-br-md'
                      : 'bg-white text-gray-800 rounded-bl-md shadow-sm'
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className={`text-xs mt-1 ${isMe ? 'text-white/70' : 'text-gray-400'}`}>
                    {msg.createdAt && formatDistanceToNow(msg.createdAt.toDate(), {
                      addSuffix: true,
                      locale: es
                    })}
                  </p>
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} className="p-4 bg-white border-t">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-full focus:border-primary focus:outline-none"
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 transition-all"
            >
              <FaPaperPlane />
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-80px)]">
      {selectedChat ? <ChatView /> : <ConversationsList />}
    </div>
  )
}