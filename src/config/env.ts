import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  node_env: process.env.NODE_ENV || 'development',
  mongodb_uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/expense_manager',
  api_prefix: process.env.API_PREFIX || '/api/v1',
};

export const is_production = config.node_env === 'production';
export const is_development = config.node_env === 'development';
