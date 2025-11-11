import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { expense_sub_category_model } from '../models';
import { send_success, send_error, send_not_found } from '../utils/response';

// Get all sub-categories for a category
export const get_sub_categories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category_id } = req.params;

    const sub_categories = await expense_sub_category_model
      .find({ category_id })
      .sort({ created_at: -1 });

    send_success(res, sub_categories, 'Sub-categories retrieved successfully');
  } catch (error) {
    send_error(res, (error as Error).message, 'Failed to fetch sub-categories');
  }
};

// Create new sub-category
export const create_sub_category = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category_id, sub_category_name } = req.body;

    if (!category_id || !sub_category_name) {
      send_error(res, 'category_id and sub_category_name are required', 'Validation error', 400);
      return;
    }

    // Check for exact duplicate
    const existing = await expense_sub_category_model.findOne({
      category_id,
      sub_category_name: { $regex: new RegExp(`^${sub_category_name}$`, 'i') },
    });

    if (existing) {
      send_error(res, 'Sub-category with this name already exists', 'Duplicate sub-category', 409);
      return;
    }

    const new_sub_category = new expense_sub_category_model({
      sub_category_id: uuidv4(),
      category_id,
      sub_category_name,
    });

    await new_sub_category.save();

    send_success(res, new_sub_category, 'Sub-category created successfully', 201);
  } catch (error) {
    send_error(res, (error as Error).message, 'Failed to create sub-category');
  }
};

// Update sub-category
export const update_sub_category = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sub_category_id } = req.params;
    const { sub_category_name } = req.body;

    const sub_category = await expense_sub_category_model.findOne({ sub_category_id });

    if (!sub_category) {
      send_not_found(res, 'Sub-category');
      return;
    }

    if (sub_category_name) {
      sub_category.sub_category_name = sub_category_name;
    }

    await sub_category.save();

    send_success(res, sub_category, 'Sub-category updated successfully');
  } catch (error) {
    send_error(res, (error as Error).message, 'Failed to update sub-category');
  }
};

// Delete sub-category
export const delete_sub_category = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sub_category_id } = req.params;

    const sub_category = await expense_sub_category_model.findOne({ sub_category_id });

    if (!sub_category) {
      send_not_found(res, 'Sub-category');
      return;
    }

    await expense_sub_category_model.deleteOne({ sub_category_id });

    send_success(res, { sub_category_id }, 'Sub-category deleted successfully');
  } catch (error) {
    send_error(res, (error as Error).message, 'Failed to delete sub-category');
  }
};
