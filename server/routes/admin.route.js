import express from 'express';
import { getFeaturedCache, refreshFeaturedCache } from '../controllers/admin.controller.js';
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protected admin cache inspection
router.get('/cache/featured', protectRoute, adminRoute, getFeaturedCache);
// Protected admin endpoint to refresh featured cache
router.post('/cache/featured/refresh', protectRoute, adminRoute, refreshFeaturedCache);

export default router;