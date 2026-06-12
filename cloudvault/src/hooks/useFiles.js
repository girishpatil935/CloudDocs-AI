import { useState, useEffect, useCallback } from 'react'
import { fileService } from '../services/fileService'

export function useFiles() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchFiles = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fileService.getFiles()
      setFiles(Array.isArray(data) ? data : data.results ?? [])
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load files.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchFiles() }, [fetchFiles])

  return { files, loading, error, refetch: fetchFiles }
}

export function useFile(id) {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fileService.getFile(id)
      .then(setFile)
      .catch((err) => setError(err.response?.data?.detail || 'File not found.'))
      .finally(() => setLoading(false))
  }, [id])

  return { file, loading, error }
}
