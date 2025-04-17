import { useState } from 'react'
import { motion } from 'framer-motion'
import './App.css'

interface GiftList {
  id: number
  type: string
  title: string
  items: string[]
}

function App() {
  const [view, setView] = useState<'login' | 'register' | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authenticatedEmail, setAuthenticatedEmail] = useState<string | null>(null)
  const [giftLists, setGiftLists] = useState<GiftList[]>([])
  const [selectedList, setSelectedList] = useState<GiftList | null>(null)
  const [creatingListType, setCreatingListType] = useState<string | null>(null)
  const [newListTitle, setNewListTitle] = useState('')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (email === 'prueba@correo.com' && password === '123456') {
      setAuthenticatedEmail(email)
      setView(null)
    } else {
      alert('Correo o contraseña incorrectos')
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Solo está habilitado el login con la cuenta de prueba por ahora.')
  }

  const handleCardClick = (type: string) => {
    if (!authenticatedEmail) {
      alert('Primero tienes que registrarte o iniciar sesión')
    } else {
      setCreatingListType(type)
    }
  }

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault()
    if (newListTitle.trim() === '') {
      alert('Por favor ingresa un nombre para la lista')
      return
    }

    const newList: GiftList = {
      id: Date.now(),
      type: creatingListType!,
      title: newListTitle,
      items: [],
    }

    setGiftLists([...giftLists, newList])
    setCreatingListType(null)
    setNewListTitle('')
  }

  const handleLogout = () => {
    setAuthenticatedEmail(null)
    setView(null)
    setEmail('')
    setPassword('')
    setGiftLists([])
    setSelectedList(null)
  }

  const handleSaveTitle = () => {
    if (selectedList && editedTitle.trim() !== '') {
      const updatedLists = giftLists.map((list) =>
        list.id === selectedList.id ? { ...list, title: editedTitle } : list
      )
      setGiftLists(updatedLists)
      setSelectedList({ ...selectedList, title: editedTitle })
      setIsEditingTitle(false)
    }
  }

  const handleDeleteList = () => {
    if (selectedList && confirm('¿Estás seguro de que quieres eliminar esta lista?')) {
      setGiftLists((prevLists) => prevLists.filter((list) => list.id !== selectedList.id))
      setSelectedList(null)
    }
  }

  return (
    <>
      <header className="app-header">
        <h1 className="app-title">Gift - Registry</h1>
        {!authenticatedEmail && !view && (
          <>
            <button className="header-login-button" onClick={() => setView('login')}>
              Iniciar Sesión
            </button>
            <button className="header-registry-button" onClick={() => setView('register')}>
              Registrate!
            </button>
          </>
        )}
        {authenticatedEmail && (
          <div className="auth-info">
            <p className="welcome-msg">Bienvenido, {authenticatedEmail}</p>
            <button className="logout-button" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        )}
      </header>

      <main className="app-content">
        {view === 'login' && (
          <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
              <h2>Iniciar Sesión</h2>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Ingresar</button>
              <button
                type="button"
                onClick={() => {
                  setView(null)
                  setEmail('')
                  setPassword('')
                }}
                style={{
                  marginTop: '10px',
                  background: '#ccc',
                  color: '#333'
                }}
              >
                Volver
              </button>
            </form>
          </div>
        )}

        {view === 'register' && (
          <div className="login-container">
            <form className="login-form" onSubmit={handleRegister}>
              <h2>Registro</h2>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Registrarse</button>
              <button
                type="button"
                onClick={() => {
                  setView(null)
                  setEmail('')
                  setPassword('')
                }}
                style={{
                  marginTop: '10px',
                  background: '#ccc',
                  color: '#333'
                }}
              >
                Volver
              </button>
            </form>
          </div>
        )}

        {!view && !selectedList && !creatingListType && (
          <div className="main-page">
            {!authenticatedEmail && (
              <header>
                <h2>Todas las tiendas, un solo registro</h2>
                <h1>Agrega los regalos que quieras de cualquier tienda del mundo</h1>
              </header>
            )}

            <div className="card-container">
              {[
                { src: "/gift.png", label: "Create a Gift List", type: "Gift List" },
                { src: "/wedding.png", label: "Create a Wedding Registry", type: "Wedding Registry" },
                { src: "/baby.png", label: "Create a Baby Registry", type: "Baby Registry" },
                { src: "/heart.png", label: "Create a Nonprofit Gift List", type: "Nonprofit Gift List" },
              ].map((card) => (
                <motion.div
                  key={card.type}
                  className="card"
                  onClick={() => handleCardClick(card.type)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <img src={card.src} alt={card.label} />
                  <p>{card.label}</p>
                </motion.div>
              ))}
            </div>

            {authenticatedEmail && giftLists.length > 0 && (
              <>
                <h2 style={{ marginTop: '2rem' }}>Mis Listas</h2>
                <div className="card-container">
                  {giftLists.map((list) => (
                    <div
                      key={list.id}
                      className="card"
                      onClick={() => setSelectedList(list)}
                    >
                      <img
                        src={
                          list.type === 'Wedding Registry'
                            ? '/wedding.png'
                            : list.type === 'Baby Registry'
                            ? '/baby.png'
                            : list.type === 'Nonprofit Gift List'
                            ? '/heart.png'
                            : '/gift.png'
                        }
                        alt={list.type}
                      />
                      <p>{list.title}</p>
                      <small>{list.type}</small>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {creatingListType && (
          <div className="login-container">
            <form className="login-form" onSubmit={handleCreateList}>
              <h2>{creatingListType}</h2>
              <input
                type="text"
                placeholder="Escribe el nombre de tu nueva lista"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                required
              />
              <button type="submit">Crear Lista</button>
              <button
                type="button"
                onClick={() => {
                  setCreatingListType(null)
                  setNewListTitle('')
                }}
                style={{ marginTop: '10px', background: '#ccc', color: '#333' }}
              >
                Cancelar
              </button>
            </form>
          </div>
        )}

        {selectedList && (
          <div className="login-container">
            {isEditingTitle ? (
              <>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  style={{ background: 'white', color: 'black', fontSize: '1.2rem', padding: '0.5rem', marginBottom: '1rem' }}
                />
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button onClick={handleSaveTitle}
                  style={{ background: 'green', color: 'white' }}
                  >Guardar</button>
                  <button
                    onClick={() => {
                      setIsEditingTitle(false)
                      setEditedTitle('')
                    }}
                    style={{ background: 'red', color: '#333' }}
                  >
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 style={{color: 'black'}}>{selectedList.title}</h2>
                <p style={{color: 'black'}}>Tipo de lista: {selectedList.type}</p>
                {selectedList.items.length === 0 ? (
                  <p style={{color: 'black'}}>La lista está vacía. ¡Empieza a agregar productos!</p>
                ) : (
                  <ul>
                    {selectedList.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                )}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
                  <button
                    onClick={() => setSelectedList(null)}
                    style={{ background: '#ccc', color: '#333' }}
                  >
                    Volver al inicio
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingTitle(true)
                      setEditedTitle(selectedList.title)
                    }}
                  >
                    Editar Título
                  </button>
                  <button
                    onClick={handleDeleteList}
                    style={{ backgroundColor: 'red', color: 'white' }}
                  >
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </>
  )
}

export default App
