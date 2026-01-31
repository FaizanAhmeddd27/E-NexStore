import dotenv from 'dotenv';
dotenv.config();
import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN
});

// Featured Products Cache
export const setFeaturedProducts = async (products) => {
  try {
    const result = await redis.set('featured_products', JSON.stringify(products), {
      ex: 3600 // 1 hour expiration
    });
    return true;
  } catch (error) {
    console.error('Redis set error:', error);
    return false;
  }
};

export const getFeaturedProducts = async () => {
  try {
    const products = await redis.get('featured_products');
    return products ? JSON.parse(products) : null;
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
};

export const deleteFeaturedProducts = async () => {
  try {
    const result = await redis.del('featured_products');
    return result;
  } catch (error) {
    console.error('Redis delete error:', error);
    return null;
  }
};

// Helper function to update featured products cache
export const updateFeaturedProductsCache = async (Product) => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    const ok = await setFeaturedProducts(featuredProducts);
    if (!ok) console.warn('Failed to set featured products cache');
    return ok;
  } catch (error) {
    console.error('Error updating featured products cache:', error);
    return false;
  }
};