import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Confetti from 'react-confetti'
import { CheckCircle, Package, Home } from 'lucide-react'
import axios from '../api/axios'
import { useDispatch } from 'react-redux'
import { clearCart } from '../redux/thunks/cartThunks'

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const dispatch = useDispatch()
  const [orderDetails, setOrderDetails] = useState(null)
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleCheckoutSuccess = async () => {
      try {
        const { data } = await axios.post('/payment/checkout-success', { sessionId })
        setOrderDetails(data)
        // Clear client-side cart immediately so UI reflects purchase even if server-side clearCart fails
        dispatch(clearLocalCart())
        // Also attempt to clear server-side cart for logged-in users
        try { await dispatch(clearCart()).unwrap(); } catch (err) { console.warn('Server-side clearCart failed:', err) }
      } catch (error) {
        console.error('Error processing payment:', error)
      }
    }

    if (sessionId) {
      handleCheckoutSuccess()
    }
  }, [sessionId, dispatch])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white p-4">
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
        numberOfPieces={500}
        gravity={0.2}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
        >
          <CheckCircle className="text-white" size={80} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-5xl font-bold text-gray-900 mb-4"
        >
          Payment Successful! 🎉
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-gray-600 mb-8"
        >
          Thank you for your purchase! Your order has been confirmed.
        </motion.p>

        {orderDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card mb-8 text-left"
          >
            <div className="flex items-center gap-2 mb-4">
              <Package className="text-primary-500" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-semibold text-gray-900">{orderDetails.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="badge badge-success">Confirmed</span>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/" className="btn-primary text-lg px-8 py-4">
            <Home size={20} />
            Back to Home
          </Link>
          <Link to="/category/jeans" className="btn-secondary text-lg px-8 py-4">
            Continue Shopping
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default PaymentSuccessPage