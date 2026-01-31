import express from 'express';
import { getFeaturedCache, refreshFeaturedCache, listCoupons, createCoupon, deleteCoupon } from '../controllers/admin.controller.js';
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protected admin cache inspection
router.get('/cache/featured', protectRoute, adminRoute, getFeaturedCache);
// Protected admin endpoint to refresh featured cache
router.post('/cache/featured/refresh', protectRoute, adminRoute, refreshFeaturedCache);

// Admin coupon management
router.get('/coupons', protectRoute, adminRoute, listCoupons);
router.post('/coupons', protectRoute, adminRoute, createCoupon);
router.delete('/coupons/:id', protectRoute, adminRoute, deleteCoupon);

export default router;