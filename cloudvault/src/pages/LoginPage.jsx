import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Alert from '../components/ui/Alert'
import Spinner from '../components/ui/Spinner'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, User as UserIcon } from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.username, form.password)
      navigate('/dashboard')
    } catch (err) {
      const detail = err.response?.data
      if (typeof detail === 'string') setError(detail)
      else if (detail?.detail) setError(detail.detail)
      else setError('Invalid username or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="card p-8 glow"
    >
      <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">Welcome back</h1>
      <p className="text-sm text-slate-500 mb-6">Sign in to your account to continue.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label flex items-center gap-1.5">
            <UserIcon size={12} />
            Username
          </label>
          <input
            name="username"
            type="text"
            autoComplete="username"
            required
            value={form.username}
            onChange={handleChange}
            placeholder="your_username"
            className="input-field"
          />
        </div>

        <div>
          <label className="label flex items-center gap-1.5">
            <Lock size={12} />
            Password
          </label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="input-field pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <Alert message={error} />

        <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
          {loading ? <Spinner size="sm" className="border-t-white" /> : 'Sign in'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-5">
        No account?{' '}
        <Link to="/register" className="text-brand-600 dark:text-brand-400 hover:text-brand-500 dark:hover:text-brand-300 font-medium transition-colors">
          Create one
        </Link>
      </p>
    </motion.div>
  )
}
