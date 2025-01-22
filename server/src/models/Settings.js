const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  contactEmail: {
    type: String,
    required: true,
    trim: true
  },
  theme: {
    primaryColor: {
      type: String,
      default: '#f97316'
    },
    secondaryColor: {
      type: String,
      default: '#000000'
    }
  },
  socialMedia: {
    facebook: {
      type: String,
      default: ''
    },
    twitter: {
      type: String,
      default: ''
    },
    instagram: {
      type: String,
      default: ''
    }
  },
  features: {
    enableBlog: {
      type: Boolean,
      default: true
    },
    enableNewsletter: {
      type: Boolean,
      default: true
    },
    enableReviews: {
      type: Boolean,
      default: true
    }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Settings', SettingsSchema);
