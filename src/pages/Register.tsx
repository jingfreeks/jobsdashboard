import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import logo from './assets/react.svg' // Replace with your logo if available

// Add a Facebook SVG icon
const FacebookIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
);

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
};

const Register = () => {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();
  const [error, setError] = useState('')

  const onSubmit = (data: RegisterFormData) => {
    // Dummy registration logic
    if (data.name && data.email && data.password) {
      navigate('/login')
    } else {
      setError('All fields are required')
    }
  }

  const handleFacebookRegister = () => {
    alert('Facebook registration would be implemented here.');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0856d1]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl px-8 py-10 flex flex-col items-center">
        <img src={logo} alt="Logo" className="w-20 h-20 mb-6" />
        <h1 className="text-2xl font-bold mb-6 text-center">Create Your Account</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
            <input
              id="name"
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-base bg-gray-50 focus:outline-none focus:border-blue-600"
            />
            {errors.name && <span className="text-red-500 text-xs">{errors.name.message as string}</span>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input
              id="email"
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-base bg-gray-50 focus:outline-none focus:border-blue-600"
            />
            {errors.email && <span className="text-red-500 text-xs">{errors.email.message as string}</span>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
            <input
              id="password"
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-base bg-gray-50 focus:outline-none focus:border-blue-600"
            />
            {errors.password && <span className="text-red-500 text-xs">{errors.password.message as string}</span>}
          </div>
          {error && <div className="text-red-500 text-sm mb-2 text-center">{error}</div>}
          <button type="submit" className="w-full py-3 bg-[#0856d1] text-white rounded-lg font-semibold hover:bg-blue-700 transition mb-2">Sign up with Email</button>
          <button type="button" onClick={handleFacebookRegister} className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold flex items-center justify-center hover:bg-blue-700 transition">
            <FacebookIcon />Sign up with Facebook
          </button>
        </form>
        <div className="w-full flex flex-col items-center mt-4 gap-1">
          <span className="text-sm text-gray-700">Already have an account? <Link to="/login" className="text-[#0856d1] hover:underline font-medium">Log in</Link></span>
        </div>
      </div>
    </div>
  )
}

export default Register 