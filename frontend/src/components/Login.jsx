import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-hot-toast'

function Login() {

  const {setShowLogin, axios, setToken, navigate} = useAppContext()

  const [state, setState] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (event) => {
    try {
         event.preventDefault();
         const {data} = await axios.post(`/api/user/${state}`, {name, email, password})

         if (data.success) {
            navigate('/')
            setToken(data.token)
            localStorage.setItem('token', data.token)
            setShowLogin(false)
         } else {
            toast.error(data.message)
         }
    } catch (error) {
        toast.error(error.message)
    }
  }

  return (
    <div onClick={() => setShowLogin(false)} className='fixed inset-0 z-100 flex items-center justify-center text-sm text-gray-600 bg-black/60 backdrop-blur-sm'>
        <form
            onSubmit={onSubmitHandler}
            onClick={(e) => e.stopPropagation()} 
            className='flex flex-col gap-4 items-start p-8 py-12 w-80 sm:w-[352px] rounded-2xl shadow-2xl border border-white/20 glass'>
                <p className='text-3xl font-semibold m-auto text-center'>
                    <span className='text-primary'>User</span> {state === 'login' ? 'Login' : 'Sign Up'}
                </p>
                {state === 'register' && (
                    <div className='w-full'>
                        <label className='text-sm font-medium text-gray-700 mb-1 block'>Name</label>
                        <input 
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            placeholder='e.g. John Doe'
                            className='border border-gray-300 rounded-lg w-full p-3 mt-1 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white/50 backdrop-blur-sm'
                            type='text'
                            required
                        />
                    </div>
                )}
                <div className='w-full'>
                    <label className='text-sm font-medium text-gray-700 mb-1 block'>Email</label>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        placeholder='you@example.com'
                        className='border border-gray-300 rounded-lg w-full p-3 mt-1 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white/50 backdrop-blur-sm'
                        type='email'
                        required
                    />
                </div>
                <div className='w-full'>
                    <label className='text-sm font-medium text-gray-700 mb-1 block'>Password</label>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        placeholder='Enter your password'
                        className='border border-gray-300 rounded-lg w-full p-3 mt-1 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white/50 backdrop-blur-sm'
                        type='password'
                        required
                    />
                </div>
                {state === 'register' ? (
                    <p className='text-sm text-center w-full mt-2'>
                        Already have an account? <span onClick={() => setState('login')} className='text-primary font-medium hover:underline cursor-pointer'>Login here</span>
                    </p>
                ) : (
                    <p className='text-sm text-center w-full mt-2'>
                        Need an account? <span onClick={() => setState('register')} className='text-primary font-medium hover:underline cursor-pointer'>Sign up here</span>
                    </p>
                )}
                <button
                    className='bg-primary hover:bg-primary-dull transition-all duration-300 shadow-md hover:shadow-lg text-white font-medium w-full py-3 mt-2 rounded-full cursor-pointer'>
                        {state === 'register' ? 'Create Account' : 'Sign In'}
                    </button>
            </form>
    </div>
  )
}

export default Login