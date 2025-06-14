// config/passport.js
// Passport.js configuration for GitHub OAuth - VERSIÓN CORREGIDA

require('dotenv').config(); // Load environment variables
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy; // CLAVE: .Strategy al final

console.log('🔍 PASSPORT CONFIG - CLIENT_ID:', process.env.GITHUB_CLIENT_ID);
console.log('🔍 PASSPORT CONFIG - CLIENT_SECRET:', process.env.GITHUB_CLIENT_SECRET ? 'EXISTS' : 'MISSING');

// Configure GitHub OAuth Strategy
passport.use('github', new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.NODE_ENV === 'production' 
    ? "https://cse341-proyecto-w03.onrender.com/auth/github/callback"
    : "http://localhost:3001/auth/github/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Create user object with GitHub profile data
    const user = {
      id: profile.id,
      username: profile.username,
      displayName: profile.displayName || profile.username,
      email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
      avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
      profileUrl: profile.profileUrl,
      accessToken: accessToken,
      provider: 'github',
      createdAt: new Date()
    };
    
    console.log('✅ GitHub OAuth successful for user:', user.username);
    return done(null, user);
  } catch (error) {
    console.error('❌ Error in GitHub OAuth strategy:', error);
    return done(error, null);
  }
}));

// Serialize user for session storage
passport.serializeUser((user, done) => {
  console.log('🔐 Serializing user:', user.username);
  // Store only essential user data in session
  done(null, {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    email: user.email,
    avatar: user.avatar
  });
});

// Deserialize user from session storage
passport.deserializeUser((user, done) => {
  console.log('🔓 Deserializing user:', user.username);
  // Retrieve user data from session
  done(null, user);
});

module.exports = passport;