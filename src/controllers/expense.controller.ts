import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { user_expense_model } from '../models';
import { send_success, send_error, send_not_found } from '../utils/response';

// Get all expenses with optional filtering
export const get_expenses = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id } = req.params;
    const { start_date, end_date, category_id, sub_category_id, page = 1, page_size = 50 } = req.query;

    const query: any = { user_id };

    // Date range filtering
    if (start_date || end_date) {
      query.expense_date = {};
      if (start_date) query.expense_date.$gte = new Date(start_date as string);
      if (end_date) query.expense_date.$lte = new Date(end_date as string);
    }

    // Category filtering
    if (category_id) query.category_id = category_id;
    if (sub_category_id) query.sub_category_id = sub_category_id;

    const skip = (Number(page) - 1) * Number(page_size);
    const limit = Number(page_size);

    const [expenses, total_count] = await Promise.all([
      user_expense_model
        .find(query)
        .sort({ expense_date: -1 })
        .skip(skip)
        .limit(limit),
      user_expense_model.countDocuments(query),
    ]);

    const total_pages = Math.ceil(total_count / limit);

    send_success(res, {
      expenses,
      pagination: {
        total_count,
        page: Number(page),
        page_size: limit,
        total_pages,
      },
    }, 'Expenses retrieved successfully');
  } catch (error) {
    send_error(res, (error as Error).message, 'Failed to fetch expenses');
  }
};

// Get single expense by ID
export const get_expense_by_id = async (req: Request, res: Response): Promise<void> => {
  try {
    const { expense_id } = req.params;

    const expense = await user_expense_model.findOne({ expense_id });

    if (!expense) {
      send_not_found(res, 'Expense');
      return;
    }

    send_success(res, expense, 'Expense retrieved successfully');
  } catch (error) {
    send_error(res, (error as Error).message, 'Failed to fetch expense');
  }
};

// Create new expense
export const create_expense = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      user_id,
      category_id,
      sub_category_id,
      expense_amount,
      expense_description,
      expense_date,
      payment_method,
    } = req.body;

    if (!user_id || !category_id || !expense_amount || !expense_date) {
      send_error(
        res,
        'user_id, category_id, expense_amount, and expense_date are required',
        'Validation error',
        400
      );
      return;
    }

    if (expense_amount <= 0) {
      send_error(res, 'expense_amount must be greater than 0', 'Validation error', 400);
      return;
    }

    const new_expense = new user_expense_model({
      expense_id: uuidv4(),
      user_id,
      category_id,
      sub_category_id,
      expense_amount,
      expense_description,
      expense_date: new Date(expense_date),
      payment_method,
    });

    await new_expense.save();

    send_success(res, new_expense, 'Expense created successfully', 201);
  } catch (error) {
    send_error(res, (error as Error).message, 'Failed to create expense');
  }
};

// Update expense
export const update_expense = async (req: Request, res: Response): Promise<void> => {
  try {
    const { expense_id } = req.params;
    const {
      category_id,
      sub_category_id,
      expense_amount,
      expense_description,
      expense_date,
      payment_method,
    } = req.body;

    const expense = await user_expense_model.findOne({ expense_id });

    if (!expense) {
      send_not_found(res, 'Expense');
      return;
    }

    if (category_id) expense.category_id = category_id;
    if (sub_category_id !== undefined) expense.sub_category_id = sub_category_id;
    if (expense_amount !== undefined) {
      if (expense_amount <= 0) {
        send_error(res, 'expense_amount must be greater than 0', 'Validation error', 400);
        return;
      }
      expense.expense_amount = expense_amount;
    }
    if (expense_description !== undefined) expense.expense_description = expense_description;
    if (expense_date) expense.expense_date = new Date(expense_date);
    if (payment_method !== undefined) expense.payment_method = payment_method;

    await expense.save();

    send_success(res, expense, 'Expense updated successfully');
  } catch (error) {
    send_error(res, (error as Error).message, 'Failed to update expense');
  }
};

// Delete expense
export const delete_expense = async (req: Request, res: Response): Promise<void> => {
  try {
    const { expense_id } = req.params;

    const expense = await user_expense_model.findOne({ expense_id });

    if (!expense) {
      send_not_found(res, 'Expense');
      return;
    }

    await user_expense_model.deleteOne({ expense_id });

    send_success(res, { expense_id }, 'Expense deleted successfully');
  } catch (error) {
    send_error(res, (error as Error).message, 'Failed to delete expense');
  }
};
