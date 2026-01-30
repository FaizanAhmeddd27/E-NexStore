import User from '../models/user.model.js';
import Product from '../models/product.model.js';

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ 
        success: false,
        message: 'Product ID is required' 
      });
    }

    const user = await User.findById(req.user._id);
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    // Check stock
    const existingItem = user.cartItems.find(
      item => item.product.toString() === productId
    );

    const newQuantity = existingItem ? existingItem.quantity + 1 : 1;

    if (newQuantity > product.stock) {
      return res.status(400).json({ 
        success: false,
        message: 'Not enough stock available' 
      });
    }

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push({ product: productId, quantity: 1 });
    }

    await user.save();
    
    res.json({
      success: true,
      message: 'Product added to cart',
      cartItems: user.cartItems
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to add product to cart' 
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    user.cartItems = user.cartItems.filter(
      item => item.product.toString() !== productId
    );

    await user.save();
    
    res.json({
      success: true,
      message: 'Product removed from cart',
      cartItems: user.cartItems
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to remove product from cart' 
    });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Quantity cannot be negative' 
      });
    }

    const user = await User.findById(req.user._id);
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    // Check stock
    if (quantity > product.stock) {
      return res.status(400).json({ 
        success: false,
        message: 'Not enough stock available' 
      });
    }

    const item = user.cartItems.find(
      item => item.product.toString() === productId
    );

    if (item) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter(
          item => item.product.toString() !== productId
        );
      } else {
        item.quantity = quantity;
      }

      await user.save();
      
      res.json({
        success: true,
        message: 'Cart updated successfully',
        cartItems: user.cartItems
      });
    } else {
      res.status(404).json({ 
        success: false,
        message: 'Product not found in cart' 
      });
    }
  } catch (error) {
    console.error('Update quantity error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update cart' 
    });
  }
};

export const getCartProducts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'cartItems.product',
      select: 'name price image category stock'
    });

    res.json({
      success: true,
      cartItems: user.cartItems
    });
  } catch (error) {
    console.error('Get cart products error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch cart products' 
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cartItems = [];
    await user.save();

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to clear cart' 
    });
  }
};