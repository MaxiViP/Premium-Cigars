// src/plugins/axios.js
import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
})

// Добавляем токен в каждый запрос, если он есть
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken') // Теперь ключ совпадает
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
export default instance
