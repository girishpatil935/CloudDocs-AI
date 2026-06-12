import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useFiles } from '../hooks/useFiles'
import { fileService } from '../services/fileService'
import StatusBadge from '../components/ui/StatusBadge'
import Alert from '../components/ui/Alert'
import EmptyState from '../components/ui/EmptyState'
import { formatDate } from '../utils/statusConfig'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Grid, 
  List, 
  Eye, 
  Trash2, 
  AlertTriangle, 
  FileText,
  X,
  Plus
} from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.03 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 22 } }
}

function TableRowSkeleton() {
  return (
    <tr className="animate-pulse border-b border-slate-100 dark:border-surface-200/5 last:border-0">
      <td className="px-6 py-4"><div className="h-4 w-12 bg-slate-200 dark:bg-surface-800 rounded" /></td>
      <td className="px-6 py-4"><div className="h-4 w-28 bg-slate-200 dark:bg-surface-800 rounded" /></td>
      <td className="px-6 py-4"><div className="h-6 w-20 bg-slate-200 dark:bg-surface-800 rounded-full" /></td>
      <td className="px-6 py-4"><div className="h-4 w-32 bg-slate-200 dark:bg-surface-800 rounded" /></td>
      <td className="px-6 py-4"><div className="h-6 w-12 bg-slate-200 dark:bg-surface-800 rounded ml-auto" /></td>
    </tr>
  )
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="card p-5 animate-pulse space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 bg-slate-200 dark:bg-surface-800 rounded-xl" />
            <div className="w-20 h-6 bg-slate-200 dark:bg-surface-800 rounded-full" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-16 bg-slate-200 dark:bg-surface-800 rounded" />
            <div className="h-4 w-32 bg-slate-200 dark:bg-surface-800 rounded" />
            <div className="h-12 w-full bg-slate-200 dark:bg-surface-800 rounded" />
          </div>
          <div className="pt-4 border-t border-slate-100 dark:border-surface-200/5 flex items-center justify-between">
            <div className="h-3 w-20 bg-slate-200 dark:bg-surface-800 rounded" />
            <div className="flex gap-2">
              <div className="w-7 h-7 bg-slate-200 dark:bg-surface-800 rounded-lg" />
              <div className="w-7 h-7 bg-slate-200 dark:bg-surface-800 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function DocumentsPage() {
  const { files, loading, error, refetch } = useFiles()
  const [deletingId, setDeletingId] = useState(null)
  const [deleteError, setDeleteError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('docs_view_mode') || 'list')
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  async function handleDelete(id) {
    setDeletingId(id)
    setDeleteError('')
    try {
      await fileService.deleteFile(id)
      refetch()
    } catch {
      setDeleteError('Failed to delete the file.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleToggleView = (mode) => {
    setViewMode(mode)
    localStorage.setItem('docs_view_mode', mode)
  }

  const filteredFiles = useMemo(() => {
    return files.filter((f) => {
      const q = searchQuery.toLowerCase()
      const matchesId = f.id.toString().includes(q)
      const matchesType = f.document_type ? f.document_type.toLowerCase().includes(q) : false
      const matchesStatus = f.status.toLowerCase().includes(q)
      return matchesId || matchesType || matchesStatus
    })
  }, [files, searchQuery])

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Documents</h1>
          <p className="text-sm text-slate-500 mt-1">
            {loading ? 'Retrieving library…' : `${files.length} document${files.length !== 1 ? 's' : ''} stored`}
          </p>
        </div>
        <Link to="/upload" className="btn-primary self-start sm:self-auto shadow-sm">
          <Plus size={16} /> Upload file
        </Link>
      </div>

      <Alert message={deleteError} />

      {/* Control Actions Bar (Search, View Toggle) */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-surface-900 border border-slate-200/80 dark:border-surface-200/10 px-4 py-3 rounded-2xl shadow-sm transition-colors">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10 pr-4 py-2 text-xs"
          />
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto border-t sm:border-t-0 pt-2.5 sm:pt-0 border-slate-100 dark:border-surface-200/5 w-full sm:w-auto justify-end">
          <span className="text-xs text-slate-500 dark:text-slate-400 mr-1 hidden sm:inline">View:</span>
          <button
            onClick={() => handleToggleView('list')}
            className={`p-2 rounded-xl transition-colors ${viewMode === 'list' ? 'bg-slate-100 dark:bg-surface-800 text-brand-600 dark:text-brand-400 font-semibold' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-surface-800/30'}`}
            title="List View"
            aria-label="List View"
          >
            <List size={16} />
          </button>
          <button
            onClick={() => handleToggleView('grid')}
            className={`p-2 rounded-xl transition-colors ${viewMode === 'grid' ? 'bg-slate-100 dark:bg-surface-800 text-brand-600 dark:text-brand-400 font-semibold' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-surface-800/30'}`}
            title="Grid View"
            aria-label="Grid View"
          >
            <Grid size={16} />
          </button>
        </div>
      </div>

      {/* Main Files Display */}
      {loading ? (
        viewMode === 'list' ? (
          <div className="card overflow-hidden transition-colors">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-200/80 dark:border-surface-200/10 bg-slate-50/50 dark:bg-surface-900/50">
                  <th className="px-6 py-3.5">File ID</th>
                  <th className="px-6 py-3.5">Document Type</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Uploaded</th>
                  <th className="px-6 py-3.5" />
                </tr>
              </thead>
              <tbody>
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
              </tbody>
            </table>
          </div>
        ) : (
          <GridSkeleton />
        )
      ) : error ? (
        <div className="p-6 card"><Alert message={error} /></div>
      ) : filteredFiles.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={FileText}
            title={searchQuery ? "No matches found" : "No documents yet"}
            description={searchQuery ? "Try altering search inputs or filter criteria." : "Upload a file to get started. AI will process and summarize it automatically."}
            action={
              !searchQuery && (
                <Link to="/upload" className="btn-primary">
                  Upload your first file
                </Link>
              )
            }
          />
        </div>
      ) : viewMode === 'list' ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="card overflow-hidden transition-colors"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-200/80 dark:border-surface-200/10 bg-slate-50/50 dark:bg-surface-900/50">
                  <th className="px-6 py-3.5">File ID</th>
                  <th className="px-6 py-3.5">Document Type</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Uploaded</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((file) => (
                  <tr
                    key={file.id}
                    className="group border-b border-slate-100 dark:border-surface-200/5 last:border-0 hover:bg-slate-50 dark:hover:bg-surface-800/40 transition-colors"
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
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center gap-3 justify-end">
                        <Link
                          to={`/documents/${file.id}`}
                          className="p-1 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                          title="View"
                        >
                          <Eye size={15} />
                        </Link>
                        <button
                          onClick={() => setDeleteConfirmId(file.id)}
                          disabled={deletingId === file.id}
                          className="p-1 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredFiles.map((file) => (
            <motion.div
              key={file.id}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="card p-5 relative group flex flex-col justify-between hover:shadow-md dark:hover:shadow-none transition-all duration-300 border-slate-200/80 dark:border-surface-200/10 bg-white dark:bg-surface-900"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="p-2 bg-brand-50 dark:bg-brand-600/10 text-brand-600 dark:text-brand-400 rounded-xl">
                    <FileText size={20} />
                  </div>
                  <StatusBadge status={file.status} />
                </div>
                <p className="text-xs font-mono text-slate-400 dark:text-slate-500 mb-1">ID #{file.id}</p>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-1 mb-2">
                  {file.document_type || 'Processing...'}
                </h3>
                {file.summary ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {file.summary}
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 dark:text-slate-600 italic mb-4">
                    {file.status === 'PROCESSING' ? 'AI is analyzing file contents...' : 'No summary generated.'}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-surface-200/5 mt-auto">
                <span className="text-[10px] text-slate-400 dark:text-slate-500">{formatDate(file.uploaded_at)}</span>
                <div className="flex items-center gap-1.5">
                  <Link
                    to={`/documents/${file.id}`}
                    className="p-2 rounded-xl bg-slate-50 dark:bg-surface-800 text-slate-500 dark:text-slate-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-600/15 dark:hover:text-brand-400 transition-all duration-150"
                    title="View Details"
                  >
                    <Eye size={14} />
                  </Link>
                  <button
                    onClick={() => setDeleteConfirmId(file.id)}
                    disabled={deletingId === file.id}
                    className="p-2 rounded-xl bg-slate-50 dark:bg-surface-800 text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/15 dark:hover:text-red-400 transition-all duration-150 disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Custom Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmId(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            {/* Card Content */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-sm bg-white dark:bg-surface-900 border border-slate-200 dark:border-surface-200/10 rounded-2xl p-6 shadow-2xl z-10"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-red-50 dark:bg-red-500/10 rounded-2xl text-red-500 shrink-0">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Delete document?</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    This action is permanent and cannot be undone. All AI summaries and metadata will be lost.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="btn-ghost text-xs px-4 py-2"
                  disabled={deletingId !== null}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleDelete(deleteConfirmId)
                    setDeleteConfirmId(null)
                  }}
                  className="btn-primary bg-red-600 hover:bg-red-500 text-xs px-4 py-2 border border-transparent shadow-sm text-white"
                  disabled={deletingId !== null}
                >
                  {deletingId === deleteConfirmId ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
