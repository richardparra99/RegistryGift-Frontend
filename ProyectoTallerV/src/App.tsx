import { useState } from 'react'
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
              <div className="card" onClick={() => handleCardClick('Gift List')}>
                <img src="/gift.png" alt="Gift" />
                <p>Create a Gift List</p>
              </div>
              <div className="card" onClick={() => handleCardClick('Wedding Registry')}>
                <img src="/wedding.png" alt="Wedding Rings" />
                <p>Create a Wedding Registry</p>
              </div>
              <div className="card" onClick={() => handleCardClick('Baby Registry')}>
                <img src="/baby.png" alt="Baby Toy" />
                <p>Create a Baby Registry</p>
              </div>
              <div className="card" onClick={() => handleCardClick('Nonprofit Gift List')}>
                <img src="/heart.png" alt="Hearts" />
                <p>Create a Nonprofit Gift List</p>
              </div>
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
            <h2>{selectedList.title}</h2>
            {selectedList.items.length === 0 ? (
              <p>La lista está vacía. ¡Empieza a agregar productos!</p>
            ) : (
              <ul>
                {selectedList.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
            <button
              onClick={() => setSelectedList(null)}
              style={{ marginTop: '1rem', background: '#ccc', color: '#333' }}
            >
              Volver al inicio
            </button>
          </div>
        )}
      </main>
    </>
  )
}

export default App
