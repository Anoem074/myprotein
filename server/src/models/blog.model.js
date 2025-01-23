const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 200
  },
  subtitle: {
    type: String,
    trim: true,
    maxLength: 300
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    trim: true,
    maxLength: 500
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  author: {
    type: String,
    required: true,
    default: 'Admin'
  },
  readTime: {
    type: Number,
    default: 5
  },
  featured: {
    type: Boolean,
    default: false
  },
  likes: {
    count: {
      type: Number,
      default: 0,
    },
    users: [{
      type: String, // Store IP addresses
    }],
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
});

// Update the updatedAt timestamp before saving
blogSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
