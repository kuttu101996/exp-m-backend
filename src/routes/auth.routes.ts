import { Router } from 'express';
import passport from '../config/passport';
import {
  google_callback,
  get_current_user,
  setup_default_categories,
  complete_first_login,
  logout,
  refresh_token,
} from '../controllers/auth.controller';
import { verify_token } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @route   GET /auth/google
 * @desc    Initialize Google OAuth flow
 * @access  Public
 *
 * This redirects user to Google's consent screen
 */
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: true,
  })
);

/**
 * @route   GET /auth/google/callback
 * @desc    Google OAuth callback endpoint
 * @access  Public
 *
 * Google redirects here after user approves/denies consent
 * Passport middleware handles the OAuth code exchange
 * Then our controller generates JWT and redirects to frontend
 */
// router.get(
//   '/google/callback',
//   passport.authenticate('google', {
//     session: true,
//     failureRedirect: '/auth/error',
//   }),
//   google_callback
// );
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: true,
    failureRedirect: '/api/v1/auth/failure', // Redirect to our custom error handler
  }),
  google_callback
);

/**
 * @route   GET /auth/me
 * @desc    Get current user profile
 * @access  Private (requires JWT token)
 */
router.get('/me', verify_token as any, get_current_user as any);

/**
 * @route   POST /auth/setup-defaults
 * @desc    Setup default categories for new user
 * @access  Private (requires JWT token)
 */
router.post('/setup-defaults', verify_token as any, setup_default_categories as any);

/**
 * @route   POST /auth/complete-first-login
 * @desc    Mark user's first login as complete
 * @access  Private (requires JWT token)
 */
router.post('/complete-first-login', verify_token as any, complete_first_login as any);

/**
 * @route   POST /auth/logout
 * @desc    Logout user (clear cookies/session)
 * @access  Public
 */
router.post('/logout', logout);

/**
 * @route   POST /auth/refresh
 * @desc    Refresh JWT token
 * @access  Private (requires valid JWT token)
 */
router.post('/refresh', verify_token as any, refresh_token as any);

/**
 * @route   GET /auth/failure
 * @desc    OAuth failure handler - redirects to frontend with error
 * @access  Public
 */
router.get('/failure', (_req, res) => {
  const { config } = require('../config/env');
  res.redirect(`${config.frontend_url}/auth/error?message=authentication_failed`);
});

/**
 * @route   GET /auth/error
 * @desc    OAuth error page
 * @access  Public
 */
router.get('/error', (_req, res) => {
  res.status(401).json({
    success: false,
    message: 'Authentication failed',
  });
});

export default router;
