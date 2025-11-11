import mongoose from 'mongoose';

const connect_database = async (): Promise<void> => {
  try {
    const mongodb_uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/expense_manager';

    await mongoose.connect(mongodb_uri);

    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB error:', error);
});

export default connect_database;
