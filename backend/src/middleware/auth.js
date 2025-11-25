// backend/src/middleware/auth.js
import jwt from 'jsonwebtoken'

export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Нет доступа — токен не предоставлен' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = payload.id // ← важно! именно id (или sub — как у тебя в JWT)
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Недействительный токен' })
  }
}
