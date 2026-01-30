import dotenv from 'dotenv';
dotenv.config();

import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

// Read raw API version from env and sanitize (accepts '2026-01-28.clover' etc.)
const rawStripeApiVersion = process.env.STRIPE_API_VERSION || '';
const match = rawStripeApiVersion.match(/^(\d{4}-\d{2}-\d{2})/);
const sanitizedApiVersion = match ? match[1] : undefined;

const stripeOptions = sanitizedApiVersion ? { apiVersion: sanitizedApiVersion } : {};
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, stripeOptions);

console.log('Stripe initialized. raw API version:', rawStripeApiVersion || '(none)', 'sanitized:', sanitizedApiVersion || '(using default)');

export const createStripeCheckoutSession = async ({
  lineItems,
  userId,
  couponCode,
  products,
  successUrl,
  cancelUrl,
}) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: String(userId),
        couponCode: couponCode || '',
        products: JSON.stringify(products),
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'IN', 'DE', 'FR', 'PK'],
      },
      billing_address_collection: 'required',
    });

    console.log('✅ Stripe checkout session created:', session.id);
    return session;
  } catch (error) {
    console.error('❌ Stripe session creation error:', error);
    throw error;
  }
};

export const retrieveStripeSession = async (sessionId) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log('✅ Stripe session retrieved:', sessionId);
    return session;
  } catch (error) {
    console.error('❌ Stripe session retrieval error:', error);
    throw error;
  }
};

export default stripe;