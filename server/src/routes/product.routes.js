const express = require('express');
const router = express.Router();
const Product = require('../models/product.model');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Serve static files from uploads directory
router.use('/uploads', express.static('uploads'));

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .select('name description price image category isFeatured affiliateLinks');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get featured products
router.get('/featured', async (req, res) => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true })
      .sort({ createdAt: -1 })
      .select('name description price image category affiliateLinks');
    res.json(featuredProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .select('name description price image category isFeatured affiliateLinks');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get related products
router.get('/related/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category
    })
    .limit(4)
    .select('name price image category affiliateLinks');

    res.json(relatedProducts);
  } catch (error) {
    console.error('Error getting related products:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create a new product
router.post('/', auth, admin, upload.single('image'), async (req, res) => {
  try {
    let affiliateLinks = [];
    if (req.body.affiliateLinks) {
      try {
        affiliateLinks = JSON.parse(req.body.affiliateLinks);
      } catch (error) {
        console.error('Error parsing affiliate links:', error);
      }
    }

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      isFeatured: req.body.isFeatured === 'true',
      image: req.file ? `/uploads/${req.file.filename}` : null,
      affiliateLinks
    });

    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update a product
router.put('/:id', auth, admin, upload.single('image'), async (req, res) => {
  try {
    let affiliateLinks = [];
    if (req.body.affiliateLinks) {
      try {
        affiliateLinks = JSON.parse(req.body.affiliateLinks);
      } catch (error) {
        console.error('Error parsing affiliate links:', error);
      }
    }

    const updates = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      isFeatured: req.body.isFeatured === 'true',
      affiliateLinks
    };

    if (req.file) {
      updates.image = `/uploads/${req.file.filename}`;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete a product
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete product image if it exists
    if (product.image) {
      const imagePath = path.join(__dirname, '../../', product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await product.remove();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: error.message });
  }
});

// Toggle featured status
router.patch('/:id/featured', auth, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.isFeatured = !product.isFeatured;
    await product.save();

    res.json({ message: 'Featured status updated successfully', isFeatured: product.isFeatured });
  } catch (error) {
    console.error('Error toggling featured status:', error);
    res.status(500).json({ message: error.message });
  }
});

// Like a product
router.post('/:id/like', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    product.likes = (product.likes || 0) + 1;
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add review to product
router.post('/:id/reviews', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = {
      userName: req.body.userName,
      rating: req.body.rating,
      comment: req.body.comment,
      createdAt: new Date()
    };

    if (!product.reviews) {
      product.reviews = [];
    }

    product.reviews.push(review);
    product.rating = product.reviews.reduce((acc, curr) => acc + curr.rating, 0) / product.reviews.length;
    product.numReviews = product.reviews.length;
    
    await product.save();
    res.status(201).json(review);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get product reviews
router.get('/:id/reviews', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product.reviews || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
