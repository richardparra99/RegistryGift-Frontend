import { useState } from 'react'
import './App.css'

function App() {
  const [view, setView] = useState<'login' | 'register' | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authenticatedEmail, setAuthenticatedEmail] = useState<string | null>(null)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (email === 'prueba@correo.com' && password === '123456') {
      setAuthenticatedEmail(email)
      setView(null)
      console.log('Usuario autenticado correctamente.')
    } else {
      alert('Correo o contraseña incorrectos')
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Solo está habilitado el login con la cuenta de prueba por ahora.')
  }

  const handleCardClick = () => {
    if (!authenticatedEmail) {
      alert('Primero tienes que registrarte o iniciar sesión')
    } else {
      console.log('Usuario autenticado, accediendo a la función...')
    }
  }

  const handleLogout = () => {
    setAuthenticatedEmail(null)
    setView(null)
    setEmail('')
    setPassword('')
    console.log('Sesión cerrada')
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

        {!view && (
          <div className="main-page">
            <header>
              <h2>Todas las tiendas, un solo registro</h2>
              <h1>Agrega los regalos que quieras de cualquier tienda del mundo</h1>
            </header>

            <div className="card-container">
              <div className="card" onClick={handleCardClick}>
                <img src="/gift.png" alt="Gift" />
                <p>Create a Gift List</p>
              </div>
              <div className="card" onClick={handleCardClick}>
                <img src="/wedding.png" alt="Wedding Rings" />
                <p>Create a Wedding Registry</p>
              </div>
              <div className="card" onClick={handleCardClick}>
                <img src="/baby.png" alt="Baby Toy" />
                <p>Create a Baby Registry</p>
              </div>
              <div className="card" onClick={handleCardClick}>
                <img src="/heart.png" alt="Hearts" />
                <p>Create a Nonprofit Gift List</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  )
}

export default App
