import express from 'express';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  getCartProducts,
  clearCart
} from '../controllers/cart.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protectRoute, getCartProducts);
router.post('/', protectRoute, addToCart);
router.delete('/clear', protectRoute, clearCart);
router.delete('/:productId', protectRoute, removeFromCart);
router.put('/:productId', protectRoute, updateQuantity);

export default router;