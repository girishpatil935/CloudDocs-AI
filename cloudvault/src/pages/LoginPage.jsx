import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Alert from '../components/ui/Alert'
import Spinner from '../components/ui/Spinner'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
    <div className="card p-8 glow">
      <h1 className="text-xl font-semibold text-slate-100 mb-1">Welcome back</h1>
      <p className="text-sm text-slate-500 mb-6">Sign in to your account to continue.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Username</label>
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
          <label className="label">Password</label>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="input-field"
          />
        </div>

        <Alert message={error} />

        <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
          {loading ? <Spinner size="sm" /> : 'Sign in'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-5">
        No account?{' '}
        <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium">
          Create one
        </Link>
      </p>
    </div>
  )
}
