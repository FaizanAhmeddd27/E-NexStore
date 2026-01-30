import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart, Star, Eye } from 'lucide-react'
import { addToCart } from '../../redux/thunks/cartThunks'

const ProductCard = ({ product, index = 0 }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.auth)

  const handleAddToCart = (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    dispatch(addToCart(product._id))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <motion.div
        whileHover={{ y: -8 }}
        className="card card-hover group cursor-pointer"
      >
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg mb-4 bg-gray-100">
          <motion.img
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4 }}
            src={product.image.url}
            alt={product.name}
            className="w-full h-full object-cover"
          />

          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {product.isFeatured && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="badge badge-primary flex items-center gap-1 shadow-lg"
              >
                <Star size={14} fill="currentColor" />
                Featured
              </motion.div>
            )}
            {product.stock === 0 && (
              <span className="badge badge-error shadow-lg">
                Out of Stock
              </span>
            )}
            {product.stock > 0 && product.stock < 10 && (
              <span className="badge badge-warning shadow-lg">
                Low Stock
              </span>
            )}
          </div>

          {/* Quick Actions - Show on Hover */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="p-3 bg-white rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={20} className="text-primary-600" />
            </motion.button>
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
              {product.name}
            </h3>
            <span className="badge badge-primary shrink-0">
              {product.category}
            </span>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center justify-between pt-2">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-primary-600">
                  ${product.price.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {product.stock > 0 ? (
                  <span className="text-green-600 font-medium">
                    {product.stock} in stock
                  </span>
                ) : (
                  <span className="text-red-600 font-medium">Out of stock</span>
                )}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn-primary btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={16} />
              Add
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ProductCard