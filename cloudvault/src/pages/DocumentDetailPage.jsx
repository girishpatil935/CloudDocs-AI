import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useFile } from '../hooks/useFiles'
import { fileService } from '../services/fileService'
import StatusBadge from '../components/ui/StatusBadge'
import Spinner from '../components/ui/Spinner'
import Alert from '../components/ui/Alert'
import { formatDate } from '../utils/statusConfig'

function MetaRow({ label, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0 py-4 border-b border-surface-200/10 last:border-0">
      <span className="sm:w-40 text-xs font-medium text-slate-500 uppercase tracking-wider shrink-0">{label}</span>
      <div className="text-sm text-slate-200">{children}</div>
    </div>
  )
}

export default function DocumentDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { file, loading, error } = useFile(id)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  async function handleDelete() {
    if (!window.confirm('Delete this file? This cannot be undone.')) return
    setDeleting(true)
    try {
      await fileService.deleteFile(id)
      navigate('/documents')
    } catch {
      setDeleteError('Failed to delete the file.')
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !file) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <Alert message={error || 'File not found.'} />
        <Link to="/documents" className="btn-ghost mt-4 inline-flex">
          ← Back to Documents
        </Link>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <Link to="/documents" className="text-xs text-slate-500 hover:text-slate-300 transition-colors mb-6 inline-flex items-center gap-1">
        ← Documents
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 mb-2">
            {file.document_type || 'Untitled Document'}
          </h1>
          <div className="flex items-center gap-3">
            <StatusBadge status={file.status} />
            <span className="text-xs text-slate-600 font-mono">ID #{file.id}</span>
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="btn-ghost text-red-400/70 hover:text-red-400 hover:bg-red-500/10 text-xs shrink-0"
        >
          {deleting ? 'Deleting…' : 'Delete file'}
        </button>
      </div>

      <Alert message={deleteError} />

      {/* Metadata card */}
      <div className="card px-6 mb-6">
        <MetaRow label="Status">
          <StatusBadge status={file.status} />
        </MetaRow>
        <MetaRow label="Document Type">
          {file.document_type || <span className="text-slate-600">Not detected yet</span>}
        </MetaRow>
        <MetaRow label="Uploaded">
          {formatDate(file.uploaded_at)}
        </MetaRow>
      </div>

      {/* AI Summary */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 rounded bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-xs text-brand-400">
            ✦
          </div>
          <h2 className="text-sm font-semibold text-slate-200">AI Summary</h2>
        </div>

        {file.status === 'PENDING' || file.status === 'PROCESSING' ? (
          <div className="flex items-center gap-3 py-4">
            <Spinner size="sm" />
            <span className="text-sm text-slate-500">
              {file.status === 'PROCESSING' ? 'AI is processing this document…' : 'Waiting to be processed…'}
            </span>
          </div>
        ) : file.status === 'FAILED' ? (
          <p className="text-sm text-red-400/80">Processing failed. You may try re-uploading the file.</p>
        ) : file.summary ? (
          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{file.summary}</p>
        ) : (
          <p className="text-sm text-slate-600">No summary available.</p>
        )}
      </div>
    </div>
  )
}
