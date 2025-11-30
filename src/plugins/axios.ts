// // src/plugins/axios.js
// import axios from 'axios'

// const instance = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
//   withCredentials: true,
// })

// // Добавляем токен в каждый запрос, если он есть
// instance.interceptors.request.use((config) => {
//   const token = localStorage.getItem('accessToken') // Теперь ключ совпадает
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// })
// export default instance
// src/plugins/axios.ts
import axios from 'axios'
import { API_CONFIG } from '@/config/api'

const instance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: 10000,
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
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export default instance
