import mongoose, { Schema, Document } from 'mongoose';
import { user_profile } from '../types';

export interface user_profile_document extends Omit<user_profile, 'user_id'>, Document {
  user_id: string;
}

const user_profile_schema = new Schema<user_profile_document>(
  {
    user_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user_name: {
      type: String,
      required: true,
      trim: true,
    },
    user_email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    user_phone: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'user_profiles',
  }
);

// Indexes for better query performance
user_profile_schema.index({ user_email: 1 });

export const user_profile_model = mongoose.model<user_profile_document>(
  'user_profile',
  user_profile_schema
);
