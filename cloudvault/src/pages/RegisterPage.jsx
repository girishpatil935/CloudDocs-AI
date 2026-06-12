import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Alert from '../components/ui/Alert'
import Spinner from '../components/ui/Spinner'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      await register(form.username, form.email, form.password)
      setSuccess('Account created! Redirecting to login…')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      const detail = err.response?.data
      if (typeof detail === 'object' && detail !== null) {
        const msgs = Object.values(detail).flat().join(' ')
        setError(msgs || 'Registration failed.')
      } else {
        setError('Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-8 glow">
      <h1 className="text-xl font-semibold text-slate-100 mb-1">Create an account</h1>
      <p className="text-sm text-slate-500 mb-6">Start processing files with AI in seconds.</p>

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
          <label className="label">Email</label>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="input-field"
          />
        </div>

        <div>
          <label className="label">Password</label>
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="input-field"
          />
        </div>

        <Alert message={error} />
        <Alert type="success" message={success} />

        <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
          {loading ? <Spinner size="sm" /> : 'Create account'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-5">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  )
}
