import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { getAnalytics } from '../../redux/thunks/analyticsThunks'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { Users, Package, DollarSign, ShoppingCart, TrendingUp, Award } from 'lucide-react'

const COLORS = ['#f97316', '#fb923c', '#fdba74', '#fed7aa']

const AnalyticsDashboard = () => {
  const dispatch = useDispatch()
  const { data, loading } = useSelector((state) => state.analytics)

  useEffect(() => {
    dispatch(getAnalytics())
  }, [dispatch])

  if (loading || !data) {
    return (
      <div className="flex justify-center py-20">
        <div className="spinner"></div>
      </div>
    )
  }

  const stats = [
    {
      icon: <Users size={32} />,
      label: 'Total Users',
      value: data.users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-100'
    },
    {
      icon: <Package size={32} />,
      label: 'Total Products',
      value: data.products,
      color: 'bg-green-500',
      bgColor: 'bg-green-100'
    },
    {
      icon: <DollarSign size={32} />,
      label: 'Total Sales',
      value: `$${data.totalSales.toFixed(2)}`,
      color: 'bg-primary-500',
      bgColor: 'bg-primary-100'
    },
    {
      icon: <ShoppingCart size={32} />,
      label: 'Total Orders',
      value: data.totalOrders,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-100'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} ${stat.color} p-4 rounded-xl text-white`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Sales Chart */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="text-primary-500" />
            Daily Sales (Last 7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.dailySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis
                dataKey="_id"
                stroke="#737373"
                tick={{ fontSize: 12 }}
              />
              <YAxis stroke="#737373" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ fill: '#f97316', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Sales by Category */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Package className="text-primary-500" />
            Sales by Category
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.salesByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ _id, percent }) => `${_id}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="totalSales"
              >
                {data.salesByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `$${value.toFixed(2)}`}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Top Products */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Award className="text-primary-500" />
          Top Selling Products
        </h3>

        <div className="space-y-4">
          {data.topProducts.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-primary-600">#{index + 1}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{item.productInfo.name}</p>
                  <p className="text-sm text-gray-600">
                    {item.totalSold} sold • ${item.revenue.toFixed(2)} revenue
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary-600 text-lg">
                  ${item.productInfo.price.toFixed(2)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default AnalyticsDashboard