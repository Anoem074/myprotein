const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');

// Get settings
router.get('/', auth, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        siteName: 'My E-commerce Site',
        description: 'Welcome to our online store',
        contactEmail: 'contact@example.com',
        theme: {
          primaryColor: '#f97316',
          secondaryColor: '#000000'
        },
        socialMedia: {
          facebook: '',
          twitter: '',
          instagram: ''
        },
        features: {
          enableBlog: true,
          enableNewsletter: true,
          enableReviews: true
        }
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update settings
router.put('/', auth, async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      return res.status(404).json({ message: 'Settings not found' });
    }

    const updatedSettings = await Settings.findOneAndUpdate(
      {},
      { $set: req.body },
      { new: true }
    );

    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
