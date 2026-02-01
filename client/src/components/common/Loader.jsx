import { motion } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'

const Loader = ({ message = 'Loading...', showRetry = false, onRetry }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
          className="w-16 h-16 mx-auto mb-4"
        >
          <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
            <ShoppingCart className="text-white" size={32} />
          </div>
        </motion.div>
        
        <motion.div
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <p className="text-gray-600 font-medium text-lg">{message}</p>
          {showRetry && (
            <div className="mt-4">
              <button onClick={onRetry} className="btn-primary">Retry</button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Loader