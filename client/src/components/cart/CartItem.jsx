import { motion } from 'framer-motion'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { removeFromCart, updateQuantity } from '../../redux/thunks/cartThunks'

const CartItem = ({ item, index }) => {
  const dispatch = useDispatch()

  const handleUpdateQuantity = (newQuantity) => {
    if (newQuantity < 1) return
    if (newQuantity > item.product.stock) {
      return
    }
    dispatch(updateQuantity({ productId: item.product._id, quantity: newQuantity }))
  }

  const handleRemove = () => {
    dispatch(removeFromCart(item.product._id))
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ delay: index * 0.1 }}
      className="card flex flex-col sm:flex-row gap-4"
    >
      {/* Product Image */}
      <div className="w-full sm:w-32 h-32 flex-shrink-0">
        <img
          src={item.product.image.url}
          alt={item.product.name}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Product Info */}
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg text-gray-900">{item.product.name}</h3>
            <p className="text-sm text-gray-600 capitalize">{item.product.category}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleRemove}
            className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
          >
            <Trash2 size={20} />
          </motion.button>
        </div>

        <p className="text-2xl font-bold text-primary-600 mb-3">
          ${item.product.price.toFixed(2)}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border-2 border-gray-200 rounded-lg p-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleUpdateQuantity(item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus size={16} />
            </motion.button>

            <span className="w-12 text-center font-semibold">{item.quantity}</span>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleUpdateQuantity(item.quantity + 1)}
              disabled={item.quantity >= item.product.stock}
              className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={16} />
            </motion.button>
          </div>

          <span className="text-sm text-gray-500">
            {item.product.stock} available
          </span>
        </div>

        {/* Subtotal */}
        <div className="mt-3 pt-3 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Subtotal:</span>
            <span className="text-lg font-bold text-gray-900">
              ${(item.product.price * item.quantity).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default CartItem