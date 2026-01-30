import { useState } from 'react'
import { motion } from 'framer-motion'
import { Tag, X, Check } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { validateCoupon } from '../../redux/thunks/cartThunks'
import { removeCoupon } from '../../redux/slices/cartSlice'

const CouponInput = () => {
  const dispatch = useDispatch()
  const { coupon } = useSelector((state) => state.cart)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)

  const handleApplyCoupon = async () => {
    if (!code.trim()) return
    setLoading(true)
    await dispatch(validateCoupon(code))
    setLoading(false)
    setCode('')
  }

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon())
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex items-center gap-2 mb-4">
        <Tag className="text-primary-500" size={20} />
        <h3 className="font-semibold text-gray-900">Have a Coupon?</h3>
      </div>

      {coupon ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-between p-4 bg-green-50 border-2 border-green-200 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="text-white" size={20} />
            </div>
            <div>
              <p className="font-semibold text-green-800">{coupon.code}</p>
              <p className="text-sm text-green-600">
                {coupon.discountPercentage}% discount applied
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleRemoveCoupon}
            className="p-2 hover:bg-green-100 rounded-lg text-green-600"
          >
            <X size={20} />
          </motion.button>
        </motion.div>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
            placeholder="Enter coupon code"
            className="input-field flex-grow"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleApplyCoupon}
            disabled={!code.trim() || loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? (
              <div className="spinner spinner-sm"></div>
            ) : (
              'Apply'
            )}
          </motion.button>
        </div>
      )}

      {/* Sample Coupons */}
      <div className="mt-4 pt-4 border-t">
        <p className="text-sm text-gray-600 mb-2">Try these codes:</p>
        <div className="flex flex-wrap gap-2">
          <SampleCoupon code="SAVE10" onClick={() => setCode('SAVE10')} />
          <SampleCoupon code="WELCOME20" onClick={() => setCode('WELCOME20')} />
        </div>
      </div>
    </motion.div>
  )
}

const SampleCoupon = ({ code, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold hover:bg-primary-200 transition-colors"
  >
    {code}
  </motion.button>
)

export default CouponInput