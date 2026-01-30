import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { getRecommendedProducts } from '../../redux/thunks/productThunks'
import ProductCard from '../products/ProductCard'
import { Sparkles } from 'lucide-react'

const RecommendedProducts = () => {
  const dispatch = useDispatch()
  const { recommendedProducts } = useSelector((state) => state.products)

  useEffect(() => {
    dispatch(getRecommendedProducts())
  }, [dispatch])

  if (recommendedProducts.length === 0) {
    return null
  }

  return (
    <section className="py-12 mt-12 border-t">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="text-primary-500" size={24} />
          <h2 className="text-2xl font-bold text-gray-900">People Also Bought</h2>
        </div>
        <p className="text-gray-600">Complete your purchase with these items</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendedProducts.map((product, index) => (
          <ProductCard key={product._id} product={product} index={index} />
        ))}
      </div>
    </section>
  )
}

export default RecommendedProducts