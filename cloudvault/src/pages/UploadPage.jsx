import { useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { fileService } from '../services/fileService'
import Alert from '../components/ui/Alert'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  X, 
  Loader2 
} from 'lucide-react'

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
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 md:p-8 max-w-2xl mx-auto space-y-6"
    >
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Upload a file</h1>
        <p className="text-sm text-slate-500 mt-1">Files are analyzed by Gemini AI and summarized automatically.</p>
      </div>

      <AnimatePresence mode="wait">
        {/* Success State */}
        {uploadedFile ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="card p-6 border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/5 transition-colors"
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 size={24} />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-base font-bold text-emerald-800 dark:text-emerald-400">File uploaded successfully</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Document ID <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">#{uploadedFile.id}</span> is queueing for processing. Processing should start shortly.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
                  <Link to={`/documents/${uploadedFile.id}`} className="btn-primary text-xs py-2 px-4 shadow-sm">
                    View summary
                  </Link>
                  <button onClick={handleReset} className="btn-ghost text-xs py-2 px-4 border">
                    Upload another
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Upload / Dropzone Form Card */
          <motion.div
            key="upload-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="card p-6 space-y-5"
          >
            {/* Drop zone container */}
            <div
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onClick={() => !selectedFile && !uploading && inputRef.current?.click()}
              className={`
                relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300
                ${dragging ? 'border-brand-500 bg-brand-500/5 dark:bg-brand-500/5 scale-[0.99] glow' : 'border-slate-200 dark:border-surface-200/20 hover:border-brand-400 dark:hover:border-surface-200/40 hover:bg-slate-50 dark:hover:bg-surface-800/10'}
                ${selectedFile ? 'cursor-default border-slate-200 dark:border-surface-200/20' : 'cursor-pointer'}
              `}
            >
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                disabled={uploading}
                onChange={(e) => pickFile(e.target.files[0])}
              />

              <AnimatePresence mode="wait">
                {selectedFile ? (
                  <motion.div 
                    key="selected"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-50 dark:bg-brand-600/10 border border-brand-100 dark:border-brand-500/20 flex items-center justify-center text-brand-600 dark:text-brand-400">
                      <FileText size={28} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate max-w-sm mx-auto">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-slate-500">{formatBytes(selectedFile.size)}</p>
                    </div>
                    {!uploading && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedFile(null) }}
                        className="text-xs text-red-500 hover:text-red-600 dark:hover:text-red-400 font-semibold inline-flex items-center gap-1 hover:underline transition-all"
                      >
                        <X size={14} /> Remove File
                      </button>
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="prompt"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <motion.div
                      animate={dragging ? { y: [0, -6, 0] } : {}}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 dark:bg-surface-800 border border-slate-200 dark:border-surface-200/10 flex items-center justify-center text-slate-500 dark:text-slate-400 shadow-sm"
                    >
                      <UploadCloud size={26} />
                    </motion.div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        Drag & drop file here, or <span className="text-brand-600 dark:text-brand-400 hover:underline">browse</span>
                      </p>
                      <p className="text-xs text-slate-500">Supports PDF, Documents, Text, Images, and more</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dynamic Progress Indicator */}
            {uploading && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-2"
              >
                <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Loader2 size={13} className="animate-spin text-brand-600" />
                    Uploading to CloudVault...
                  </span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-surface-800 rounded-full h-2 overflow-hidden shadow-inner">
                  <motion.div
                    className="bg-brand-600 dark:bg-brand-500 h-2 rounded-full"
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: 'easeOut', duration: 0.15 }}
                  />
                </div>
              </motion.div>
            )}

            <Alert message={error} />

            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="btn-primary w-full shadow-md py-3 font-semibold"
            >
              {uploading ? `Uploading… ${progress}%` : 'Upload file'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
