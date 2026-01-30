import { motion } from 'framer-motion'
import ProductCard from './ProductCard'
import { Package } from 'lucide-react'

const ProductList = ({ products, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="spinner"></div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package size={48} className="text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">No Products Found</h3>
        <p className="text-gray-600">Try browsing other categories</p>
      </motion.div>
    )
  }

  return (
    <div className="product-grid">
      {products.map((product, index) => (
        <ProductCard key={product._id} product={product} index={index} />
      ))}
    </div>
  )
}

export default ProductList