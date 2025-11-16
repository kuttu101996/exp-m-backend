import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  node_env: process.env.NODE_ENV || 'development',
  mongodb_uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/expense_manager',
  api_prefix: process.env.API_PREFIX || '/api/v1',

  // JWT Configuration
  jwt_secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  jwt_expiration: process.env.JWT_EXPIRATION || '7d', // 7 days

  // Google OAuth Configuration
  google_client_id: process.env.GOOGLE_CLIENT_ID || '',
  google_client_secret: process.env.GOOGLE_CLIENT_SECRET || '',

  // API Base URL (for OAuth callbacks)
  api_base_url: process.env.API_BASE_URL || 'http://localhost:5000/api/v1',

  // Session Secret
  session_secret: process.env.SESSION_SECRET || 'your-super-secret-session-key-change-in-production',

  // Frontend URL (for redirects after OAuth)
  frontend_url: process.env.FRONTEND_URL || 'exp://localhost:8081', // Expo Go URL
};

export const is_production = config.node_env === 'production';
export const is_development = config.node_env === 'development';
