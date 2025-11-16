import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { expense_category_model, user_expense_model } from '../models';
import { send_success, send_error, send_not_found } from '../utils/response';
import { find_similar_strings } from '../utils/fuzzy_match';

// Get all categories for a user
export const get_categories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id } = req.params;

    const categories = await expense_category_model
      .find({ user_id })
      .sort({ created_at: -1 });

    // Get expense count for each category
    const categories_with_count = await Promise.all(
      categories.map(async (category) => {
        const expense_count = await user_expense_model.countDocuments({
          category_id: category.category_id,
        });
        return {
          ...category.toObject(),
          expense_count,
        };
      })
    );

    send_success(res, categories_with_count, 'Categories retrieved successfully');
  } catch (error) {
    send_error(res, (error as Error).message, 'Failed to fetch categories');
  }
};

// Get single category by ID
export const get_category_by_id = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category_id } = req.params;

    const category = await expense_category_model.findOne({ category_id });

    if (!category) {
      send_not_found(res, 'Category');
      return;
    }

    send_success(res, category, 'Category retrieved successfully');
  } catch (error) {
    send_error(res, (error as Error).message, 'Failed to fetch category');
  }
};

// Check for similar category names
export const check_similar_categories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, category_name } = req.body;

    if (!category_name || !user_id) {
      send_error(res, 'user_id and category_name are required', 'Validation error', 400);
      return;
    }

    const existing_categories = await expense_category_model.find({ user_id });
    const existing_names = existing_categories.map((cat) => cat.category_name);

    const similar_matches = find_similar_strings(category_name, existing_names, 70);

    send_success(res, {
      has_similar: similar_matches.length > 0,
      suggestions: similar_matches,
    }, 'Similar categories checked');
  } catch (error) {
    send_error(res, (error as Error).message, 'Failed to check similar categories');
  }
};

// Create new category
export const create_category = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, category_name, category_icon, category_color } = req.body;

    if (!user_id || !category_name) {
      send_error(res, 'user_id and category_name are required', 'Validation error', 400);
      return;
    }

    // Check for exact duplicate
    const existing = await expense_category_model.findOne({
      user_id,
      category_name: { $regex: new RegExp(`^${category_name}$`, 'i') },
    });

    if (existing) {
      send_error(res, 'Category with this name already exists', 'Duplicate category', 409);
      return;
    }

    const new_category = new expense_category_model({
      category_id: uuidv4(),
      user_id,
      category_name,
      category_icon: category_icon || '📁',
      category_color: category_color || '#6366f1',
      is_default: false,
    });

    await new_category.save();

    send_success(res, new_category, 'Category created successfully', 201);
  } catch (error) {
    send_error(res, (error as Error).message, 'Failed to create category');
  }
};

// Update category
export const update_category = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category_id } = req.params;
    const { category_name, category_icon, category_color } = req.body;

    const category = await expense_category_model.findOne({ category_id });

    if (!category) {
      send_not_found(res, 'Category');
      return;
    }

    // Prevent updating default categories
    if (category.is_default) {
      send_error(res, 'Cannot update default categories', 'Operation not allowed', 403);
      return;
    }

    if (category_name) category.category_name = category_name;
    if (category_icon) category.category_icon = category_icon;
    if (category_color) category.category_color = category_color;

    await category.save();

    send_success(res, category, 'Category updated successfully');
  } catch (error) {
    send_error(res, (error as Error).message, 'Failed to update category');
  }
};

// Delete category
export const delete_category = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category_id } = req.params;

    const category = await expense_category_model.findOne({ category_id });

    if (!category) {
      send_not_found(res, 'Category');
      return;
    }

    // Prevent deleting default categories
    if (category.is_default) {
      send_error(res, 'Cannot delete default categories', 'Operation not allowed', 403);
      return;
    }

    await expense_category_model.deleteOne({ category_id });

    send_success(res, { category_id }, 'Category deleted successfully');
  } catch (error) {
    send_error(res, (error as Error).message, 'Failed to delete category');
  }
};
