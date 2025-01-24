const express = require('express');
const router = express.Router();
const { loginAdmin, getAdminProfile } = require('../controllers/admin.controller');
const User = require('../models/user.model');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const bcrypt = require('bcryptjs');

// Admin authentication routes
router.post('/login', loginAdmin);
router.get('/profile', auth, admin, getAdminProfile);

// Get all users (admin only)
router.get('/users', auth, admin, async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Create new user (admin only)
router.post('/users', auth, admin, async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, permissions } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    const user = new User({
      email,
      password,
      firstName,
      lastName,
      role,
      permissions
    });

    await user.save();
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: { ...user.toObject(), password: undefined }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update user (admin only)
router.put('/users/:id', auth, admin, async (req, res) => {
  try {
    const { email, firstName, lastName, role, permissions, isActive } = req.body;
    const updates = { email, firstName, lastName, role, permissions, isActive };
    
    // If password is provided, hash it
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(req.body.password, salt);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Delete user (admin only)
router.delete('/users/:id', auth, admin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get user permissions
router.get('/permissions', auth, admin, (req, res) => {
  const permissions = [
    {
      id: 'manage_users',
      name: 'Manage Users',
      description: 'Can create, edit, and delete user accounts'
    },
    {
      id: 'manage_products',
      name: 'Manage Products',
      description: 'Can manage product catalog'
    },
    {
      id: 'manage_orders',
      name: 'Manage Orders',
      description: 'Can view and manage orders'
    },
    {
      id: 'manage_content',
      name: 'Manage Content',
      description: 'Can manage blog posts and site content'
    }
  ];

  res.json({
    success: true,
    permissions
  });
});

module.exports = router;
