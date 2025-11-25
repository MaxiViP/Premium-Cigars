// src/services/jwt.js
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'fallback-secret-do-not-use-in-prod'
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || SECRET
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || SECRET

export const signAccess = (payload) => {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' })
}

export const signRefresh = (payload) => {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '30d' })
}

export const verifyToken = (token) => {
  return jwt.verify(token, ACCESS_SECRET)
}
