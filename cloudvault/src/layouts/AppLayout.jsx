import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { to: '/dashboard', icon: '▦', label: 'Dashboard' },
  { to: '/upload',    icon: '↑', label: 'Upload' },
  { to: '/documents', icon: '☰', label: 'Documents' },
]

export default function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-surface-900 border-r border-surface-200/10 flex flex-col">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-surface-200/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white text-sm font-bold">
              CV
            </div>
            <span className="font-semibold text-slate-100 tracking-tight">CloudVault</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-100 ${
                  isActive
                    ? 'bg-brand-600/15 text-brand-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-surface-800'
                }`
              }
            >
              <span className="text-base leading-none">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-surface-200/10">
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="w-7 h-7 rounded-full bg-brand-600/30 border border-brand-500/30 flex items-center justify-center text-brand-400 text-xs font-semibold uppercase">
              {user?.username?.[0] ?? 'U'}
            </div>
            <span className="text-sm text-slate-300 flex-1 truncate">{user?.username}</span>
          </div>
          <button onClick={handleLogout} className="w-full mt-1 btn-ghost text-xs py-2">
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto bg-surface-950">
        <Outlet />
      </main>
    </div>
  )
}
