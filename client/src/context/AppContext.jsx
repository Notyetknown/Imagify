import { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { AppContext } from './context'

const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [showLogin, setShowLogin] = useState(false)
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [credit, setCredit] = useState(0)
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const navigate = useNavigate()

  const loadCreditsData = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/credits`, { headers: { token } })
      if (data.success) {
        setCredit(data.credits)
        setUser(data.user)
      } else {
        localStorage.removeItem('token')
        setToken('')
        setUser(null)
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }, [backendUrl, token])

  const generateImage = useCallback(async (prompt) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/image/generate-image`,
        { prompt },
        { headers: { token } },
      )

      if (data.success) {
        await loadCreditsData()
        return data.resultImage
      }

      toast.error(data.message)
      await loadCreditsData()
      if (data.creditBalance === 0) navigate('/buy')
      return undefined
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
      return undefined
    }
  }, [backendUrl, loadCreditsData, navigate, token])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setToken('')
    setUser(null)
    setCredit(0)
  }, [])

  useEffect(() => {
    // This starts an async request; state is updated only after the response arrives.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (token) void loadCreditsData()
  }, [loadCreditsData, token])

  const value = useMemo(() => ({
    user,
    setUser,
    showLogin,
    setShowLogin,
    backendUrl,
    token,
    setToken,
    credit,
    setCredit,
    loadCreditsData,
    logout,
    generateImage,
  }), [backendUrl, credit, generateImage, loadCreditsData, logout, showLogin, token, user])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export default AppContextProvider
