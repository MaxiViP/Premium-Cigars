import jwt from 'jsonwebtoken';
export function signAccess(payload){ return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' }); }
export function signRefresh(payload){ return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' }); }
export function verifyToken(token){ return jwt.verify(token, process.env.JWT_SECRET); }
