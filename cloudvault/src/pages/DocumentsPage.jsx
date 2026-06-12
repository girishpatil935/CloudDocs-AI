import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFiles } from '../hooks/useFiles'
import { fileService } from '../services/fileService'
import StatusBadge from '../components/ui/StatusBadge'
import Spinner from '../components/ui/Spinner'
import Alert from '../components/ui/Alert'
import EmptyState from '../components/ui/EmptyState'
import { formatDate } from '../utils/statusConfig'

export default function DocumentsPage() {
  const { files, loading, error, refetch } = useFiles()
  const [deletingId, setDeletingId] = useState(null)
  const [deleteError, setDeleteError] = useState('')

  async function handleDelete(id) {
    if (!window.confirm('Delete this file? This cannot be undone.')) return
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

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Documents</h1>
          <p className="text-sm text-slate-500 mt-1">
            {loading ? 'Loading…' : `${files.length} file${files.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Link to="/upload" className="btn-primary">
          Upload file
        </Link>
      </div>

      <Alert message={deleteError} />

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="p-6"><Alert message={error} /></div>
        ) : files.length === 0 ? (
          <EmptyState
            icon="📂"
            title="No documents yet"
            description="Upload a file to get started. AI will process and summarize it automatically."
            action={
              <Link to="/upload" className="btn-primary">
                Upload your first file
              </Link>
            }
          />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider border-b border-surface-200/10">
                <th className="px-6 py-3">File ID</th>
                <th className="px-6 py-3">Document Type</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Uploaded</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {files.map((file, i) => (
                <tr
                  key={file.id}
                  className={`group transition-colors hover:bg-surface-800/50 ${i !== files.length - 1 ? 'border-b border-surface-200/5' : ''}`}
                >
                  <td className="px-6 py-4 font-mono text-slate-400">#{file.id}</td>
                  <td className="px-6 py-4 text-slate-300">{file.document_type || <span className="text-slate-600">—</span>}</td>
                  <td className="px-6 py-4"><StatusBadge status={file.status} /></td>
                  <td className="px-6 py-4 text-slate-500">{formatDate(file.uploaded_at)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        to={`/documents/${file.id}`}
                        className="text-xs text-brand-400 hover:text-brand-300 font-medium"
                      >
                        View
                      </Link>
                      <span className="text-slate-700">·</span>
                      <button
                        onClick={() => handleDelete(file.id)}
                        disabled={deletingId === file.id}
                        className="text-xs text-slate-500 hover:text-red-400 transition-colors disabled:opacity-50"
                      >
                        {deletingId === file.id ? 'Deleting…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
