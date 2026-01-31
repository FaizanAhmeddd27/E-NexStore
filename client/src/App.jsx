import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AnimatePresence } from 'framer-motion'
import { getProfile } from './redux/thunks/authThunks'
import { getCartItems } from './redux/thunks/cartThunks'

// Layout Components
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import Loader from './components/common/Loader'
import ProtectedRoute from './components/common/ProtectedRoute'

// Pages
import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import PaymentSuccessPage from './pages/PaymentSuccessPage'
import PaymentFailedPage from './pages/PaymentFailedPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import AdminPage from './pages/AdminPage'
import OrdersPage from './pages/OrdersPage'
import OrderDetailsPage from './pages/OrderDetailsPage'

function App() {
  const dispatch = useDispatch()
  const location = useLocation()
  const { loading, isAuthenticated, user } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(getProfile())
  }, [dispatch])

  // Debug: use the axios instance (it computes a safe runtime baseURL)
  useEffect(() => {
    import('./api/axios').then(({ default: axiosInstance }) => {
      console.log('axios baseURL (runtime):', axiosInstance.defaults.baseURL);
      axiosInstance.get('/health')
        .then((res) => console.log('health response:', res.data))
        .catch((err) => console.error('health fetch failed:', err));
    }).catch((err) => console.error('Failed to load axios for health check:', err));
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCartItems())
    }
  }, [dispatch, isAuthenticated])

  if (loading) {
    return <Loader />
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/" /> : <LoginPage />
            } />
            <Route path="/signup" element={
              isAuthenticated ? <Navigate to="/" /> : <SignupPage />
            } />

            {/* Protected Routes */}
            <Route path="/cart" element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            } />
            <Route path="/checkout" element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            } />
            <Route path="/orders/:orderId" element={
              <ProtectedRoute>
                <OrderDetailsPage />
              </ProtectedRoute>
            } />
            <Route path="/payment-success" element={<PaymentSuccessPage />} />
            <Route path="/payment-failed" element={<PaymentFailedPage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute adminOnly>
                <AdminPage />
              </ProtectedRoute>
            } />

            {/* 404 */}
            <Route path="*" element={
              <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-8">Page not found</p>
                <a href="/" className="btn-primary">
                  Go Home
                </a>
              </div>
            } />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  )
}

export default App