import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/env';
import { user_profile_model } from '../models';
import { expense_category_model } from '../models';
import { auth_request } from '../middlewares/auth.middleware';
import { DEFAULT_CATEGORIES } from '../utils/default_categories';

/**
 * Generate JWT token for a user
 */
const generate_token = (user_id: string, email: string): string => {
  return jwt.sign(
    { user_id, email },
    config.jwt_secret as jwt.Secret,
    { expiresIn: config.jwt_expiration } as jwt.SignOptions
  );
};

/**
 * Set token as httpOnly cookie
 * This prevents XSS attacks from accessing the token
 */
const set_token_cookie = (res: Response, token: string): void => {
  res.cookie('token', token, {
    httpOnly: true, // Cannot be accessed via JavaScript
    secure: config.node_env === 'production', // Only send over HTTPS in production
    sameSite: config.node_env === 'production' ? 'none' : 'lax', // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

/**
 * Google OAuth Callback Handler
 * Called by Passport after successful Google authentication
 *
 * Flow:
 * 1. User authenticated by Google (handled by passport)
 * 2. User record created/updated in database (handled by passport strategy)
 * 3. Generate JWT token
 * 4. Redirect to frontend with token
 */
export const google_callback = async (req: Request, res: Response): Promise<void> => {
  try {
    // User is attached to req by passport
    const user = req.user as any;

    if (!user) {
      // OAuth failed
      res.redirect(`${config.frontend_url}/auth/error?message=authentication_failed`);
      return;
    }

    // Generate JWT token
    const token = generate_token(user.user_id, user.user_email);

    // Set token as httpOnly cookie
    set_token_cookie(res, token);

    // Redirect to frontend with token in URL (for mobile app to grab)
    // Frontend will save this to SecureStore and remove from URL
    const redirect_url = user.is_first_login
      ? `${config.frontend_url}/auth/success?token=${token}&firstLogin=true`
      : `${config.frontend_url}/auth/success?token=${token}`;

    res.redirect(redirect_url);
  } catch (error) {
    console.error('❌ Google callback error:', error);
    res.redirect(`${config.frontend_url}/auth/error?message=server_error`);
  }
};

/**
 * Get current user profile
 * Requires authentication
 */
export const get_current_user = async (req: auth_request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    const user = await user_profile_model.findOne({ user_id: req.user.user_id });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Return user data (exclude sensitive fields if any)
    res.json({
      success: true,
      data: {
        user_id: user.user_id,
        user_name: user.user_name,
        user_email: user.user_email,
        user_phone: user.user_phone,
        profile_picture: user.profile_picture,
        is_first_login: user.is_first_login,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error('❌ Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
    });
  }
};

/**
 * Setup default categories for new user
 * Creates 8 predefined categories automatically
 */
export const setup_default_categories = async (req: auth_request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    const user = await user_profile_model.findOne({ user_id: req.user.user_id });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Check if user already has categories
    const existing_categories = await expense_category_model.countDocuments({
      user_id: user.user_id,
    });

    if (existing_categories > 0) {
      res.status(400).json({
        success: false,
        message: 'User already has categories',
      });
      return;
    }

    // Create default categories
    const categories_to_create = DEFAULT_CATEGORIES.map((category) => ({
      category_id: uuidv4(),
      user_id: user.user_id,
      ...category,
    }));

    await expense_category_model.insertMany(categories_to_create);

    // Mark first login as complete
    user.is_first_login = false;
    await user.save();

    res.json({
      success: true,
      message: 'Default categories created successfully',
      data: {
        categories_count: categories_to_create.length,
      },
    });
  } catch (error) {
    console.error('❌ Setup default categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to setup default categories',
    });
  }
};

/**
 * Mark first login as complete
 * Called after default categories are created
 */
export const complete_first_login = async (req: auth_request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    const user = await user_profile_model.findOne({ user_id: req.user.user_id });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    user.is_first_login = false;
    await user.save();

    res.json({
      success: true,
      message: 'First login completed',
    });
  } catch (error) {
    console.error('❌ Complete first login error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user profile',
    });
  }
};

/**
 * Logout user
 * Clears token cookie
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // Clear cookie
    res.clearCookie('token');

    // Destroy session if using sessions
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destroy error:', err);
        }
      });
    }

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('❌ Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
    });
  }
};

/**
 * Refresh token
 * Issues a new JWT token if the current one is valid
 */
export const refresh_token = async (req: auth_request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    // Generate new token
    const token = generate_token(req.user.user_id, req.user.email);

    // Set new token as cookie
    set_token_cookie(res, token);

    res.json({
      success: true,
      data: { token },
    });
  } catch (error) {
    console.error('❌ Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to refresh token',
    });
  }
};
