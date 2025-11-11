import { Router } from 'express';
import {
  get_categories,
  get_category_by_id,
  check_similar_categories,
  create_category,
  update_category,
  delete_category,
} from '../controllers/category.controller';

const router = Router();

// GET /api/v1/categories/:user_id - Get all categories for user
router.get('/:user_id', get_categories);

// GET /api/v1/categories/detail/:category_id - Get single category
router.get('/detail/:category_id', get_category_by_id);

// POST /api/v1/categories/check-similar - Check for similar category names
router.post('/check-similar', check_similar_categories);

// POST /api/v1/categories - Create new category
router.post('/', create_category);

// PUT /api/v1/categories/:category_id - Update category
router.put('/:category_id', update_category);

// DELETE /api/v1/categories/:category_id - Delete category
router.delete('/:category_id', delete_category);

export default router;
