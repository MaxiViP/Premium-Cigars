// src/types/errors.ts
export interface ApiError {
  response?: {
    data?: {
      error?: string
      message?: string
    }
  }
  message: string
}
