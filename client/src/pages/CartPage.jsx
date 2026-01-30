import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { getCartItems } from '../redux/thunks/cartThunks'
import { calculateTotals } from '../redux/slices/cartSlice'
import CartItem from '../components/cart/CartItem'
import OrderSummary from '../components/cart/OrderSummary'
import CouponInput from '../components/cart/CouponInput'
import RecommendedProducts from '../components/cart/RecommendedProducts'
import { ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'

const CartPage = () => {
  const dispatch = useDispatch()
  const { cartItems, loading, coupon } = useSelector((state) => state.cart)

  useEffect(() => {
    dispatch(getCartItems())
  }, [dispatch])

  useEffect(() => {
    dispatch(calculateTotals())
  }, [cartItems, coupon, dispatch])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-20"
      >
        <div className="text-center max-w-md mx-auto">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <ShoppingCart size={64} className="text-gray-400" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link to="/" className="btn-primary inline-flex">
            Start Shopping
          </Link>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
        <p className="text-gray-600">
          {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Coupon Input */}
          <CouponInput />

          {/* Cart Items List */}
          <AnimatePresence>
            {cartItems.map((item, index) => (
              <CartItem key={item.product._id} item={item} index={index} />
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div>
          <OrderSummary />
        </div>
      </div>

      {/* Recommended Products */}
      <RecommendedProducts />
    </motion.div>
  )
}

export default CartPage