const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');

// Default admin credentials
const DEFAULT_ADMIN = {
  email: 'admin@example.com',
  password: 'admin123',
};

// Initialize default admin account
const initializeAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({ email: DEFAULT_ADMIN.email });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
      await Admin.create({
        email: DEFAULT_ADMIN.email,
        password: hashedPassword,
      });
      console.log('Default admin account created');
    }
  } catch (error) {
    console.error('Error initializing admin account:', error);
  }
};

// Login admin
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  initializeAdmin,
  loginAdmin,
};
