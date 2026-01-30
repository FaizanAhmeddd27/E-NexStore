import express from 'express';
import {
  getAllProducts,
  getProductsByCategory,
  getFeaturedProductsController,
  getRecommendedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleFeaturedProduct,
  getProductById
} from '../controllers/product.controller.js';
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js';
import {upload} from '../middleware/multer.middleware.js';
const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/featured', getFeaturedProductsController);
router.get('/recommendations', getRecommendedProducts);
router.get('/:id', getProductById);

// Admin routes
router.post('/', protectRoute, adminRoute, upload.single('image'), createProduct);
router.put('/:id', protectRoute, adminRoute, upload.single('image'), updateProduct);
router.delete('/:id', protectRoute, adminRoute, deleteProduct);
router.patch('/:id/toggle-featured', protectRoute, adminRoute, toggleFeaturedProduct);

export default router;