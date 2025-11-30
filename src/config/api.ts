// src/config/api.ts
export const API_CONFIG = {
  baseURL: import.meta.env.PROD ? '/api' : 'http://localhost:5000/api',
}

export const getBackendUrl = (): string => API_CONFIG.baseURL
