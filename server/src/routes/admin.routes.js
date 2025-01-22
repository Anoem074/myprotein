const express = require('express');
const router = express.Router();
const { loginAdmin } = require('../controllers/admin.controller');

// Admin authentication routes
router.post('/login', loginAdmin);

module.exports = router;
