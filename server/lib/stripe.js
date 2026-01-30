import dotenv from 'dotenv';
dotenv.config();

import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.basil',
  typescript: false,
});

export const createStripeCheckoutSession = async ({
  lineItems,
  userId,
  couponCode,
  products,
  successUrl,
  cancelUrl
}) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: userId.toString(),
        couponCode: couponCode || '',
        products: JSON.stringify(products)
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'IN', 'DE', 'FR']
      },
      billing_address_collection: 'required',
    });

    return session;
  } catch (error) {
    console.error('Stripe session creation error:', error);
    throw error;
  }
};

export const retrieveStripeSession = async (sessionId) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session;
  } catch (error) {
    console.error('Stripe session retrieval error:', error);
    throw error;
  }
};

export default stripe;