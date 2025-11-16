import { Router } from 'express';
import auth_routes from './auth.routes';
import category_routes from './category.routes';
import sub_category_routes from './sub_category.routes';
import expense_routes from './expense.routes';
import analytics_routes from './analytics.routes';

const router = Router();

// Mount all route modules
router.use('/auth', auth_routes);
router.use('/categories', category_routes);
router.use('/sub-categories', sub_category_routes);
router.use('/expenses', expense_routes);
router.use('/analytics', analytics_routes);

export default router;
