import { motion } from 'framer-motion'
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

const PaymentFailedPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white p-4">
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
          className="w-32 h-32 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
        >
          <XCircle className="text-white" size={80} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-5xl font-bold text-gray-900 mb-4"
        >
          Payment Failed
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-gray-600 mb-8"
        >
          We couldn't process your payment. Please try again or use a different payment method.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card mb-8 text-left bg-red-50 border border-red-200"
        >
          <h3 className="font-semibold text-red-800 mb-2">Possible reasons:</h3>
          <ul className="space-y-1 text-red-700">
            <li>• Insufficient funds</li>
            <li>• Incorrect card details</li>
            <li>• Payment declined by your bank</li>
            <li>• Network connection issue</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => navigate('/checkout')}
            className="btn-primary text-lg px-8 py-4"
          >
            <RefreshCw size={20} />
            Try Again
          </button>
          <Link to="/cart" className="btn-secondary text-lg px-8 py-4">
            <ArrowLeft size={20} />
            Back to Cart
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default PaymentFailedPage