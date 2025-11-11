import mongoose, { Schema, Document } from 'mongoose';
import { expense_sub_category } from '../types';

export interface expense_sub_category_document extends Omit<expense_sub_category, 'sub_category_id'>, Document {
  sub_category_id: string;
}

const expense_sub_category_schema = new Schema<expense_sub_category_document>(
  {
    sub_category_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    category_id: {
      type: String,
      required: true,
      index: true,
    },
    sub_category_name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'expense_sub_categories',
  }
);

// Compound index for efficient queries
expense_sub_category_schema.index({ category_id: 1, sub_category_name: 1 });

export const expense_sub_category_model = mongoose.model<expense_sub_category_document>(
  'expense_sub_category',
  expense_sub_category_schema
);
