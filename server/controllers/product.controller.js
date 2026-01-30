import Product from '../models/product.model.js';
import { redis, setFeaturedProducts, getFeaturedProducts, updateFeaturedProductsCache } from '../lib/redis.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/imageUpload.js';

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch products' 
    });
  }
};

// Get products by category
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch products' 
    });
  }
};

// Get featured products (from Redis cache)
export const getFeaturedProductsController = async (req, res) => {
  try {
    // Try to get from Redis cache first
    let featuredProducts = await getFeaturedProducts();
    
    if (!featuredProducts) {
      // If not in cache, get from database
      featuredProducts = await Product.find({ isFeatured: true })
        .sort({ createdAt: -1 })
        .lean();
      
      // Store in Redis cache
      if (featuredProducts.length > 0) {
        await setFeaturedProducts(featuredProducts);
      }
    }
    
    res.json({
      success: true,
      count: featuredProducts.length,
      products: featuredProducts
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch featured products' 
    });
  }
};

// Get recommended products (random)
export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      { $sample: { size: 4 } },
      { $project: { __v: 0 } }
    ]);

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Get recommended products error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch recommended products' 
    });
  }
};

// Create product (with Cloudinary upload)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, isFeatured } = req.body;

    // Validation
    if (!name || !description || !price || !category || stock === undefined) {
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required' 
      });
    }

    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'Product image is required' 
      });
    }

    console.log('Create product - received file:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    // Upload image to Cloudinary
    const imageData = await uploadToCloudinary(req.file, 'products');

    console.log('Create product - upload result:', imageData);

    // Create product
    const product = await Product.create({
      name,
      description,
      price: Number(price),
      category,
      stock: Number(stock),
      isFeatured: !!JSON.parse(typeof isFeatured === 'string' ? isFeatured : JSON.stringify(isFeatured)),
      image: {
        url: imageData.url,
        publicId: imageData.publicId
      },
      createdBy: req.user._id
    });

    // If product is featured, update the featured products cache
    if (product.isFeatured) {
      try {
        await updateFeaturedProductsCache(Product);
        console.log('Featured products cache updated after product creation');
      } catch (err) {
        console.error('Failed to update featured products cache after creation:', err);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Failed to create product' 
    });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, stock } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    // Update fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = Number(price);
    if (category) product.category = category;
    if (stock !== undefined) product.stock = Number(stock);

    // Update image if new file provided
    if (req.file) {
      // Delete old image from Cloudinary
      await deleteFromCloudinary(product.image.publicId);
      
      // Upload new image
      const imageData = await uploadToCloudinary(req.file, 'products');
      product.image = {
        url: imageData.url,
        publicId: imageData.publicId
      };
    }

    await product.save();

    // Update cache if featured
    if (product.isFeatured) {
      await updateFeaturedProductsCache(Product);
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update product' 
    });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    // Delete image from Cloudinary
    if (product.image && product.image.publicId) {
      await deleteFromCloudinary(product.image.publicId);
    }

    // Delete product
    await Product.findByIdAndDelete(id);

    // Update Redis cache if product was featured
    if (product.isFeatured) {
      await updateFeaturedProductsCache(Product);
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete product' 
    });
  }
};

// Toggle featured status
export const toggleFeaturedProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    product.isFeatured = !product.isFeatured;
    await product.save();

    // Update Redis cache immediately
    await updateFeaturedProductsCache(Product);

    res.json({
      success: true,
      message: `Product ${product.isFeatured ? 'featured' : 'unfeatured'} successfully`,
      product
    });
  } catch (error) {
    console.error('Toggle featured error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to toggle featured status' 
    });
  }
};

// Get single product
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch product' 
    });
  }
};