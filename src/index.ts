import express, { Application } from 'express';
import cors from 'cors';
import { config } from './config/env';
import connect_database from './config/database';
import routes from './routes';
import { error_handler, not_found_handler } from './middlewares/error_handler';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (_req, res) => {
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
