import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Lock, CreditCard } from 'lucide-react';
import axios from '../../api/axios';
import { calculateTotals } from '../../redux/slices/cartSlice';

const CheckoutForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems, total, subtotal, coupon } = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems, coupon, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare products data
      const products = cartItems.map(item => ({
        _id: item.product._id,
        name: item.product.name,
        description: item.product.description,
        price: item.product.price,
        quantity: item.quantity,
        image: { url: item.product.image.url }
      }));

      // Create Stripe Checkout session via backend
      const { data } = await axios.post('/payment/create-checkout-session', {
        products,
        couponCode: coupon?.code || ''
      });

      if (!data.url) {
        throw new Error('No checkout URL returned from server.');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;

    } catch (err) {
      console.error('Payment error:', err);
      setError(err.response?.data?.message || err.message || 'Payment failed');
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex items-center gap-2 mb-6">
        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
          <Lock className="text-primary-600" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Secure Checkout</h2>
          <p className="text-sm text-gray-600">Your payment information is encrypted</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card Info */}
        <div className="p-4 border-2 border-gray-200 rounded-lg flex items-center gap-2">
          <CreditCard size={20} />
          <span className="text-gray-600">Card details will be collected on Stripe&apos;s secure page</span>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
          >
            {error}
          </motion.div>
        )}

        {/* Order Summary */}
        <div className="p-4 bg-gray-50 rounded-lg space-y-2">
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
          <div className="border-t pt-2 flex justify-between">
            <span className="text-lg font-bold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-primary-600">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2"
        >
          {loading ? 'Processing...' : <><Lock size={20}/> Pay ${total.toFixed(2)}</>}
        </motion.button>

        {/* Security Badges */}
        <div className="flex items-center justify-center gap-4 pt-4 border-t">
          <SecurityBadge text="SSL Encrypted" />
          <SecurityBadge text="Stripe Secured" />
          <SecurityBadge text="Money Back" />
        </div>
      </form>
    </motion.div>
  );
};

const SecurityBadge = ({ text }) => (
  <div className="flex items-center gap-1 text-xs text-gray-600">
    <Lock size={12} className="text-green-600" />
    <span>{text}</span>
  </div>
);

export default CheckoutForm;