import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import * as userRepo from '../repositories/user-repository.js';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

async function handleOAuthProfile(provider, profile, done) {
  try {
    const providerId = profile.id;

    let user = await userRepo.findByOAuth(provider, providerId);
    if (!user) {
      // Construire un username unique depuis le profil OAuth
      const base = (profile.displayName || profile.username || `${provider}_user`)
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '')
        .slice(0, 90);
      const username = `${base}_${providerId.slice(-6)}`;
      user = await userRepo.createOAuthUser(username, provider, providerId);
    }

    done(null, user);
  } catch (err) {
    done(err);
  }
}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:  `${BACKEND_URL}/api/auth/google/callback`,
    },
    (_accessToken, _refreshToken, profile, done) =>
      handleOAuthProfile('google', profile, done)
  ));
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(new GitHubStrategy(
    {
      clientID:     process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL:  `${BACKEND_URL}/api/auth/github/callback`,
    },
    (_accessToken, _refreshToken, profile, done) =>
      handleOAuthProfile('github', profile, done)
  ));
}

export default passport;
