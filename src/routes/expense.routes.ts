import { Router } from 'express';
import {
  get_expenses,
  get_expense_by_id,
  create_expense,
  update_expense,
  delete_expense,
} from '../controllers/expense.controller';

const router = Router();

// GET /api/v1/expenses/:user_id - Get all expenses for user (with optional filters)
router.get('/:user_id', get_expenses);

// GET /api/v1/expenses/detail/:expense_id - Get single expense
router.get('/detail/:expense_id', get_expense_by_id);

// POST /api/v1/expenses - Create new expense
router.post('/', create_expense);

// PUT /api/v1/expenses/:expense_id - Update expense
router.put('/:expense_id', update_expense);

// DELETE /api/v1/expenses/:expense_id - Delete expense
router.delete('/:expense_id', delete_expense);

export default router;
