import mongoose, { Schema, Document } from 'mongoose';
import { user_expense } from '../types';

export interface user_expense_document extends Omit<user_expense, 'expense_id'>, Document {
  expense_id: string;
}

const user_expense_schema = new Schema<user_expense_document>(
  {
    expense_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user_id: {
      type: String,
      required: true,
      index: true,
    },
    category_id: {
      type: String,
      required: true,
      index: true,
    },
    sub_category_id: {
      type: String,
      index: true,
    },
    expense_amount: {
      type: Number,
      required: true,
      min: 0,
    },
    expense_description: {
      type: String,
      trim: true,
    },
    expense_date: {
      type: Date,
      required: true,
      index: true,
    },
    payment_method: {
      type: String,
      trim: true,
      enum: ['cash', 'card', 'upi', 'net_banking', 'other'],
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'user_expenses',
  }
);

// Compound indexes for analytics and filtering
user_expense_schema.index({ user_id: 1, expense_date: -1 });
user_expense_schema.index({ user_id: 1, category_id: 1, expense_date: -1 });
user_expense_schema.index({ category_id: 1, expense_date: -1 });

export const user_expense_model = mongoose.model<user_expense_document>(
  'user_expense',
  user_expense_schema
);
