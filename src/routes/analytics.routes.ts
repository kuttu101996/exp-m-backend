import { Router } from 'express';
import {
  get_analytics,
  get_daily_breakdown,
  get_weekly_breakdown,
  get_monthly_breakdown,
} from '../controllers/analytics.controller';

const router = Router();

// GET /api/v1/analytics/:user_id - Get overall analytics with category breakdown
router.get('/:user_id', get_analytics);

// GET /api/v1/analytics/:user_id/daily - Get daily breakdown
router.get('/:user_id/daily', get_daily_breakdown);

// GET /api/v1/analytics/:user_id/weekly - Get weekly breakdown
router.get('/:user_id/weekly', get_weekly_breakdown);

// GET /api/v1/analytics/:user_id/monthly - Get monthly breakdown
router.get('/:user_id/monthly', get_monthly_breakdown);

export default router;
