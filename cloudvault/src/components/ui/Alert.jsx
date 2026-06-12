const variants = {
  error:   'bg-red-500/10 border-red-500/20 text-red-400',
  success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  info:    'bg-blue-500/10 border-blue-500/20 text-blue-400',
}

export default function Alert({ type = 'error', message }) {
  if (!message) return null
  return (
    <div className={`border rounded-xl px-4 py-3 text-sm ${variants[type]}`} role="alert">
      {message}
    </div>
  )
}
