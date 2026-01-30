import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Package } from 'lucide-react';
import CheckoutForm from '../components/payment/CheckoutForm';
import { calculateTotals } from '../redux/slices/cartSlice';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems, total, subtotal, coupon } = useSelector((state) => state.cart);

  useEffect(() => {
    if (cartItems.length === 0) navigate('/cart');
  }, [cartItems, navigate]);

  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems, coupon, dispatch]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
        <p className="text-gray-600">Complete your purchase securely</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary (Left) */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="card">
            <div className="flex items-center gap-2 mb-6">
              <Package className="text-primary-500" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            </div>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.product._id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={item.product.image.url}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-lg font-bold text-primary-600 mt-1">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>

              {coupon && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({coupon.discountPercentage}%)</span>
                  <span className="font-semibold">-${(subtotal - total).toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-semibold text-green-600">FREE</span>
              </div>

              <div className="flex justify-between pt-3 border-t">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-primary-600">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Payment Form (Right) */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CheckoutPage;