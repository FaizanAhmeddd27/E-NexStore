import { motion } from 'framer-motion'
import Hero from '../components/home/Hero'
import CategoryCard from '../components/home/CategoryCard'
import FeaturedProducts from '../components/home/FeaturedProducts'

const categories = [
  { name: "Jeans", slug: "jeans" },
  { name: "T-Shirts", slug: "t-shirts" },
  { name: "Shoes", slug: "shoes" },
  { name: "Hoodies", slug: "hoodies" },
  { name: "Jackets", slug: "jackets" },
  { name: "Shirts", slug: "shirts" },
  { name: "Pants", slug: "pants" },
  { name: "Shorts", slug: "shorts" },
  { name: "Accessories", slug: "accessories" },
  { name: "Bags", slug: "bags" },
  { name: "Caps", slug: "caps" },
  { name: "Watches", slug: "watches" },
];

const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="page-transition"
    >
      <Hero />
      
      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title">
              Shop by <span className="gradient-text">Category</span>
            </h2>
            <p className="section-subtitle mx-auto">
              Browse our extensive collection organized by category
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <CategoryCard key={category.slug} category={category} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <FeaturedProducts />
    </motion.div>
  )
}

export default HomePage