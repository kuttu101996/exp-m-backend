import { Router } from 'express';
import {
  get_sub_categories,
  create_sub_category,
  update_sub_category,
  delete_sub_category,
} from '../controllers/sub_category.controller';

const router = Router();

// GET /api/v1/sub-categories/:category_id - Get all sub-categories for a category
router.get('/:category_id', get_sub_categories);

// POST /api/v1/sub-categories - Create new sub-category
router.post('/', create_sub_category);

// PUT /api/v1/sub-categories/:sub_category_id - Update sub-category
router.put('/:sub_category_id', update_sub_category);

// DELETE /api/v1/sub-categories/:sub_category_id - Delete sub-category
router.delete('/:sub_category_id', delete_sub_category);

export default router;
