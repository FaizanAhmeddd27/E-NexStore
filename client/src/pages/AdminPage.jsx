import { useState } from 'react'
import { motion } from 'framer-motion'
import { Package, BarChart3, Plus, List } from 'lucide-react'
import CreateProduct from '../components/admin/CreateProduct'
import ProductTable from '../components/admin/ProductTable'
import AnalyticsDashboard from '../components/admin/AnalyticsDashboard'

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('analytics')

  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
    { id: 'create', label: 'Create Product', icon: <Plus size={20} /> },
    { id: 'products', label: 'All Products', icon: <List size={20} /> },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center">
            <Package className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your store and view analytics</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-2 mb-8 overflow-x-auto pb-2"
      >
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-primary-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'analytics' && <AnalyticsDashboard />}
        {activeTab === 'create' && <CreateProduct />}
        {activeTab === 'products' && <ProductTable />}
      </motion.div>
    </motion.div>
  )
}

export default AdminPage