// src/services/passport.js
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as YandexStrategy } from 'passport-yandex' // после npm i passport-yandex
import User from '../models/User.js'

if (!process.env.GOOGLE_CLIENT_ID && !process.env.YANDEX_CLIENT_ID) {
  console.warn('OAuth отключён: не заданы GOOGLE_CLIENT_ID / YANDEX_CLIENT_ID')
}

// GOOGLE
if (process.env.GOOGLE_CLIENT_ID) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback',
        proxy: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value?.toLowerCase()

          let user = email
            ? await User.findOne({ email }) // 1. Ищем по email — главное для объединения
            : null

          if (user) {
            user.googleId = profile.id
            await user.save()
            return done(null, user)
          }

          // 2. Ищем по googleId (на случай если email не дали)
          user = await User.findOne({ googleId: profile.id })
          if (user) return done(null, user)

          // 3. Создаём нового
          user = await User.create({
            googleId: profile.id,
            email: email || null,
            name: profile.displayName || null,
            avatar: profile.photos?.[0]?.value || null,
          })

          done(null, user)
        } catch (err) {
          console.error('Google OAuth error:', err)
          done(err)
        }
      },
    ),
  )
}

// YANDEX
if (process.env.YANDEX_CLIENT_ID) {
  passport.use(
    new YandexStrategy(
      {
        clientID: process.env.YANDEX_CLIENT_ID,
        clientSecret: process.env.YANDEX_CLIENT_SECRET,
        callbackURL: '/api/auth/yandex/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = (profile.emails?.[0]?.value || profile._json?.default_email)?.toLowerCase()

          let user = email ? await User.findOne({ email }) : null

          if (user) {
            user.yandexId = profile.id
            await user.save()
            return done(null, user)
          }

          user = await User.findOne({ yandexId: profile.id })
          if (user) return done(null, user)

          user = await User.create({
            yandexId: profile.id,
            email: email || null,
            name: profile.displayName || profile._json?.real_name || null,
            avatar: profile._json?.default_avatar_id
              ? `https://avatars.yandex.net/get-yapic/${profile._json.default_avatar_id}/islands-200`
              : null,
          })

          done(null, user)
        } catch (err) {
          console.error('Yandex OAuth error:', err)
          done(err)
        }
      },
    ),
  )
}

export default passport
