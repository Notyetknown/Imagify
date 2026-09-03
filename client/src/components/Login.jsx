import { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { motion } from "motion/react"
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {

    const[state,setState] = useState('Login')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { backendUrl, setUser, setToken, setShowLogin } = useContext(AppContext)

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

    useEffect(()=>{
        document.body.style.overflow = 'hidden';

    return () => {
  document.body.style.overflow = 'unset';
}
    },[])
  return (
    <div className='fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>

            <motion.form
            initial={{ opacity: 0.2, y: 50 }}
            transition={{ duration: 0.3 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={onSubmitHandler}
            className='relative bg-white p-10 rounded-xl text-slate-500'>
            <h1 className='text-center text-2xl text-neutral-700 font-medium'>{state}</h1>
            <p className='text-sm text-center'>Welcome back! Please sign in to continue</p>

            {state !== 'Login' && <div className='border border-neutral-200 px-6 py-2 flex items-center gap-2 rounded-full mt-5'>
                <img src={assets.profile_icon} alt="" className='w-6' />
                <input value={name} onChange={(event)=>setName(event.target.value)} type="text" className='outline-none text-sm w-full' placeholder='Full Name' required/>
            </div>}

            <div className='border border-neutral-200 px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                <img src={assets.email_icon} alt="" className='w-4' />
                <input value={email} onChange={(event)=>setEmail(event.target.value)} type="email" className='outline-none text-sm w-full' placeholder='Email id' required/>
            </div>

            <div className='border border-neutral-200 px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                <img src={assets.lock_icon} alt="" className='w-4' />
                <input value={password} onChange={(event)=>setPassword(event.target.value)} type="password" className='outline-none text-sm w-full' placeholder='Password' required/>

                
            </div>
            <p className='text-sm text-blue-600 my-4 cursor-pointer'>Forgot password?</p>

            <button type='submit' className='bg-blue-600 w-full text-white py-2 rounded-full'>{state === 'Login' ? 'login' : 'create account'}</button>

            {state === 'Login' ? <p className='mt-5 text-center'>Don't have an account? <span className='text-blue-600 cursor-pointer' onClick={()=>setState('Sign Up')}>Sign up</span></p>
            :
            <p className='mt-5 text-center'>Already have an account?<span className='text-blue-600 cursor-pointer'onClick={()=>setState('Login')}> Login </span></p>}

            <img onClick={()=>setShowLogin(false)}src={assets.cross_icon} alt="" className='absolute top-5 right-5 cursor-pointer'/>

            </motion.form>

 </div>
  )
}

export default Login
