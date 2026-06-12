import { useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { fileService } from '../services/fileService'
import Alert from '../components/ui/Alert'

function formatBytes(bytes) {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export default function UploadPage() {
  const [dragging, setDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [uploadedFile, setUploadedFile] = useState(null)
  const inputRef = useRef(null)

  function pickFile(file) {
    if (!file) return
    setSelectedFile(file)
    setError('')
    setUploadedFile(null)
    setProgress(0)
  }

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    pickFile(file)
  }, [])

  const onDragOver = (e) => { e.preventDefault(); setDragging(true) }
  const onDragLeave = () => setDragging(false)

  async function handleUpload() {
    if (!selectedFile) return
    setError('')
    setUploading(true)
    setProgress(0)

    try {
      const result = await fileService.uploadFile(selectedFile, (e) => {
        if (e.total) setProgress(Math.round((e.loaded / e.total) * 100))
      })
      setUploadedFile(result)
      setSelectedFile(null)
      setProgress(0)
    } catch (err) {
      const detail = err.response?.data
      if (typeof detail === 'object' && detail !== null) {
        setError(Object.values(detail).flat().join(' '))
      } else {
        setError('Upload failed. Please try again.')
      }
    } finally {
      setUploading(false)
    }
  }

  function handleReset() {
    setSelectedFile(null)
    setUploadedFile(null)
    setProgress(0)
    setError('')
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">Upload a file</h1>
        <p className="text-sm text-slate-500 mt-1">Files are processed by AI and summarized automatically.</p>
      </div>

      {/* Success */}
      {uploadedFile && (
        <div className="card p-6 mb-6 border-emerald-500/20 bg-emerald-500/5">
          <div className="flex items-start gap-3">
            <span className="text-emerald-400 text-xl mt-0.5">✓</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-emerald-400 mb-1">File uploaded successfully</p>
              <p className="text-xs text-slate-500 mb-3">
                File ID <span className="font-mono text-slate-300">#{uploadedFile.id}</span> — processing will begin shortly.
              </p>
              <div className="flex gap-2">
                <Link to={`/documents/${uploadedFile.id}`} className="btn-primary text-xs py-1.5 px-3">
                  View file
                </Link>
                <button onClick={handleReset} className="btn-ghost text-xs py-1.5 px-3">
                  Upload another
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!uploadedFile && (
        <div className="card p-6">
          {/* Drop zone */}
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => !selectedFile && inputRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-150 cursor-pointer
              ${dragging ? 'border-brand-500 bg-brand-500/5' : 'border-surface-200/20 hover:border-surface-200/40 hover:bg-surface-800/30'}
              ${selectedFile ? 'cursor-default' : ''}
            `}
          >
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={(e) => pickFile(e.target.files[0])}
            />

            {selectedFile ? (
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto rounded-xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-2xl">
                  📄
                </div>
                <p className="text-sm font-medium text-slate-200">{selectedFile.name}</p>
                <p className="text-xs text-slate-500">{formatBytes(selectedFile.size)}</p>
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedFile(null) }}
                  className="text-xs text-slate-500 hover:text-red-400 transition-colors"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto rounded-xl bg-surface-800 border border-surface-200/10 flex items-center justify-center text-2xl">
                  ↑
                </div>
                <p className="text-sm font-medium text-slate-300">
                  Drop a file here, or <span className="text-brand-400">browse</span>
                </p>
                <p className="text-xs text-slate-600">Any file type supported</p>
              </div>
            )}
          </div>

          {/* Progress */}
          {uploading && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                <span>Uploading…</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-surface-800 rounded-full h-1.5">
                <div
                  className="bg-brand-500 h-1.5 rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <Alert message={error} />

          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="btn-primary w-full mt-4"
          >
            {uploading ? `Uploading… ${progress}%` : 'Upload file'}
          </button>
        </div>
      )}
    </div>
  )
}
