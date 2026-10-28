import { useContext, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/context'
import BrandMark from './BrandMark'

const Navbar = () => {
  const { user, setShowLogin, logout, credit } = useContext(AppContext)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const accountRef = useRef(null)
  const navigate = useNavigate()
  useEffect(() => {
    const handlePointerDown = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false)
      }
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMobileOpen(false)
        setAccountOpen(false)
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const linkClass = ({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`

  const closeMenus = () => {
    setMobileOpen(false)
    setAccountOpen(false)
  }

  return (
    <header className="site-header">
      <nav className="navbar glass-panel" aria-label="Main navigation">
        <Link className="navbar-brand" to="/" aria-label="Imagify home" onClick={closeMenus}>
          <BrandMark />
        </Link>

        <div className="navbar-links">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/result" className={linkClass}>Create</NavLink>
          <NavLink to="/buy" className={linkClass}>Credits</NavLink>
        </div>

        <div className="navbar-actions">
          {user ? (
            <>
              <button
                type="button"
                className="credit-chip"
                onClick={() => navigate('/buy')}
                aria-label={`${credit} credits remaining. View credit plans.`}
              >
                <span className="credit-chip__icon" aria-hidden="true">✦</span>
                <span>{credit} <span className="credit-chip__label">credits</span></span>
              </button>
              <div className="account-menu" ref={accountRef}>
                <button
                  type="button"
                  className="account-trigger"
                  aria-expanded={accountOpen}
                  aria-haspopup="menu"
                  onClick={() => setAccountOpen((open) => !open)}
                >
                  <span className="account-avatar" aria-hidden="true">
                    {(user.name || user.email || 'I').charAt(0).toUpperCase()}
                  </span>
                  <span className="account-name">{user.name || 'Account'}</span>
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {accountOpen && (
                  <div className="account-dropdown glass-panel" role="group" aria-label="Account options">
                    <span className="account-dropdown__email">{user.email}</span>
                    <button
                      type="button"
                      onClick={() => {
                        logout()
                        setAccountOpen(false)
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button type="button" className="login-button" onClick={() => setShowLogin(true)}>
              Sign in <span aria-hidden="true">↗</span>
            </button>
          )}
        </div>

        <button
          type="button"
          className="mobile-menu-toggle"
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMobileOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
      </nav>

      {mobileOpen && (
        <div id="mobile-navigation" className="mobile-nav glass-panel">
          <NavLink to="/" end className={linkClass} onClick={closeMenus}>Home</NavLink>
          <NavLink to="/result" className={linkClass} onClick={closeMenus}>Create an image</NavLink>
          <NavLink to="/buy" className={linkClass} onClick={closeMenus}>Credits & plans</NavLink>
          {user ? (
            <button
              type="button"
              className="mobile-nav__signout"
              onClick={() => {
                logout()
                closeMenus()
              }}
            >
              Sign out
            </button>
          ) : (
            <button type="button" className="mobile-nav__signout" onClick={() => {
              closeMenus()
              setShowLogin(true)
            }}>
              Sign in
            </button>
          )}
        </div>
      )}
    </header>
  )
}

export default Navbar
