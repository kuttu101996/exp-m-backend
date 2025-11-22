import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { user_income_model } from '../models';
import { send_success, send_error, send_not_found } from '../utils/response';

// Get all incomes with optional filtering
export const get_incomes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id } = req.params;
    const { start_date, end_date, category_id, page = 1, page_size = 20 } = req.query;

    const query: any = { user_id };

    // Date range filtering
    if (start_date || end_date) {
      query.income_date = {};
      if (start_date) query.income_date.$gte = new Date(start_date as string);
      if (end_date) query.income_date.$lte = new Date(end_date as string);
    }

    // Category filtering
    if (category_id) query.category_id = category_id;

    // Source type filtering
    // if (source_type) query.source_type = source_type;

    const skip = (Number(page) - 1) * Number(page_size);
    const limit = Number(page_size);

    const [incomes, total_count] = await Promise.all([
      user_income_model
        .find(query)
        .sort({ income_date: -1 })
        .skip(skip)
        .limit(limit),
      user_income_model.countDocuments(query),
    ]);

    const total_pages = Math.ceil(total_count / limit);

    send_success(res, {
      incomes,
      pagination: {
        total_count,
        page: Number(page),
        page_size: limit,
        total_pages,
      },
    }, 'Incomes retrieved successfully');
  } catch (error) {
    send_error(res, (error as Error).message, 'Failed to fetch incomes');
  }
};

// Get single income by ID
export const get_income_by_id = async (req: Request, res: Response): Promise<void> => {
  try {
    const { income_id } = req.params;

    const income = await user_income_model.findOne({ income_id });

    if (!income) {
      send_not_found(res, 'Income');
      return;
    }

    send_success(res, income, 'Income retrieved successfully');
  } catch (error) {
    send_error(res, (error as Error).message, 'Failed to fetch income');
  }
};

// Create new income
export const create_income = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      user_id,
      category_id,
      income_amount,
      income_description,
      income_date,
      // source_type,
    } = req.body;

    if (!user_id || !category_id || !income_amount || !income_date) {
      send_error(
        res,
        'user_id, category_id, income_amount, and income_date are required',
        'Validation error',
        400
      );
      return;
    }

    if (income_amount <= 0) {
      send_error(res, 'income_amount must be greater than 0', 'Validation error', 400);
      return;
    }

    const new_income = new user_income_model({
      income_id: uuidv4(),
      user_id,
      category_id,
      income_amount,
      income_description,
      income_date: new Date(income_date),
      // source_type,
    });

    await new_income.save();

    send_success(res, new_income, 'Income created successfully', 201);
  } catch (error) {
    send_error(res, (error as Error).message, 'Failed to create income');
  }
};

// Update income
export const update_income = async (req: Request, res: Response): Promise<void> => {
  try {
    const { income_id } = req.params;
    const {
      category_id,
      income_amount,
      income_description,
      income_date,
      // source_type,
    } = req.body;

    const income = await user_income_model.findOne({ income_id });

    if (!income) {
      send_not_found(res, 'Income');
      return;
    }

    if (category_id) income.category_id = category_id;
    if (income_amount !== undefined) {
      if (income_amount <= 0) {
        send_error(res, 'income_amount must be greater than 0', 'Validation error', 400);
        return;
      }
      income.income_amount = income_amount;
    }
    if (income_description !== undefined) income.income_description = income_description;
    if (income_date) income.income_date = new Date(income_date);
    // if (source_type !== undefined) income.source_type = source_type;

    await income.save();

    send_success(res, income, 'Income updated successfully');
  } catch (error) {
    send_error(res, (error as Error).message, 'Failed to update income');
  }
};

// Delete income
export const delete_income = async (req: Request, res: Response): Promise<void> => {
  try {
    const { income_id } = req.params;

    const income = await user_income_model.findOne({ income_id });

    if (!income) {
      send_not_found(res, 'Income');
      return;
    }

    await user_income_model.deleteOne({ income_id });

    send_success(res, { income_id }, 'Income deleted successfully');
  } catch (error) {
    send_error(res, (error as Error).message, 'Failed to delete income');
  }
};
