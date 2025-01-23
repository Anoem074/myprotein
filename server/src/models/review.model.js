const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: String // Store user IDs or emails of users who liked this review
  }],
  helpfulCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for efficient sorting
reviewSchema.index({ productId: 1, createdAt: -1 });
reviewSchema.index({ productId: 1, likes: -1 });
reviewSchema.index({ productId: 1, rating: -1 });

module.exports = mongoose.model('Review', reviewSchema);
