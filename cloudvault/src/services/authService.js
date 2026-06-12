import axiosInstance from '../api/axiosInstance'

export const authService = {
  async login(username, password) {
    const { data } = await axiosInstance.post('/api/login/', { username, password })
    return data // { access, refresh }
  },

  async register(username, email, password) {
    const { data } = await axiosInstance.post('/api/register/', { username, email, password })
    return data
  },

  async refreshToken(refresh) {
    const { data } = await axiosInstance.post('/api/token/refresh/', { refresh })
    return data // { access }
  },
}
