import { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { ChevronRight, Home } from "lucide-react";

import { getProductsByCategory } from "../redux/thunks/productThunks";
import ProductList from "../components/products/ProductList";


const CATEGORY_META = {
  jeans: { name: "Jeans", description: "Discover our premium denim jeans in various styles and fits." },
  "t-shirts": { name: "T-Shirts", description: "Comfortable and stylish t-shirts for every occasion." },
  shoes: { name: "Shoes", description: "Step up your style with our curated shoe collection." },
  hoodies: { name: "Hoodies", description: "Cozy and trendy hoodies for everyday wear." },
  jackets: { name: "Jackets", description: "Stay warm and fashionable with our jacket selection." },
  shirts: { name: "Shirts", description: "Smart casual shirts for clean and classic looks." },
  pants: { name: "Pants", description: "Everyday pants and chinos built for comfort and style." },
  shorts: { name: "Shorts", description: "Lightweight shorts perfect for summer and casual outfits." },
  accessories: { name: "Accessories", description: "Complete your look with belts, sunglasses, scarves, and more." },
  bags: { name: "Bags", description: "Backpacks, crossbody bags, and essentials for daily carry." },
  caps: { name: "Caps", description: "Caps and hats to upgrade your streetwear style." },
  watches: { name: "Watches", description: "Minimal, sporty, and premium watches for every style." }
};
export default function CategoryPage() {
  const { category } = useParams();
  const normalizedCategory = category?.toLowerCase();

  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);

  const meta = useMemo(
    () => CATEGORY_META[normalizedCategory],
    [normalizedCategory]
  );

  const isValidCategory = Boolean(meta);

  useEffect(() => {
    if (!isValidCategory) return;
    dispatch(getProductsByCategory(normalizedCategory));
  }, [dispatch, normalizedCategory, isValidCategory]);

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
        <span className="text-gray-900 font-medium">
          {isValidCategory ? meta.name : "Products"}
        </span>
      </motion.nav>

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {isValidCategory ? meta.name : "Products"}
        </h1>

        <p className="text-xl text-gray-600 max-w-3xl">
          {isValidCategory
            ? meta.description
            : "Invalid category. Please choose a category from the home page."}
        </p>

        {/* Stats (only show if valid category) */}
        {isValidCategory && (
          <div className="flex items-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-primary-600">
                {products?.length || 0}
              </span>
              <span className="text-gray-600">Products</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Products Grid */}
      {isValidCategory ? (
        <ProductList products={products || []} loading={loading} />
      ) : (
        <div className="card text-center">
          <p className="text-gray-700 font-semibold mb-2">Category not found</p>
          <p className="text-gray-600 mb-4">Go back and select a valid category.</p>
          <Link to="/" className="btn-primary inline-flex">
            Back to Home
          </Link>
        </div>
      )}
    </motion.div>
  );
}