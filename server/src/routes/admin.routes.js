const express = require('express');
const router = express.Router();
const { loginAdmin } = require('../controllers/admin.controller');
const User = require('../models/user.model');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const bcrypt = require('bcryptjs');

// Admin authentication routes
router.post('/login', loginAdmin);

// Get all users (admin only)
router.get('/users', auth, admin, async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Create new user (admin only)
router.post('/users', auth, admin, async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, permissions } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
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
    res.status(201).json({ message: 'User created successfully', user: { ...user.toObject(), password: undefined } });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
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
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

// Delete user (admin only)
router.delete('/users/:id', auth, admin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
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
      description: 'Can view and manage customer orders'
    },
    {
      id: 'manage_blogs',
      name: 'Manage Blogs',
      description: 'Can create and edit blog posts'
    },
    {
      id: 'view_analytics',
      name: 'View Analytics',
      description: 'Can view site analytics and reports'
    },
    {
      id: 'manage_settings',
      name: 'Manage Settings',
      description: 'Can modify site settings'
    }
  ];
  
  res.json(permissions);
});

module.exports = router;
