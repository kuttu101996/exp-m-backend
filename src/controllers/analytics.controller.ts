import { Request, Response } from 'express';
import { user_expense_model, expense_category_model } from '../models';
import { send_success, send_error } from '../utils/response';

// Get expense summary and category breakdown
export const get_analytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id } = req.params;
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
      send_error(res, 'start_date and end_date are required', 'Validation error', 400);
      return;
    }

    const period_start = new Date(start_date as string);
    const period_end = new Date(end_date as string);

    // Get all expenses in the date range
    const expenses = await user_expense_model.find({
      user_id,
      expense_date: {
        $gte: period_start,
        $lte: period_end,
      },
    });

    // Calculate total summary
    const total_amount = expenses.reduce((sum, exp) => sum + exp.expense_amount, 0);
    const expense_count = expenses.length;

    // Group by category
    const category_map = new Map<string, { total: number; count: number }>();

    expenses.forEach((exp) => {
      const existing = category_map.get(exp.category_id) || { total: 0, count: 0 };
      category_map.set(exp.category_id, {
        total: existing.total + exp.expense_amount,
        count: existing.count + 1,
      });
    });

    // Fetch category details and build breakdown
    const category_ids = Array.from(category_map.keys());
    const categories = await expense_category_model.find({
      category_id: { $in: category_ids },
    });

    const category_breakdown = categories.map((cat) => {
      const stats = category_map.get(cat.category_id)!;
      return {
        category_id: cat.category_id,
        category_name: cat.category_name,
        category_icon: cat.category_icon,
        category_color: cat.category_color,
        total_amount: stats.total,
        expense_count: stats.count,
        percentage: total_amount > 0 ? (stats.total / total_amount) * 100 : 0,
      };
    }).sort((a, b) => b.total_amount - a.total_amount);

    send_success(res, {
      summary: {
        total_amount,
        expense_count,
        period_start,
        period_end,
      },
      category_breakdown,
    }, 'Analytics retrieved successfully');
  } catch (error) {
    send_error(res, (error as Error).message, 'Failed to fetch analytics');
  }
};

// Get daily breakdown
export const get_daily_breakdown = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id } = req.params;
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
      send_error(res, 'start_date and end_date are required', 'Validation error', 400);
      return;
    }

    const result = await user_expense_model.aggregate([
      {
        $match: {
          user_id,
          expense_date: {
            $gte: new Date(start_date as string),
            $lte: new Date(end_date as string),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$expense_date' },
          },
          total_amount: { $sum: '$expense_amount' },
          expense_count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          total_amount: 1,
          expense_count: 1,
        },
      },
    ]);

    send_success(res, result, 'Daily breakdown retrieved successfully');
  } catch (error) {
    send_error(res, (error as Error).message, 'Failed to fetch daily breakdown');
  }
};

// Get weekly breakdown
export const get_weekly_breakdown = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id } = req.params;
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
      send_error(res, 'start_date and end_date are required', 'Validation error', 400);
      return;
    }

    const result = await user_expense_model.aggregate([
      {
        $match: {
          user_id,
          expense_date: {
            $gte: new Date(start_date as string),
            $lte: new Date(end_date as string),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$expense_date' },
            week: { $week: '$expense_date' },
          },
          total_amount: { $sum: '$expense_amount' },
          expense_count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.week': 1 },
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          week: '$_id.week',
          total_amount: 1,
          expense_count: 1,
        },
      },
    ]);

    send_success(res, result, 'Weekly breakdown retrieved successfully');
  } catch (error) {
    send_error(res, (error as Error).message, 'Failed to fetch weekly breakdown');
  }
};

// Get monthly breakdown
export const get_monthly_breakdown = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id } = req.params;
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
      send_error(res, 'start_date and end_date are required', 'Validation error', 400);
      return;
    }

    const result = await user_expense_model.aggregate([
      {
        $match: {
          user_id,
          expense_date: {
            $gte: new Date(start_date as string),
            $lte: new Date(end_date as string),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$expense_date' },
            month: { $month: '$expense_date' },
          },
          total_amount: { $sum: '$expense_amount' },
          expense_count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          total_amount: 1,
          expense_count: 1,
        },
      },
    ]);

    send_success(res, result, 'Monthly breakdown retrieved successfully');
  } catch (error) {
    send_error(res, (error as Error).message, 'Failed to fetch monthly breakdown');
  }
};
