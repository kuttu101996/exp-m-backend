/**
 * Database seeding script for default categories
 * Run this to populate the database with initial data
 */

import { v4 as uuidv4 } from 'uuid';
import { expense_category_model, user_profile_model } from '../models';
import connect_database from '../config/database';
import mongoose from 'mongoose';

const default_categories = [
  { name: 'Food & Dining', icon: '🍔', color: '#ff6b6b' },
  { name: 'Transport', icon: '🚗', color: '#4ecdc4' },
  { name: 'Shopping', icon: '🛍️', color: '#95e1d3' },
  { name: 'Entertainment', icon: '🎬', color: '#ffd93d' },
  { name: 'Bills & Utilities', icon: '💡', color: '#6c5ce7' },
  { name: 'Healthcare', icon: '🏥', color: '#fd79a8' },
  { name: 'Education', icon: '📚', color: '#74b9ff' },
  { name: 'Travel', icon: '✈️', color: '#a29bfe' },
  { name: 'Groceries', icon: '🛒', color: '#55efc4' },
  { name: 'Personal Care', icon: '💆', color: '#fab1a0' },
  { name: 'Rent', icon: '🏠', color: '#636e72' },
  { name: 'Savings', icon: '💰', color: '#00b894' },
  { name: 'Other', icon: '📁', color: '#b2bec3' },
];

const seed_database = async (): Promise<void> => {
  try {
    console.log('🌱 Starting database seeding...');

    await connect_database();

    // Create a test user
    const test_user_id = 'test-user-123';

    const existing_user = await user_profile_model.findOne({ user_id: test_user_id });

    if (!existing_user) {
      const test_user = new user_profile_model({
        user_id: test_user_id,
        user_name: 'Test User',
        user_email: 'test@example.com',
        user_phone: '+91 9876543210',
      });

      await test_user.save();
      console.log('✅ Test user created:', test_user_id);
    } else {
      console.log('ℹ️  Test user already exists');
    }

    // Create default categories
    const existing_categories = await expense_category_model.find({
      user_id: test_user_id,
      is_default: true,
    });

    if (existing_categories.length === 0) {
      const categories = default_categories.map((cat) => ({
        category_id: uuidv4(),
        user_id: test_user_id,
        category_name: cat.name,
        category_icon: cat.icon,
        category_color: cat.color,
        is_default: true,
      }));

      await expense_category_model.insertMany(categories);
      console.log(`✅ Created ${categories.length} default categories`);
    } else {
      console.log('ℹ️  Default categories already exist');
    }

    console.log('');
    console.log('🎉 Database seeding completed successfully!');
    console.log('');
    console.log('📝 Test User Details:');
    console.log('   User ID: test-user-123');
    console.log('   Email: test@example.com');
    console.log('');
    console.log('🎯 You can now:');
    console.log('   - Use user_id "test-user-123" to test APIs');
    console.log('   - View categories at: GET /api/v1/categories/test-user-123');
    console.log('   - Create expenses with the seeded categories');
    console.log('');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding
seed_database();
