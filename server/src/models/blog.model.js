const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  excerpt: {
    type: String,
    required: false,
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
}, {
  timestamps: true,
});

module.exports = mongoose.model('Blog', blogSchema);
