const express = require('express');
const router = express.Router();
const PageView = require('../models/pageView.model');
const Product = require('../models/product.model');
const auth = require('../middleware/auth');

// Record page view
router.post('/pageview', async (req, res) => {
  try {
    const pageView = new PageView({
      path: req.body.path,
      userAgent: req.headers['user-agent'],
      ip: req.ip
    });
    await pageView.save();
    res.status(201).json({ message: 'Page view recorded' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get page view statistics
router.get('/stats', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [totalViews, todayViews, pathStats] = await Promise.all([
      PageView.countDocuments(),
      PageView.countDocuments({ timestamp: { $gte: today } }),
      PageView.aggregate([
        {
          $group: {
            _id: '$path',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])
    ]);

    res.json({
      totalViews,
      todayViews,
      pathStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get product statistics
router.get('/product-stats', async (req, res) => {
  try {
    const [totalProducts, featuredProducts, categories] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ isFeatured: true }),
      Product.distinct('category')
    ]);

    res.json({
      totalProducts,
      featuredProducts,
      totalCategories: categories.length,
      categories
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
