import express from 'express';
import {
  createCheckoutSession,
  checkoutSuccess,
  validateCoupon,
  handleStripeWebhook,
  getOrderHistory,
  getOrderDetails
} from '../controllers/payment.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// Webhook route (must be before express.json())
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Protected routes
router.post('/create-checkout-session', protectRoute, createCheckoutSession);
// Allow checkout success to be processed without the user's active session — Stripe redirects back with session_id
router.post('/checkout-success', checkoutSuccess);
router.post('/validate-coupon', protectRoute, validateCoupon);
router.get('/orders', protectRoute, getOrderHistory);
router.get('/orders/:orderId', protectRoute, getOrderDetails);

export default router;