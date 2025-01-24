const express = require('express');
const router = express.Router();
const Review = require('../models/review.model');

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const { sort = 'newest', page = 1, limit = 3 } = req.query;
    const skip = (page - 1) * limit;

    let sortQuery = {};
    switch (sort) {
      case 'newest':
        sortQuery = { createdAt: -1 };
        break;
      case 'oldest':
        sortQuery = { createdAt: 1 };
        break;
      case 'highest':
        sortQuery = { rating: -1 };
        break;
      case 'lowest':
        sortQuery = { rating: 1 };
        break;
      case 'mostLiked':
        sortQuery = { likes: -1 };
        break;
      default:
        sortQuery = { createdAt: -1 };
    }

    const [reviews, total] = await Promise.all([
      Review.find({ productId: req.params.productId })
        .sort(sortQuery)
        .skip(skip)
        .limit(parseInt(limit)),
      Review.countDocuments({ productId: req.params.productId })
    ]);

    res.json({
      reviews,
      total,
      hasMore: total > skip + reviews.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Check if IP has already reviewed
router.get('/check-ip/:productId', async (req, res) => {
  try {
    const ip = req.ip || req.connection.remoteAddress;
    const review = await Review.findOne({
      productId: req.params.productId,
      ipAddress: ip
    });
    res.json({ hasReviewed: !!review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a review
router.post('/add', async (req, res) => {
  try {
    const ip = req.ip || req.connection.remoteAddress;
    
    // Check if IP has already reviewed this product
    const existingReview = await Review.findOne({
      productId: req.body.productId,
      ipAddress: ip
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = new Review({
      productId: req.body.productId,
      userName: req.body.userName,
      rating: req.body.rating,
      comment: req.body.comment,
      ipAddress: ip
    });
    const newReview = await review.save();
    res.status(201).json(newReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Like a review
router.post('/:id/like', async (req, res) => {
  try {
    const { userId } = req.body;
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.likedBy.includes(userId)) {
      review.likes -= 1;
      review.likedBy = review.likedBy.filter(id => id !== userId);
    } else {
      review.likes += 1;
      review.likedBy.push(userId);
    }

    await review.save();
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
