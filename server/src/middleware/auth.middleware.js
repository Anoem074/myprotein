const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Verify JWT token
exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        
        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token or user is inactive.'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Check if user is admin
exports.isAdmin = async (req, res, next) => {
    try {
        if (!req.user || !['admin', 'super-admin'].includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error checking admin privileges.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Check if user is super admin
exports.isSuperAdmin = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== 'super-admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Super Admin privileges required.'
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error checking super admin privileges.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
