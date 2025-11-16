import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export interface auth_request extends Request {
  user?: {
    user_id: string;
    email: string;
  };
}

/**
 * Middleware to verify JWT token from Authorization header or cookies
 * Adds user data to req.user if token is valid
 */
export const verify_token = async (
  req: auth_request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Try to get token from Authorization header first (mobile app)
    let token = req.headers.authorization?.replace('Bearer ', '');

    // If not in header, try to get from cookies (web)
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Authentication required. No token provided.',
      });
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwt_secret) as {
      user_id: string;
      email: string;
    };

    // Add user data to request
    req.user = {
      user_id: decoded.user_id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.',
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: 'Invalid token. Please login again.',
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Authentication failed.',
    });
  }
};

/**
 * Optional auth middleware - doesn't fail if token is missing
 * Used for endpoints that work with or without authentication
 */
export const optional_auth = async (
  req: auth_request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token = req.headers.authorization?.replace('Bearer ', '');

    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (token) {
      const decoded = jwt.verify(token, config.jwt_secret) as {
        user_id: string;
        email: string;
      };

      req.user = {
        user_id: decoded.user_id,
        email: decoded.email,
      };
    }

    next();
  } catch (error) {
    // Silently continue without user data
    next();
  }
};
