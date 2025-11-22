import mongoose, { Schema, Document } from 'mongoose';
import { user_income } from '../types';

export interface user_income_document extends Omit<user_income, 'income_id'>, Document {
  income_id: string;
}

const user_income_schema = new Schema<user_income_document>(
  {
    income_id: {
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
    income_amount: {
      type: Number,
      required: true,
      min: 0,
    },
    income_description: {
      type: String,
      trim: true,
    },
    income_date: {
      type: Date,
      required: true,
      index: true,
    },
    // source_type: {
    //   type: String,
    //   trim: true,
    //   enum: ['salary', 'freelance', 'investment', 'gift', 'refund', 'other'],
    // },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'user_incomes',
  }
);

// Compound indexes for analytics and filtering
user_income_schema.index({ user_id: 1, income_date: -1 });
user_income_schema.index({ user_id: 1, category_id: 1, income_date: -1 });
user_income_schema.index({ category_id: 1, income_date: -1 });

export const user_income_model = mongoose.model<user_income_document>(
  'user_income',
  user_income_schema
);
