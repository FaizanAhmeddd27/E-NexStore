import { redis, updateFeaturedProductsCache } from '../lib/redis.js';
import Product from '../models/product.model.js';
import Coupon from '../models/coupon.model.js';

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

// -------------------- Coupon Management (Admin) --------------------
export const listCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, count: coupons.length, coupons });
  } catch (error) {
    console.error('List coupons error:', error);
    res.status(500).json({ success: false, message: 'Failed to list coupons' });
  }
};

export const createCoupon = async (req, res) => {
  try {
    const { code, discountPercentage, expirationDate, maxUses } = req.body;

    if (!code || !discountPercentage || !expirationDate) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const existing = await Coupon.findOne({ code: code.toUpperCase().trim() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Coupon code already exists' });
    }

    const coupon = new Coupon({
      code: code.toUpperCase().trim(),
      discountPercentage,
      expirationDate: new Date(expirationDate),
      maxUses: maxUses || null,
      isActive: true
    });

    await coupon.save();

    res.status(201).json({ success: true, coupon });
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(500).json({ success: false, message: 'Failed to create coupon' });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    res.json({ success: true, message: 'Coupon deleted' });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete coupon' });
  }
};