import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { getFeaturedProducts } from '../../redux/thunks/productThunks'
import ProductCard from '../products/ProductCard'
import { Star } from 'lucide-react'

const FeaturedProducts = () => {
  const dispatch = useDispatch()
  const { featuredProducts, loading } = useSelector((state) => state.products)

  useEffect(() => {
    dispatch(getFeaturedProducts())
  }, [dispatch])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="spinner"></div>
      </div>
    )
  }

  if (featuredProducts.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full mb-4"
          >
            <Star size={20} fill="currentColor" />
            <span className="font-semibold">Featured Collection</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Hand-Picked <span className="gradient-text">Just For You</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Check out our carefully selected products that are trending right now
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="product-grid">
          {featuredProducts.map((product, index) => (
            <ProductCard key={product._id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts