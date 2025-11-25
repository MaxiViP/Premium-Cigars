# Backend for Premium-Cigars

## Quick start
1. copy `.env.example` to `.env` and fill credentials (MongoURI, TWILIO, GOOGLE, YANDEX, STRIPE)
2. npm install
3. npm run dev

## Endpoints
- POST /api/auth/phone/send  { phone }
- POST /api/auth/phone/verify { phone, code }
- GET /api/auth/google
- GET /api/auth/google/callback
- GET /api/auth/yandex
- GET /api/auth/yandex/callback
- GET /api/user/me
- POST /api/user/favorites/:productId
- POST /api/user/cart
- POST /api/shop/create-payment-intent
