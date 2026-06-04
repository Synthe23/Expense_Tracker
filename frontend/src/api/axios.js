import axios from 'axios'

const api = axios.create({
  baseURL: 'https://expense-tracker-tuj9.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('et_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// Auto-logout on 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('et_token')
      localStorage.removeItem('et_user')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default api