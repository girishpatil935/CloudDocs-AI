import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useFile } from '../hooks/useFiles'
import { fileService } from '../services/fileService'
import StatusBadge from '../components/ui/StatusBadge'
import Alert from '../components/ui/Alert'
import { formatDate } from '../utils/statusConfig'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  Sparkles, 
  Copy, 
  Check, 
  Calendar, 
  Hash, 
  FileText, 
  Trash2, 
  AlertTriangle,
  Info,
  Loader2
} from 'lucide-react'

function MetaItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-slate-100 dark:border-surface-200/5 last:border-0">
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
        <Icon size={14} className="shrink-0" />
        <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{value}</div>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6 animate-pulse">
      <div className="h-4 w-20 bg-slate-200 dark:bg-surface-800 rounded" />
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-slate-200 dark:bg-surface-800 rounded" />
          <div className="h-4 w-32 bg-slate-200 dark:bg-surface-800 rounded" />
        </div>
        <div className="h-10 w-24 bg-slate-200 dark:bg-surface-800 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-5 space-y-4">
          <div className="h-4 w-24 bg-slate-200 dark:bg-surface-800 rounded" />
          <div className="h-4 w-full bg-slate-200 dark:bg-surface-800 rounded" />
          <div className="h-4 w-full bg-slate-200 dark:bg-surface-800 rounded" />
          <div className="h-4 w-full bg-slate-200 dark:bg-surface-800 rounded" />
        </div>
        <div className="lg:col-span-2 card p-6 space-y-4">
          <div className="h-5 w-32 bg-slate-200 dark:bg-surface-800 rounded" />
          <div className="h-3 w-full bg-slate-200 dark:bg-surface-800 rounded" />
          <div className="h-3 w-full bg-slate-200 dark:bg-surface-800 rounded" />
          <div className="h-3 w-3/4 bg-slate-200 dark:bg-surface-800 rounded" />
        </div>
      </div>
    </div>
  )
}

export default function DocumentDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { file, loading, error } = useFile(id)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [copied, setCopied] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      await fileService.deleteFile(id)
      navigate('/documents')
    } catch {
      setDeleteError('Failed to delete the file.')
      setDeleting(false)
    }
  }

  const handleCopySummary = async () => {
    if (!file?.summary) return
    try {
      await navigator.clipboard.writeText(file.summary)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text', err)
    }
  }

  if (loading) {
    return <DetailSkeleton />
  }

  if (error || !file) {
    return (
      <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-4">
        <Alert message={error || 'File not found.'} />
        <Link to="/documents" className="btn-ghost mt-4 inline-flex items-center gap-1.5 border">
          <ArrowLeft size={14} /> Back to Documents
        </Link>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 md:p-8 max-w-4xl mx-auto space-y-6"
    >
      {/* Breadcrumbs */}
      <Link to="/documents" className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors inline-flex items-center gap-1.5">
        <ArrowLeft size={13} /> Documents
      </Link>

      {/* Detail Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-surface-200/10 pb-6 transition-colors">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {file.document_type || 'Analyzing Document'}
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-1">ID #{file.id}</p>
        </div>
        <button
          onClick={() => setDeleteConfirmOpen(true)}
          disabled={deleting}
          className="btn-ghost text-red-500 hover:text-white hover:bg-red-500/90 dark:hover:bg-red-500/10 text-xs shrink-0 self-start sm:self-auto border border-red-200/50 dark:border-red-500/20"
        >
          <Trash2 size={14} className="shrink-0" />
          Delete file
        </button>
      </div>

      <Alert message={deleteError} />

      {/* Columns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Metadata Card */}
        <div className="card p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 border-b border-slate-100 dark:border-surface-200/5 pb-3">
            <Info size={15} className="text-brand-500" />
            File Details
          </h3>
          <div className="space-y-1">
            <MetaItem 
              icon={Hash} 
              label="Document ID" 
              value={`#${file.id}`} 
            />
            <MetaItem 
              icon={FileText} 
              label="Document Type" 
              value={file.document_type || <span className="text-amber-500 italic text-xs">Processing...</span>} 
            />
            <MetaItem 
              icon={Calendar} 
              label="Uploaded Date" 
              value={formatDate(file.uploaded_at)} 
            />
            <div className="flex items-center justify-between py-3.5">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Status</span>
              </div>
              <StatusBadge status={file.status} />
            </div>
          </div>
        </div>

        {/* Right Side: AI summary assistant card */}
        <div className="lg:col-span-2 card p-6 space-y-4 border-brand-100 dark:border-brand-500/10 relative overflow-hidden bg-gradient-to-br from-white to-slate-50/50 dark:from-surface-900 dark:to-surface-950/20">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 dark:border-surface-200/5 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-brand-50 dark:bg-brand-600/10 text-brand-600 dark:text-brand-400 rounded-xl">
                <Sparkles size={16} />
              </div>
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Gemini AI Summary</h2>
            </div>
            {file.summary && (
              <button
                onClick={handleCopySummary}
                className="p-2 rounded-xl border border-slate-200 dark:border-surface-200/10 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-surface-800 transition-all duration-150 inline-flex items-center gap-1 text-xs"
                title="Copy to Clipboard"
              >
                {copied ? <Check size={14} className="text-emerald-500 animate-scale" /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>

          <div className="pt-2">
            {file.status === 'PENDING' || file.status === 'PROCESSING' ? (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                <Loader2 size={32} className="animate-spin text-brand-600 dark:text-brand-400" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    {file.status === 'PROCESSING' ? 'Analyzing file contents…' : 'Queued for processing…'}
                  </p>
                  <p className="text-xs text-slate-400">
                    Gemini AI is parsing and extracting summary details from your document.
                  </p>
                </div>
              </div>
            ) : file.status === 'FAILED' ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
                  <AlertTriangle size={22} />
                </div>
                <div className="space-y-1 max-w-sm mx-auto">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Analysis Failed</h4>
                  <p className="text-xs text-red-500/90 leading-relaxed">
                    AI generation could not complete. This may be due to unreadable file format or network issue.
                  </p>
                </div>
              </div>
            ) : file.summary ? (
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-medium">
                {file.summary}
              </p>
            ) : (
              <p className="text-sm text-slate-400 dark:text-slate-600 italic py-4">No summary details generated.</p>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmOpen(false)}
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
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="btn-ghost text-xs px-4 py-2 border"
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="btn-primary bg-red-600 hover:bg-red-500 text-xs px-4 py-2 border border-transparent shadow-sm text-white"
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
