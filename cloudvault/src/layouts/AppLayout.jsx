import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  UploadCloud, 
  FileText, 
  Sun, 
  Moon, 
  LogOut, 
  Menu, 
  X
} from 'lucide-react'

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/upload',    icon: UploadCloud, label: 'Upload' },
  { to: '/documents', icon: FileText, label: 'Documents' },
]

function SidebarContent({ onClose, theme, toggleTheme, user, handleLogout }) {
  return (
    <>
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-200 dark:border-surface-200/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-brand-500/20">
            CV
          </div>
          <span className="font-semibold text-slate-800 dark:text-slate-100 tracking-tight">CloudVault</span>
        </div>
        {onClose && (
          <button 
            onClick={onClose} 
            className="p-1 lg:hidden rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-brand-50 dark:bg-brand-600/15 text-brand-600 dark:text-brand-400 shadow-sm dark:shadow-none'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-surface-800'
              }`
            }
          >
            <Icon size={18} className="shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User & Settings Panel */}
      <div className="px-3 py-4 border-t border-slate-200 dark:border-surface-200/10 space-y-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-surface-800 transition-colors"
        >
          <div className="flex items-center gap-3">
            {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
            <span>Theme</span>
          </div>
          <span className="text-xs bg-slate-200 dark:bg-surface-800 px-2 py-0.5 rounded-full capitalize text-slate-500 dark:text-slate-400">
            {theme}
          </span>
        </button>

        {/* User Badge */}
        <div className="flex items-center gap-3 px-3 py-2 border border-slate-100 dark:border-surface-200/5 bg-slate-50 dark:bg-surface-950/40 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-600/30 border border-brand-200 dark:border-brand-500/30 flex items-center justify-center text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase shrink-0">
            {user?.username?.[0] ?? 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{user?.username}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Free Account</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-500/20"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </>
  )
}

export default function AppLayout() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-surface-950 transition-colors duration-300">
      {/* Mobile Header Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-surface-900 border-b border-slate-200 dark:border-surface-200/10 flex items-center justify-between px-4 z-30 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-brand-500/20">
            CV
          </div>
          <span className="font-semibold text-slate-800 dark:text-slate-100 tracking-tight">CloudVault</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-surface-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-surface-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu size={18} />
          </button>
        </div>
      </header>

      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-white dark:bg-surface-900 border-r border-slate-200 dark:border-surface-200/10 flex-col sticky top-0 h-screen transition-colors duration-300">
        <SidebarContent
          theme={theme}
          toggleTheme={toggleTheme}
          user={user}
          handleLogout={handleLogout}
        />
      </aside>

      {/* Mobile Sidebar (Slide-out Drawer) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
            />
            {/* Drawer Panel */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.2, ease: 'easeOut' }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-surface-900 border-r border-slate-200 dark:border-surface-200/10 flex flex-col shadow-2xl lg:hidden transition-colors duration-300"
            >
              <SidebarContent
                onClose={() => setIsMobileMenuOpen(false)}
                theme={theme}
                toggleTheme={toggleTheme}
                user={user}
                handleLogout={handleLogout}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-auto pt-16 lg:pt-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
