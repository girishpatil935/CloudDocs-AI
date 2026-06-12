import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useFiles } from '../hooks/useFiles'
import Spinner from '../components/ui/Spinner'
import Alert from '../components/ui/Alert'
import StatusBadge from '../components/ui/StatusBadge'
import { formatDate } from '../utils/statusConfig'

function StatCard({ label, value, accent, loading }) {
  return (
    <div className="card p-6">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">{label}</p>
      {loading ? (
        <Spinner size="sm" />
      ) : (
        <p className={`text-3xl font-bold ${accent}`}>{value}</p>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { files, loading, error } = useFiles()

  const stats = useMemo(() => {
    const total     = files.length
    const completed = files.filter((f) => f.status === 'COMPLETED').length
    const pending   = files.filter((f) => f.status === 'PENDING' || f.status === 'PROCESSING').length
    const failed    = files.filter((f) => f.status === 'FAILED').length
    return { total, completed, pending, failed }
  }, [files])

  const recent = files.slice(0, 5)

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">
          Good to see you, <span className="text-gradient">{user?.username}</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">Here's what's happening with your files.</p>
      </div>

      {/* Stats */}
      {error ? (
        <Alert message={error} />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Files"     value={stats.total}     accent="text-slate-100"  loading={loading} />
          <StatCard label="Completed"       value={stats.completed} accent="text-emerald-400" loading={loading} />
          <StatCard label="In Progress"     value={stats.pending}   accent="text-amber-400"  loading={loading} />
          <StatCard label="Failed"          value={stats.failed}    accent="text-red-400"    loading={loading} />
        </div>
      )}

      {/* Recent files */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200/10">
          <h2 className="text-sm font-semibold text-slate-200">Recent files</h2>
          <Link to="/documents" className="text-xs text-brand-400 hover:text-brand-300 font-medium">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : recent.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-500">
            No files yet.{' '}
            <Link to="/upload" className="text-brand-400 hover:text-brand-300">
              Upload your first file.
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider border-b border-surface-200/10">
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Uploaded</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((file, i) => (
                <tr
                  key={file.id}
                  className={`transition-colors hover:bg-surface-800/50 ${i !== recent.length - 1 ? 'border-b border-surface-200/5' : ''}`}
                >
                  <td className="px-6 py-4 font-mono text-slate-400">#{file.id}</td>
                  <td className="px-6 py-4 text-slate-300">{file.document_type || '—'}</td>
                  <td className="px-6 py-4"><StatusBadge status={file.status} /></td>
                  <td className="px-6 py-4 text-slate-500">{formatDate(file.uploaded_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
