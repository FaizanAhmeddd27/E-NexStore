import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, LogOut, LayoutDashboard, User, Home, Menu, X } from 'lucide-react'
import { logout } from '../../redux/thunks/authThunks'
import { useState, useEffect } from 'react'
import { calculateTotals } from '../../redux/slices/cartSlice'

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const { cartItems } = useSelector((state) => state.cart)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  useEffect(() => {
    dispatch(calculateTotals())
  }, [cartItems, dispatch])

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white shadow-md'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-lg"
            >
              <ShoppingCart className="text-white" size={24} />
            </motion.div>
            <span className="text-2xl font-bold gradient-text">ShopHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" icon={<Home size={20} />} text="Home" />
            
            {isAuthenticated && (
              <>
                <NavLink to="/cart" icon={<ShoppingCart size={20} />} text="Cart" badge={cartCount} />
                
                {user?.role === 'admin' && (
                  <NavLink to="/admin" icon={<LayoutDashboard size={20} />} text="Dashboard" />
                )}
              </>
            )}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg"
                >
                  <User size={18} className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <LogOut size={18} />
                  <span className="font-medium">Logout</span>
                </motion.button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-primary-500 font-medium hover:text-primary-600 transition-colors"
                >
                  Login
                </Link>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/signup"
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors inline-block"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t overflow-hidden"
            >
              <div className="py-4 space-y-2">
                <MobileNavLink to="/" icon={<Home size={20} />} text="Home" onClick={() => setMobileMenuOpen(false)} />
                
                {isAuthenticated ? (
                  <>
                    <MobileNavLink to="/cart" icon={<ShoppingCart size={20} />} text="Cart" badge={cartCount} onClick={() => setMobileMenuOpen(false)} />
                    
                    {user?.role === 'admin' && (
                      <MobileNavLink to="/admin" icon={<LayoutDashboard size={20} />} text="Dashboard" onClick={() => setMobileMenuOpen(false)} />
                    )}
                    
                    <div className="px-4 py-2">
                      <div className="flex items-center space-x-2 mb-2 text-gray-600">
                        <User size={18} />
                        <span className="text-sm font-medium">{user?.name}</span>
                      </div>
                      <button
                        onClick={() => {
                          handleLogout()
                          setMobileMenuOpen(false)
                        }}
                        className="w-full btn-primary"
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="px-4 py-2 space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-center px-4 py-2 border-2 border-primary-500 text-primary-500 rounded-lg font-medium"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-center px-4 py-2 bg-primary-500 text-white rounded-lg font-medium"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

const NavLink = ({ to, icon, text, badge }) => (
  <Link to={to} className="relative flex items-center space-x-1 text-gray-700 hover:text-primary-500 transition-colors group">
    {icon}
    <span className="font-medium">{text}</span>
    {badge > 0 && (
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
      >
        {badge}
      </motion.span>
    )}
    <motion.div
      className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"
    />
  </Link>
)

const MobileNavLink = ({ to, icon, text, badge, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors"
  >
    <div className="flex items-center space-x-3">
      {icon}
      <span className="font-medium">{text}</span>
    </div>
    {badge > 0 && (
      <span className="bg-primary-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
        {badge}
      </span>
    )}
  </Link>
)

export default Navbar