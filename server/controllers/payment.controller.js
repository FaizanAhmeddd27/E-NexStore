import Stripe from 'stripe';
import Order from '../models/order.model.js';
import Coupon from '../models/coupon.model.js';
import User from '../models/user.model.js';
import { stripe, createStripeCheckoutSession, retrieveStripeSession } from '../lib/stripe.js';

export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid products array' 
      });
    }

    let totalAmount = 0;

    // Validate products and check stock
    for (const item of products) {
      const product = await Product.findById(item._id);
      
      if (!product) {
        return res.status(404).json({ 
          success: false,
          message: `Product not found: ${item.name}` 
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          success: false,
          message: `Not enough stock for ${product.name}. Available: ${product.stock}` 
        });
      }
    }

    // Create line items
    const lineItems = products.map(product => {
      const amount = Math.round(product.price * 100);
      totalAmount += amount * product.quantity;

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: product.description || '',
            images: [product.image.url]
          },
          unit_amount: amount
        },
        quantity: product.quantity || 1
      };
    });

    // Handle coupon
    let coupon = null;
    let discount = 0;

    if (couponCode) {
      coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });

      if (!coupon || !coupon.isValid()) {
        return res.status(400).json({ 
          success: false,
          message: 'Invalid or expired coupon' 
        });
      }

      if (coupon.usedBy.includes(req.user._id)) {
        return res.status(400).json({ 
          success: false,
          message: 'You have already used this coupon' 
        });
      }

      discount = Math.round((totalAmount * coupon.discountPercentage) / 100);
      totalAmount -= discount;
    }

    // Create Stripe session
    const session = await createStripeCheckoutSession({
      lineItems,
      userId: req.user._id,
      couponCode: couponCode || '',
      products: products.map(p => ({
        id: p._id,
        quantity: p.quantity,
        price: p.price
      })),
      successUrl: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.CLIENT_URL}/payment-failed`
    });

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url,
      totalAmount: totalAmount / 100,
      discount: discount / 100
    });
  } catch (error) {
    console.error('Create checkout session error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Failed to create checkout session' 
    });
  }
};

export const checkoutSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ 
        success: false,
        message: 'Session ID is required' 
      });
    }

    const session = await retrieveStripeSession(sessionId);

    if (session.payment_status === 'paid') {
      // Check if order already exists
      const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
      
      if (existingOrder) {
        return res.json({ 
          success: true, 
          orderId: existingOrder._id,
          message: 'Order already processed' 
        });
      }

      const products = JSON.parse(session.metadata.products);
      const userId = session.metadata.userId;
      const couponCode = session.metadata.couponCode;

      // Create order
      const order = new Order({
        user: userId,
        products: products.map(p => ({
          product: p.id,
          quantity: p.quantity,
          price: p.price
        })),
        totalAmount: session.amount_total / 100,
        stripeSessionId: sessionId,
        paymentStatus: 'paid'
      });

      // Add coupon if used
      if (couponCode) {
        const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
        if (coupon) {
          order.couponUsed = {
            code: coupon.code,
            discount: coupon.discountPercentage
          };
          
          if (!coupon.usedBy.includes(userId)) {
            coupon.usedBy.push(userId);
            coupon.currentUses += 1;
            await coupon.save();
          }
        }
      }

      // Update product stock
      for (const item of products) {
        await Product.findByIdAndUpdate(item.id, {
          $inc: { stock: -item.quantity }
        });
      }

      await order.save();

      // Clear user's cart
      await User.findByIdAndUpdate(userId, { cartItems: [] });

      res.json({ 
        success: true, 
        orderId: order._id,
        message: 'Payment successful and order created' 
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: 'Payment not completed' 
      });
    }
  } catch (error) {
    console.error('Checkout success error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Failed to process checkout' 
    });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ 
        success: false,
        message: 'Coupon code is required' 
      });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon || !coupon.isValid()) {
      return res.status(404).json({ 
        success: false,
        message: 'Invalid or expired coupon' 
      });
    }

    if (coupon.usedBy.includes(req.user._id)) {
      return res.status(400).json({ 
        success: false,
        message: 'You have already used this coupon' 
      });
    }

    res.json({
      success: true,
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
      message: 'Coupon is valid'
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to validate coupon' 
    });
  }
};

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('⚠️ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`✅ Webhook received: ${event.type}`);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case 'checkout.session.async_payment_failed':
      case 'payment_intent.payment_failed': {
        console.log('❌ Payment failed');
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object;
        await handleRefund(charge);
        break;
      }

      default:
        console.log(`⚡ Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('❌ Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
};

async function handleCheckoutSessionCompleted(session) {
  try {
    const existingOrder = await Order.findOne({ stripeSessionId: session.id });
    
    if (existingOrder) {
      console.log('Order already exists:', existingOrder._id);
      return;
    }

    const products = JSON.parse(session.metadata.products);
    const userId = session.metadata.userId;
    const couponCode = session.metadata.couponCode;

    const order = new Order({
      user: userId,
      products: products.map(p => ({
        product: p.id,
        quantity: p.quantity,
        price: p.price
      })),
      totalAmount: session.amount_total / 100,
      stripeSessionId: session.id,
      paymentStatus: 'paid'
    });

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (coupon) {
        order.couponUsed = {
          code: coupon.code,
          discount: coupon.discountPercentage
        };
        
        if (!coupon.usedBy.includes(userId)) {
          coupon.usedBy.push(userId);
          coupon.currentUses += 1;
          await coupon.save();
        }
      }
    }

    // Update stock
    for (const item of products) {
      await Product.findByIdAndUpdate(item.id, {
        $inc: { stock: -item.quantity }
      });
    }

    await order.save();
    await User.findByIdAndUpdate(userId, { cartItems: [] });

    console.log('✅ Order created successfully:', order._id);
  } catch (error) {
    console.error('Error in handleCheckoutSessionCompleted:', error);
    throw error;
  }
}

async function handleRefund(charge) {
  try {
    const order = await Order.findOne({ stripeSessionId: charge.payment_intent });
    
    if (order) {
      order.paymentStatus = 'refunded';
      
      // Restore stock
      for (const item of order.products) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity }
        });
      }
      
      await order.save();
      console.log('✅ Order refunded:', order._id);
    }
  } catch (error) {
    console.error('Error handling refund:', error);
  }
}

export const getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('products.product')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Get order history error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch order history' 
    });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('products.product')
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied' 
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order details error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch order details' 
    });
  }
};