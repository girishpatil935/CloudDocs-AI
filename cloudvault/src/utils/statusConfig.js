export const STATUS_CONFIG = {
  COMPLETED: {
    label: 'Completed',
    dot: 'bg-emerald-400',
    badge: 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20',
  },
  PENDING: {
    label: 'Pending',
    dot: 'bg-amber-400',
    badge: 'bg-amber-400/10 text-amber-400 border border-amber-400/20',
  },
  PROCESSING: {
    label: 'Processing',
    dot: 'bg-blue-400 animate-pulse',
    badge: 'bg-blue-400/10 text-blue-400 border border-blue-400/20',
  },
  FAILED: {
    label: 'Failed',
    dot: 'bg-red-400',
    badge: 'bg-red-400/10 text-red-400 border border-red-400/20',
  },
}

export function getStatusConfig(status) {
  return STATUS_CONFIG[status] ?? {
    label: status,
    dot: 'bg-slate-400',
    badge: 'bg-slate-400/10 text-slate-400 border border-slate-400/20',
  }
}

export function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}
