import { useContext, useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/context'
import BrandMark from './BrandMark'

const Login = () => {
  const [state, setState] = useState('Login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const emailRef = useRef(null)
  const { backendUrl, setUser, setToken, setShowLogin } = useContext(AppContext)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const previouslyFocused = document.activeElement
    document.body.style.overflow = 'hidden'
    emailRef.current?.focus()
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setShowLogin(false)
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused?.focus?.()
    }
  }, [setShowLogin])

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      const endpoint = state === 'Login' ? '/api/user/login' : '/api/user/register'
      const payload = state === 'Login' ? { email, password } : { name, email, password }
      const { data } = await axios.post(backendUrl + endpoint, payload)

      if (!data.success) {
        toast.error(data.message)
        return
      }

      localStorage.setItem('token', data.token)
      setUser(data.user)
      setToken(data.token)
      setShowLogin(false)
      toast.success(state === 'Login' ? 'Logged in successfully' : 'Account created successfully')
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  return (
    <div
      className="login-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setShowLogin(false)
      }}
    >
      <motion.section
        className="login-dialog glass-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
        onKeyDown={(event) => {
          if (event.key !== 'Tab') return
          const focusable = event.currentTarget.querySelectorAll(
            'button:not([disabled]), input:not([disabled]), a[href], textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
          )
          const first = focusable[0]
          const last = focusable[focusable.length - 1]
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault()
            last?.focus()
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first?.focus()
          }
        }}
        initial={{ opacity: 0, y: 14, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.22 }}
      >
        <button type="button" className="dialog-close" aria-label="Close sign-in dialog" onClick={() => setShowLogin(false)}>
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
        <div className="login-brand"><BrandMark /></div>
        <h1 id="login-title">{state === 'Login' ? 'Welcome back' : 'Create your account'}</h1>
        <p className="login-subtitle">
          {state === 'Login' ? 'Sign in to pick up where your imagination left off.' : 'Join Imagify and bring your ideas to life.'}
        </p>

        <form onSubmit={onSubmitHandler} className="login-form">
          {state !== 'Login' && (
            <label className="field-label">
              Full name
              <input
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                type="text"
                placeholder="Your name"
                required
              />
            </label>
          )}
          <label className="field-label">
            Email address
            <input
              ref={emailRef}
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder="you@example.com"
              required
            />
          </label>
          <label className="field-label">
            Password
            <input
              autoComplete={state === 'Login' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              placeholder="Enter your password"
              required
            />
          </label>
          <button type="submit" className="login-submit">
            {state === 'Login' ? 'Sign in' : 'Create account'}
            <span aria-hidden="true">↗</span>
          </button>
        </form>

        <p className="login-switch">
          {state === 'Login' ? "Don't have an account?" : 'Already have an account?'}
          <button type="button" onClick={() => setState(state === 'Login' ? 'Sign Up' : 'Login')}>
            {state === 'Login' ? 'Create one' : 'Sign in'}
          </button>
        </p>
        <p className="login-privacy">Your account keeps your creations and credits in sync.</p>
      </motion.section>
    </div>
  )
}

export default Login
