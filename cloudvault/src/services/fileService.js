import axiosInstance from '../api/axiosInstance'

export const fileService = {
  async getFiles() {
    const { data } = await axiosInstance.get('/api/files/')
    return data
  },

  async getFile(id) {
    const { data } = await axiosInstance.get(`/api/files/${id}/`)
    return data
  },

  async uploadFile(file, onUploadProgress) {
    const formData = new FormData()
    formData.append('original_file', file)
    const { data } = await axiosInstance.post('/api/upload/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    })
    return data
  },

  async deleteFile(id) {
    await axiosInstance.delete(`/api/files/${id}/`)
  },
}
