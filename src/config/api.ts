// src/config/api.ts
export const getBackendUrl = (): string => {
  if (import.meta.env.PROD) {
    return 'https://premium-cigars-backend.onrender.com/api'
  }
  return 'http://localhost:5000/api'
}
