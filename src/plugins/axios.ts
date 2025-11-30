// src/plugins/axios.ts
import axios from 'axios'

// 🔥 ОБНОВЛЕННАЯ ФУНКЦИЯ - используем ваш бэкенд на Render
const getBaseURL = (): string => {
  return import.meta.env.PROD
    ? 'https://premium-cigars-backend.onrender.com/api'
    : 'http://localhost:5000/api'
}

const instance = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000, // Увеличим таймаут для Render
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    console.log('🚀 API Request:', config.method?.toUpperCase(), config.url)
    return config
  },
  (error) => {
    console.error('❌ Request error:', error)
    return Promise.reject(error)
  },
)

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url)
    return response
  },
  async (error) => {
    console.error('❌ API Error:', error.response?.status, error.config?.url)

    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      window.location.href = '/'
    }
    return Promise.reject(error)
  },
)

export default instance
