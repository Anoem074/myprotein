const Admin = require('../models/admin.model');

const admin = async (req, res, next) => {
  try {
    // Check if user exists in request
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check if user has admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    // Verify admin exists in database
    const adminUser = await Admin.findById(req.user.id);
    if (!adminUser) {
      return res.status(403).json({
        success: false,
        message: 'Admin account not found'
      });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = admin;
