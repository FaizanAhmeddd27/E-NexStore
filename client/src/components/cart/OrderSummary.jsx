import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, Tag, TrendingUp } from 'lucide-react'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { calculateTotals } from '../../redux/slices/cartSlice'

const OrderSummary = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { cartItems, subtotal, total, coupon } = useSelector((state) => state.cart)

  useEffect(() => {
    dispatch(calculateTotals())
  }, [cartItems, coupon, dispatch])

  const discount = coupon ? subtotal - total : 0
  const savings = discount

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="card sticky top-24"
    >
      <div className="flex items-center gap-2 mb-6">
        <ShoppingBag className="text-primary-500" size={24} />
        <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
      </div>

      <div className="space-y-4 mb-6">
        {/* Subtotal */}
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({cartItems.length} items)</span>
          <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span className="font-semibold text-green-600">FREE</span>
        </div>

        {/* Discount */}
        {coupon && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex justify-between text-green-600"
          >
            <div className="flex items-center gap-2">
              <Tag size={16} />
              <span>Discount ({coupon.discountPercentage}%)</span>
            </div>
            <span className="font-semibold">-${discount.toFixed(2)}</span>
          </motion.div>
        )}

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-primary-600">
              ${total.toFixed(2)}
            </span>
          </div>
          {savings > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg"
            >
              <TrendingUp size={16} />
              <span className="font-semibold">You save ${savings.toFixed(2)}</span>
            </motion.div>
          )}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/checkout')}
        disabled={cartItems.length === 0}
        className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Proceed to Checkout
      </motion.button>

      {/* Trust Badges */}
      <div className="mt-6 pt-6 border-t">
        <div className="grid grid-cols-3 gap-4 text-center">
          <TrustBadge icon="🔒" text="Secure Payment" />
          <TrustBadge icon="✓" text="Quality" />
          <TrustBadge icon="📦" text="Fast Ship" />
        </div>
      </div>
    </motion.div>
  )
}

const TrustBadge = ({ icon, text }) => (
  <div>
    <div className="text-2xl mb-1">{icon}</div>
    <p className="text-xs text-gray-600 font-medium">{text}</p>
  </div>
)

export default OrderSummary