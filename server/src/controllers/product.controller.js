const Product = require('../models/product.model');

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get featured products
exports.getFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true })
      .select('name description price image category affiliateLinks')
      .sort('-createdAt')
      .limit(6);
    res.json(featuredProducts);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, isFeatured } = req.body;
    let affiliateLinks = [];

    // Parse affiliate links if provided
    if (req.body.affiliateLinks) {
      try {
        affiliateLinks = JSON.parse(req.body.affiliateLinks);
      } catch (error) {
        console.error('Error parsing affiliate links:', error);
      }
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      isFeatured: isFeatured === 'true',
      image: req.file ? `/uploads/${req.file.filename}` : null,
      affiliateLinks
    });

    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, isFeatured } = req.body;
    let affiliateLinks = [];

    // Parse affiliate links if provided
    if (req.body.affiliateLinks) {
      try {
        affiliateLinks = JSON.parse(req.body.affiliateLinks);
      } catch (error) {
        console.error('Error parsing affiliate links:', error);
      }
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.isFeatured = isFeatured === 'true';
    product.affiliateLinks = affiliateLinks;

    if (req.file) {
      product.image = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.remove();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: error.message });
  }
};
