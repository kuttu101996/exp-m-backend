import { Router } from 'express';
import {
  get_incomes,
  get_income_by_id,
  create_income,
  update_income,
  delete_income,
} from '../controllers/income.controller';

const router = Router();

// GET /api/v1/incomes/:user_id - Get all incomes for user (with optional filters)
router.get('/:user_id', get_incomes);

// GET /api/v1/incomes/detail/:income_id - Get single income
router.get('/detail/:income_id', get_income_by_id);

// POST /api/v1/incomes - Create new income
router.post('/', create_income);

// PUT /api/v1/incomes/:income_id - Update income
router.put('/:income_id', update_income);

// DELETE /api/v1/incomes/:income_id - Delete income
router.delete('/:income_id', delete_income);

export default router;
