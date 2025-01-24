const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: {
    type: String,
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
  ipAddress: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: String
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

// Add indexes for efficient querying
reviewSchema.index({ productId: 1, createdAt: -1 });
reviewSchema.index({ productId: 1, likes: -1 });
reviewSchema.index({ productId: 1, rating: -1 });
reviewSchema.index({ productId: 1, ipAddress: 1 });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
