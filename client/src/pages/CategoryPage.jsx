import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { getProductsByCategory } from '../redux/thunks/productThunks'
import ProductList from '../components/products/ProductList'
import { ChevronRight, Home } from 'lucide-react'

const CategoryPage = () => {
  const { category } = useParams()
  const dispatch = useDispatch()
  const { products, loading } = useSelector((state) => state.products)

  useEffect(() => {
    dispatch(getProductsByCategory(category))
  }, [dispatch, category])

  const categoryNames = {
    'jeans': 'Jeans',
    't-shirts': 'T-Shirts',
    'shoes': 'Shoes',
    'jackets': 'Jackets',
    'bags': 'Bags',
    'accessories': 'Accessories'
  }

  const categoryDescriptions = {
    'jeans': 'Discover our premium collection of denim jeans in various styles and fits',
    't-shirts': 'Comfortable and stylish t-shirts for every occasion',
    'shoes': 'Step up your style with our curated shoe collection',
    'jackets': 'Stay warm and fashionable with our jacket selection',
    'bags': 'Carry your essentials in style with our bags',
    'accessories': 'Complete your look with our accessories'
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      {/* Breadcrumb */}
      <motion.nav
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 text-sm text-gray-600 mb-8"
      >
        <Link to="/" className="flex items-center gap-1 hover:text-primary-500 transition-colors">
          <Home size={16} />
          Home
        </Link>
        <ChevronRight size={16} />
        <span className="text-gray-900 font-medium">{categoryNames[category]}</span>
      </motion.nav>

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {categoryNames[category] || 'Products'}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          {categoryDescriptions[category]}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-6 mt-6">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-primary-600">{products.length}</span>
            <span className="text-gray-600">Products</span>
          </div>
        </div>
      </motion.div>

      {/* Products Grid */}
      <ProductList products={products} loading={loading} />
    </motion.div>
  )
}

export default CategoryPage