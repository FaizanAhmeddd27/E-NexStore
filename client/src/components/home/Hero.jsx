import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingBag, TrendingUp, Shield, Truck, Award, Clock } from 'lucide-react'

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <div className="bg-gradient-to-br from-primary-50 via-white to-primary-50 py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
                🎉 New Arrivals Available
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight"
            >
              Shop The Best{' '}
              <span className="gradient-text">Fashion</span> Trends
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-gray-600 leading-relaxed"
            >
              Discover amazing products at unbeatable prices. Quality guaranteed, fast shipping, and excellent customer service.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/category/jeans" className="btn-primary text-lg px-8 py-4">
                  <ShoppingBag size={24} />
                  Shop Now
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/category/t-shirts" className="btn-secondary text-lg px-8 py-4">
                  Browse Categories
                </Link>
              </motion.div>
            </motion.div>

            {/* Features */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-3 gap-4 pt-8"
            >
              <FeatureCard
                icon={<Truck className="text-primary-600" size={24} />}
                title="Free Shipping"
                delay={0}
              />
              <FeatureCard
                icon={<Award className="text-primary-600" size={24} />}
                title="Best Quality"
                delay={0.1}
              />
              <FeatureCard
                icon={<Shield className="text-primary-600" size={24} />}
                title="Secure Payment"
                delay={0.2}
              />
            </motion.div>
          </motion.div>

          {/* Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative z-10"
            >
              <div className="aspect-square bg-gradient-to-br from-primary-200 to-primary-300 rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800"
                  alt="Shopping"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Floating Elements */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary-500 rounded-full opacity-20 blur-3xl"
            />

            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [90, 0, 90],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -top-6 -left-6 w-32 h-32 bg-primary-300 rounded-full opacity-20 blur-3xl"
            />
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-12 border-t border-gray-200"
        >
          <StatCard number="10K+" label="Happy Customers" />
          <StatCard number="500+" label="Products" />
          <StatCard number="50+" label="Categories" />
          <StatCard number="24/7" label="Support" />
        </motion.div>
      </div>
    </div>
  )
}

const FeatureCard = ({ icon, title, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="text-center"
  >
    <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
      {icon}
    </div>
    <p className="text-sm font-semibold text-gray-700">{title}</p>
  </motion.div>
)

const StatCard = ({ number, label }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="text-center"
  >
    <h3 className="text-3xl md:text-4xl font-bold gradient-text mb-2">{number}</h3>
    <p className="text-gray-600 font-medium">{label}</p>
  </motion.div>
)

export default Hero