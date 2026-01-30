import { redis, updateFeaturedProductsCache } from '../lib/redis.js';
import Product from '../models/product.model.js';

export const getFeaturedCache = async (req, res) => {
  try {
    const raw = await redis.get('featured_products');
    const products = raw ? JSON.parse(raw) : null;

    const ttl = raw ? await redis.ttl('featured_products') : -2;

    res.json({
      success: true,
      cached: !!raw,
      ttl,
      count: products ? products.length : 0,
      products
    });
  } catch (error) {
    console.error('Get featured cache error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch featured cache' });
  }
};

export const refreshFeaturedCache = async (req, res) => {
  try {
    const ok = await updateFeaturedProductsCache(Product);
    res.json({ success: !!ok, refreshed: !!ok });
  } catch (error) {
    console.error('Refresh featured cache error:', error);
    res.status(500).json({ success: false, message: 'Failed to refresh featured cache' });
  }
};