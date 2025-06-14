// middleware/auth.js
// Authentication middleware for protected routes

// Middleware to ensure user is authenticated
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  
  // If not authenticated, return 401 with helpful message
  res.status(401).json({
    error: 'Unauthorized',
    message: 'Authentication required. Please login first.',
    loginUrl: '/auth/github'
  });
};

// Middleware to ensure user is NOT authenticated (for login routes)
const ensureNotAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  
  // If already authenticated, redirect or return info
  res.status(200).json({
    message: 'Already authenticated',
    user: req.user,
    logoutUrl: '/auth/logout'
  });
};

// Middleware to get authentication status (optional for some routes)
const checkAuthStatus = (req, res, next) => {
  req.isUserAuthenticated = req.isAuthenticated();
  req.currentUser = req.user || null;
  next();
};

module.exports = {
  ensureAuthenticated,
  ensureNotAuthenticated,
  checkAuthStatus
};