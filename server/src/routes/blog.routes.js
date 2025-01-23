const express = require('express');
const router = express.Router();
const Blog = require('../models/blog.model');
const auth = require('../middleware/auth');

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single blog
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new blog
router.post('/', auth, async (req, res) => {
  const blog = new Blog({
    title: req.body.title,
    content: req.body.content,
    image: req.body.image,
    excerpt: req.body.content.substring(0, 150) + '...',
  });

  try {
    const newBlog = await blog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a blog
router.put('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (req.body.title) blog.title = req.body.title;
    if (req.body.content) {
      blog.content = req.body.content;
      blog.excerpt = req.body.content.substring(0, 150) + '...';
    }
    if (req.body.image) blog.image = req.body.image;

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Like/Unlike a blog
router.post('/:id/like', async (req, res) => {
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
router.delete('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    await blog.deleteOne();
    res.json({ message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
