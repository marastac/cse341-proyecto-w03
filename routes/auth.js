// routes/auth.js
// Authentication routes for GitHub OAuth

const express = require('express');
const passport = require('passport');
const router = express.Router();

// GET /auth/github - Versión simplificada (sin Passport middleware)
router.get('/github', (req, res) => {
  console.log('🔍 GitHub route accessed');
  
  // Redirect directly to GitHub OAuth
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = 'http://localhost:3000/auth/github/callback';
  const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;
  
  console.log('🔗 Redirecting to:', githubUrl);
  res.redirect(githubUrl);
});

// GET /auth/github/callback - GitHub OAuth callback
router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/auth/login/failed' }),
  (req, res) => {
    // Successful authentication
    console.log('✅ OAuth callback successful for user:', req.user.username);
    
    // Redirect to success page or dashboard
    res.redirect('/auth/login/success');
  }
);

// GET /auth/login/success - Login success page
router.get('/login/success', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({
      success: true,
      message: 'Authentication successful! You can now access protected routes.',
      user: req.user,
      protectedRoutes: [
        'GET /data/protected',
        'GET /users/protected',
        'GET /auth/profile'
      ],
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Authentication failed',
      loginUrl: '/auth/github'
    });
  }
});

// GET /auth/login/failed - Login failed page
router.get('/login/failed', (req, res) => {
  res.status(401).json({
    success: false,
    message: 'GitHub authentication failed. Please try again.',
    error: 'OAuth authentication was cancelled or failed',
    tryAgain: '/auth/github',
    timestamp: new Date().toISOString()
  });
});

// GET /auth/logout - Logout user
router.get('/logout', (req, res) => {
  const username = req.user ? req.user.username : 'Unknown';
  
  req.logout((err) => {
    if (err) {
      console.error('❌ Error during logout:', err);
      return res.status(500).json({
        success: false,
        message: 'Error during logout',
        error: err.message
      });
    }
    
    console.log('✅ User logged out:', username);
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
      loginUrl: '/auth/github',
      timestamp: new Date().toISOString()
    });
  });
});

// GET /auth/profile - Get current user profile (Protected route)
router.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({
      success: true,
      user: req.user,
      sessionInfo: {
        isAuthenticated: true,
        loginTime: req.session.passport ? 'Active session' : 'Unknown',
        protectedAccess: true
      },
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Authentication required to access profile',
      loginUrl: '/auth/github'
    });
  }
});

// GET /auth/status - Check authentication status (Public route)
router.get('/status', (req, res) => {
  res.status(200).json({
    isAuthenticated: req.isAuthenticated(),
    user: req.isAuthenticated() ? req.user : null,
    message: req.isAuthenticated() ? 'User is authenticated' : 'User is not authenticated',
    loginUrl: '/auth/github',
    logoutUrl: '/auth/logout',
    timestamp: new Date().toISOString()
  });
});

// DEBUG: Test route
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Auth routes working', 
    github: '/auth/github',
    availableRoutes: [
      '/auth/github',
      '/auth/github/callback', 
      '/auth/login/success',
      '/auth/login/failed',
      '/auth/logout',
      '/auth/profile',
      '/auth/status',
      '/auth/test'
    ],
    passportInitialized: !!passport
  });
});

module.exports = router;