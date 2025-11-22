import mongoose, { Schema, Document } from 'mongoose';
import { expense_category } from '../types';

export interface expense_category_document extends Omit<expense_category, 'category_id'>, Document {
  category_id: string;
}

const expense_category_schema = new Schema<expense_category_document>(
  {
    category_id: {
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
    category_name: {
      type: String,
      required: true,
      trim: true,
    },
    category_icon: {
      type: String,
      trim: true,
    },
    category_color: {
      type: String,
      trim: true,
    },
    category_type: {
      type: String,
      enum: ['income', 'expense'],
      default: 'expense',
      index: true,
    },
    is_default: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'expense_categories',
  }
);

// Compound indexes for efficient queries
expense_category_schema.index({ user_id: 1, category_name: 1 });
expense_category_schema.index({ user_id: 1, is_default: 1 });
expense_category_schema.index({ user_id: 1, category_type: 1 });

export const expense_category_model = mongoose.model<expense_category_document>(
  'expense_category',
  expense_category_schema
);
