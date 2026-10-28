import { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AmbientGlowOrbs from './components/AmbientGlowOrbs'
import Footer from './components/Footer'
import Login from './components/Login'
import Navbar from './components/Navbar'
import { AppContext } from './context/context'
import BuyCredit from './pages/BuyCredit'
import Home from './pages/Home'
import Result from './pages/Result'

const App = () => {
  const { showLogin } = useContext(AppContext)

  return (
    <div className="app-shell">
      <AmbientGlowOrbs />
      <Navbar />
      {showLogin && <Login />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/result" element={<Result />} />
        <Route path="/buy" element={<BuyCredit />} />
      </Routes>
      <Footer />
      <ToastContainer
        position="bottom-right"
        autoClose={3500}
        theme="dark"
        toastClassName="imagify-toast"
      />
    </div>
  )
}

export default App
