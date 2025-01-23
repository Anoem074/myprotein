const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const Blog = require('../models/blog.model');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    console.log('Found blogs:', blogs.length);
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single blog
router.get('/:id', async (req, res) => {
  try {
    // Validate if the id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.error('Invalid blog ID:', req.params.id);
      return res.status(400).json({ message: 'Invalid blog ID format' });
    }

    const blog = await Blog.findById(req.params.id);
    console.log('Found blog:', blog ? blog._id : 'not found');
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create a new blog
router.post('/', auth, admin, upload.single('image'), async (req, res) => {
  try {
    console.log('Creating new blog with data:', req.body);
    
    if (!req.body.title || !req.body.content) {
      return res.status(400).json({ 
        message: 'Missing required fields. Title and content are required.' 
      });
    }

    const blog = new Blog({
      title: req.body.title,
      content: req.body.content,
      category: req.body.category || 'General',
      image: req.file ? `/uploads/${req.file.filename}` : null,
      excerpt: req.body.content.substring(0, 150) + '...'
    });

    const newBlog = await blog.save();
    console.log('Created new blog:', newBlog._id);
    res.status(201).json(newBlog);
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update a blog
router.put('/:id', auth, admin, upload.single('image'), async (req, res) => {
  try {
    console.log('Updating blog:', req.params.id, 'with data:', req.body);
    
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid blog ID format' });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;
    blog.category = req.body.category || blog.category;
    if (req.file) {
      blog.image = `/uploads/${req.file.filename}`;
    }
    blog.excerpt = (req.body.content || blog.content).substring(0, 150) + '...';

    const updatedBlog = await blog.save();
    console.log('Updated blog:', updatedBlog._id);
    res.json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(400).json({ message: error.message });
  }
});

// Like/Unlike a blog
router.post('/:id/like', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const userIp = req.ip;
    const hasLiked = blog.likes.users.includes(userIp);
    
    if (hasLiked) {
      // Unlike: Remove user and decrease count
      blog.likes.users = blog.likes.users.filter(ip => ip !== userIp);
      blog.likes.count = Math.max(0, blog.likes.count - 1);
    } else {
      // Like: Add user and increase count
      blog.likes.users.push(userIp);
      blog.likes.count += 1;
    }
    
    const updatedBlog = await blog.save();
    res.json({
      ...updatedBlog.toObject(),
      hasLiked: !hasLiked
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a blog
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    console.log('Deleting blog:', req.params.id);
    
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid blog ID format' });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    await blog.deleteOne();
    console.log('Deleted blog:', req.params.id);
    res.json({ message: 'Blog deleted' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
