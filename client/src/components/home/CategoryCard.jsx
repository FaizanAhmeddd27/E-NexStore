import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const CategoryCard = ({ category, index }) => {
  const categoryImages = {
    jeans: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    't-shirts': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    shoes: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link to={`/category/${category.slug}`} className="group block">
        <motion.div
          whileHover={{ y: -8 }}
          className="card card-hover overflow-hidden"
        >
          <div className="aspect-square overflow-hidden rounded-lg mb-4 bg-gray-100">
            <motion.img
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.4 }}
              src={categoryImages[category.slug]}
              alt={category.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{category.name}</h3>
              <p className="text-sm text-gray-600">Explore collection</p>
            </div>
            <motion.div
              whileHover={{ x: 5 }}
              className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center"
            >
              <ArrowRight className="text-primary-600" size={20} />
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

export default CategoryCard