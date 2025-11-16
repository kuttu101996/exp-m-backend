import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from './config/passport';
import { config } from './config/env';
import connect_database from './config/database';
import routes from './routes';
import { error_handler, not_found_handler } from './middlewares/error_handler';

const app: Application = express();

// CORS Configuration - Allow credentials
app.use(
  cors({
    origin: [
      config.frontend_url,
      'http://localhost:8081',
      /^exp:\/\/.*/, // Allow all Expo Go URLs
    ],
    credentials: true, // Allow cookies
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Session configuration
app.use(
  session({
    secret: config.session_secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: config.node_env === 'production', // HTTPS only in production
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Expense Manager API is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use(config.api_prefix, routes);

// Error handlers (must be last)
app.use(not_found_handler);
app.use(error_handler);

// Start server
const start_server = async (): Promise<void> => {
  try {
    // Connect to database
    await connect_database();

    // Start listening
    app.listen(config.port, () => {
      console.log('');
      console.log('🚀 Expense Manager API Started');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`📡 Server: http://localhost:${config.port}`);
      console.log(`🔧 Environment: ${config.node_env}`);
      console.log(`📋 API Base: ${config.api_prefix}`);
      console.log(`💚 Health Check: http://localhost:${config.port}/health`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('');
      console.log('📍 Available Endpoints:');
      console.log(`   ${config.api_prefix}/auth`);
      console.log(`   ${config.api_prefix}/categories`);
      console.log(`   ${config.api_prefix}/sub-categories`);
      console.log(`   ${config.api_prefix}/expenses`);
      console.log(`   ${config.api_prefix}/analytics`);
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled rejections
process.on('unhandledRejection', (error: Error) => {
  console.error('❌ Unhandled Rejection:', error);
  process.exit(1);
});

// Start the server
start_server();

export default app;
