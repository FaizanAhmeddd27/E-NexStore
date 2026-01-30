import Order from '../models/order.model.js';
import Coupon from '../models/coupon.model.js';
import User from '../models/user.model.js';
import Product from '../models/product.model.js';
import { stripe, createStripeCheckoutSession, retrieveStripeSession } from '../lib/stripe.js';

export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid products array' });
    }

    let totalAmount = 0;

    // Validate stock
    for (const item of products) {
      const dbProduct = await Product.findById(item._id);
      if (!dbProduct) {
        return res.status(404).json({ success: false, message: `Product not found` });
      }
      if (dbProduct.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Not enough stock for ${dbProduct.name}` });
      }
    }

    // Line items for Stripe
    const lineItems = products.map((product) => {
      const unitAmount = Math.round(product.price * 100);
      totalAmount += unitAmount * product.quantity;

      const productData = { name: product.name };
      if (product.description) productData.description = product.description;
      if (product.image?.url) productData.images = [product.image.url];

      return {
        price_data: {
          currency: 'usd',
          product_data: productData,
          unit_amount: unitAmount,
        },
        quantity: product.quantity || 1,
      };
    });

    // Coupon
    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (!coupon || !coupon.isValid()) {
        return res.status(400).json({ success: false, message: 'Invalid or expired coupon' });
      }

      if (coupon.usedBy.includes(req.user._id)) {
        return res.status(400).json({ success: false, message: 'Coupon already used' });
      }

      discount = Math.round((totalAmount * coupon.discountPercentage) / 100);
      totalAmount -= discount;
    }

    const session = await createStripeCheckoutSession({
      lineItems,
      userId: req.user._id,
      couponCode: couponCode || '',
      products: products.map((p) => ({ id: p._id, quantity: p.quantity, price: p.price })),
      successUrl: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.CLIENT_URL}/payment-failed`,
    });

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url,
      totalAmount: totalAmount / 100,
      discount: discount / 100,
    });
  } catch (error) {
    console.error('Create checkout session error:', error);
    res.status(500).json({ success: false, message: 'Failed to create checkout session' });
  }
};

export const checkoutSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;
    console.log('checkoutSuccess called. sessionId:', sessionId, 'auth user:', !!req.user);

    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'Session ID is required' });
    }

    const session = await retrieveStripeSession(sessionId);
    console.log('Stripe session payment_status:', session.payment_status);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ success: false, message: 'Payment not completed' });
    }

    let order = await Order.findOne({ stripeSessionId: sessionId });
    if (order) {
      return res.json({ success: true, orderId: order._id, message: 'Order already processed' });
    }

    const products = JSON.parse(session.metadata.products);
    const userId = session.metadata.userId;
    const couponCode = session.metadata.couponCode;

    order = new Order({
      user: userId,
      products: products.map((p) => ({ product: p.id, quantity: p.quantity, price: p.price })),
      totalAmount: session.amount_total / 100,
      stripeSessionId: sessionId,
      paymentStatus: 'paid',
    });

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (coupon) {
        order.couponUsed = { code: coupon.code, discount: coupon.discountPercentage };
        if (!coupon.usedBy.includes(userId)) {
          coupon.usedBy.push(userId);
          coupon.currentUses += 1;
          await coupon.save();
        }
      }
    }

    // Update stock
    for (const item of products) {
      await Product.findByIdAndUpdate(item.id, { $inc: { stock: -item.quantity } });
    }

    await order.save();
    await User.findByIdAndUpdate(userId, { cartItems: [] });

    res.json({ success: true, orderId: order._id, message: 'Payment successful and order created' });
  } catch (error) {
    console.error('Checkout success error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to process checkout' });
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