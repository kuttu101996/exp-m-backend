import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { expense_category_model, user_expense_model, user_income_model } from '../models';
import { send_success, send_error, send_not_found } from '../utils/response';
import { find_similar_strings } from '../utils/fuzzy_match';
import { category_type } from '../types';

// Get all categories for a user (with optional category_type filter)
export const get_categories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id } = req.params;
    const { category_type: type_filter } = req.query;

    // Build query with optional category_type filter
    const query: { user_id: string; category_type?: category_type } = { user_id };
    if (type_filter && (type_filter === 'income' || type_filter === 'expense')) {
      query.category_type = type_filter as category_type;
    }

    const categories = await expense_category_model
      .find(query)
      .sort({ created_at: -1 });

    // Get transaction count for each category (expense or income based on type)
    const categories_with_count = await Promise.all(
      categories.map(async (category) => {
        let transaction_count = 0;

        if (category.category_type === 'income') {
          transaction_count = await user_income_model.countDocuments({
            category_id: category.category_id,
          });
        } else {
          transaction_count = await user_expense_model.countDocuments({
            category_id: category.category_id,
          });
        }

        return {
          ...category.toObject(),
          expense_count: transaction_count, // Keep field name for backward compatibility
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

// Check for similar category names (with optional category_type filter)
export const check_similar_categories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, category_name, category_type: type_filter } = req.body;

    if (!category_name || !user_id) {
      send_error(res, 'user_id and category_name are required', 'Validation error', 400);
      return;
    }

    // Build query with optional category_type filter
    const query: { user_id: string; category_type?: category_type } = { user_id };
    if (type_filter && (type_filter === 'income' || type_filter === 'expense')) {
      query.category_type = type_filter as category_type;
    }

    const existing_categories = await expense_category_model.find(query);
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
    const { user_id, category_name, category_icon, category_color, category_type: cat_type } = req.body;

    if (!user_id || !category_name) {
      send_error(res, 'user_id and category_name are required', 'Validation error', 400);
      return;
    }

    // Validate category_type if provided
    const valid_category_type = cat_type === 'income' ? 'income' : 'expense';

    // Check for exact duplicate within the same category type
    const existing = await expense_category_model.findOne({
      user_id,
      category_name: { $regex: new RegExp(`^${category_name}$`, 'i') },
      category_type: valid_category_type,
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
      category_type: valid_category_type,
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
