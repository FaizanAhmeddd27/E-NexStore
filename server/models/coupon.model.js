import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  discountPercentage: {
    type: Number,
    required: [true, 'Discount percentage is required'],
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  },
  expirationDate: {
    type: Date,
    required: [true, 'Expiration date is required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  usedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  maxUses: {
    type: Number,
    default: null // null means unlimited
  },
  currentUses: {
    type: Number,
    default: 0
  }
}, { 
  timestamps: true 
});

// Check if coupon is valid
couponSchema.methods.isValid = function() {
  const now = new Date();
  const isNotExpired = this.expirationDate > now;
  const isActive = this.isActive;
  const hasUsesLeft = this.maxUses ? this.currentUses < this.maxUses : true;
  
  return isNotExpired && isActive && hasUsesLeft;
};

export default mongoose.model('Coupon', couponSchema);