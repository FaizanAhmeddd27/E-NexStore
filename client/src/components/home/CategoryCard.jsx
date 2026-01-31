import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const categoryImages = {
  jeans: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80",
  "t-shirts": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
  shoes: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80",
  hoodies: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80",
  jackets: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80",

  
shirts: "https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?auto=compress&cs=tinysrgb&w=900",

  pants: "https://plus.unsplash.com/premium_photo-1663011451946-6b8d681b4737?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHBhbnRzfGVufDB8fDB8fHww",
  shorts: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvcnRzfGVufDB8fDB8fHww",  
  accessories: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80",
  bags: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",

  
  caps: "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=80",

  watches: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
};

export default function CategoryCard({ category, index = 0 }) {
  const img =
    categoryImages[category.slug] ||
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80";

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
    >
      <Link to={`/category/${category.slug}`} className="group block">
        <motion.div whileHover={{ y: -8 }} className="card card-hover overflow-hidden">
          <div className="aspect-square overflow-hidden rounded-lg mb-4 bg-gray-100">
            <motion.img
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.35 }}
              src={img}
              alt={category.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{category.name}</h3>
              <p className="text-sm text-gray-600">Explore collection</p>
            </div>

            <motion.div
              whileHover={{ x: 6 }}
              className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center"
            >
              <ArrowRight className="text-primary-600" size={20} />
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}