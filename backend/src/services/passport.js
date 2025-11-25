import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as YandexStrategy } from 'passport-yandex';
import User from '../models/User.js';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails?.[0]?.value,
        avatar: profile.photos?.[0]?.value
      });
    }
    done(null, user);
  } catch (err) { done(err); }
}));

passport.use(new YandexStrategy({
  clientID: process.env.YANDEX_CLIENT_ID,
  clientSecret: process.env.YANDEX_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/auth/yandex/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ yandexId: profile.id });
    if (!user) {
      user = await User.create({
        yandexId: profile.id,
        name: profile.displayName || profile.username,
        email: profile.emails?.[0]?.value,
        avatar: profile.photos?.[0]?.value
      });
    }
    done(null, user);
  } catch (err) { done(err); }
}));
