import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useFiles } from '../hooks/useFiles'
import Alert from '../components/ui/Alert'
import StatusBadge from '../components/ui/StatusBadge'
import { formatDate } from '../utils/statusConfig'
import { motion } from 'framer-motion'
import { 
  Files, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowRight,
  FolderOpen
} from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } }
}

function StatCard({ label, value, accent, loading, icon: Icon, iconBg }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="card p-6 flex items-center justify-between relative overflow-hidden group transition-all duration-300"
    >
      <div className="space-y-1">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</p>
        {loading ? (
          <div className="h-8 w-16 bg-slate-200 dark:bg-surface-800 rounded animate-pulse mt-1" />
        ) : (
          <p className={`text-3xl font-bold tracking-tight ${accent}`}>{value}</p>
        )}
      </div>
      <div className={`p-3 rounded-2xl ${iconBg} transition-transform duration-300 group-hover:scale-110`}>
        <Icon size={24} className="shrink-0" />
      </div>
    </motion.div>
  )
}

function TableRowSkeleton() {
  return (
    <tr className="animate-pulse border-b border-slate-100 dark:border-surface-200/5 last:border-0">
      <td className="px-6 py-4"><div className="h-4 w-12 bg-slate-200 dark:bg-surface-800 rounded" /></td>
      <td className="px-6 py-4"><div className="h-4 w-24 bg-slate-200 dark:bg-surface-800 rounded" /></td>
      <td className="px-6 py-4"><div className="h-6 w-20 bg-slate-200 dark:bg-surface-800 rounded-full" /></td>
      <td className="px-6 py-4"><div className="h-4 w-32 bg-slate-200 dark:bg-surface-800 rounded" /></td>
    </tr>
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
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-6 md:p-8 max-w-6xl mx-auto space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Welcome back, <span className="text-gradient font-extrabold">{user?.username}</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">Here's the summary of your AI document processing hub.</p>
        </div>
        <Link to="/upload" className="btn-primary self-start md:self-auto shadow-sm">
          Upload file
        </Link>
      </motion.div>

      {/* Stats Grid */}
      {error ? (
        <Alert message={error} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            label="Total Files"     
            value={stats.total}     
            accent="text-slate-800 dark:text-slate-100"  
            loading={loading}
            icon={Files}
            iconBg="bg-brand-50 dark:bg-brand-600/10 text-brand-600 dark:text-brand-400"
          />
          <StatCard 
            label="Completed"       
            value={stats.completed} 
            accent="text-emerald-600 dark:text-emerald-400" 
            loading={loading}
            icon={CheckCircle2}
            iconBg="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          />
          <StatCard 
            label="In Progress"     
            value={stats.pending}   
            accent="text-amber-600 dark:text-amber-500" 
            loading={loading}
            icon={Clock}
            iconBg="bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500"
          />
          <StatCard 
            label="Failed"          
            value={stats.failed}    
            accent="text-red-600 dark:text-red-400"    
            loading={loading}
            icon={AlertTriangle}
            iconBg="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"
          />
        </div>
      )}

      {/* Recent Files Section */}
      <motion.div variants={itemVariants} className="card overflow-hidden transition-colors">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/80 dark:border-surface-200/10">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Recent files</h2>
          <Link to="/documents" className="text-xs text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-semibold flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-200/80 dark:border-surface-200/10 bg-slate-50 dark:bg-surface-900/50">
                  <th className="px-6 py-3.5">ID</th>
                  <th className="px-6 py-3.5">Type</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Uploaded</th>
                </tr>
              </thead>
              <tbody>
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
              </tbody>
            </table>
          ) : recent.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-surface-800 flex items-center justify-center text-slate-400 dark:text-slate-500">
                <FolderOpen size={20} />
              </div>
              <p className="text-sm text-slate-500">
                No files found.{' '}
                <Link to="/upload" className="text-brand-600 dark:text-brand-400 hover:underline font-semibold">
                  Upload your first file
                </Link>
                .
              </p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-200/85 dark:border-surface-200/10 bg-slate-50/50 dark:bg-surface-900/50">
                  <th className="px-6 py-3.5">ID</th>
                  <th className="px-6 py-3.5">Type</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Uploaded</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((file, i) => (
                  <tr
                    key={file.id}
                    className={`transition-colors hover:bg-slate-50 dark:hover:bg-surface-800/40 border-b border-slate-100 dark:border-surface-200/5 last:border-0`}
                  >
                    <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                      <Link to={`/documents/${file.id}`} className="hover:underline hover:text-brand-500 font-semibold">
                        #{file.id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">
                      {file.document_type || <span className="text-slate-400 dark:text-slate-600">—</span>}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={file.status} />
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {formatDate(file.uploaded_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
