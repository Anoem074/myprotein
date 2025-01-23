import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
  IconButton,
  Chip,
  Skeleton,
  Paper,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { AppDispatch, RootState } from '../../store/store';
import { Blog, createBlog, deleteBlog, fetchBlogs, updateBlog } from '../../store/slices/blogSlice';

const Blogs = () => {
  const dispatch = useDispatch<AppDispatch>();
  const blogs = useSelector((state: RootState) => state.blogs.blogs);
  const [open, setOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  const handleOpen = useCallback((blog?: Blog) => {
    if (blog) {
      setSelectedBlog(blog);
      setFormData({
        title: blog.title,
        content: blog.content,
        image: blog.image,
      });
    } else {
      setSelectedBlog(null);
      setFormData({
        title: '',
        content: '',
        image: '',
      });
    }
    setOpen(true);
  }, []);

  const handleClose = () => {
    setOpen(false);
    setSelectedBlog(null);
    setFormData({
      title: '',
      content: '',
      image: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (selectedBlog) {
        await dispatch(updateBlog({ id: selectedBlog._id, blogData: formData }));
      } else {
        await dispatch(createBlog(formData));
      }
      handleClose();
    } catch (error) {
      console.error('Error submitting blog:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      await dispatch(deleteBlog(id));
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: 'background.default' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Blog Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            sx={{ borderRadius: 2 }}
          >
            New Blog Post
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {blogs.map((blog) => (
          <Grid item xs={12} md={6} lg={4} key={blog._id}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: 2,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
              }
            }}>
              {blog.image && (
                <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                  <img
                    src={blog.image}
                    alt={blog.title}
                    loading="lazy"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
              )}
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom component="h2" sx={{ 
                  fontWeight: 'bold',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  mb: 2
                }}>
                  {blog.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    mb: 2,
                    flexGrow: 1
                  }}
                >
                  {blog.content}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleOpen(blog)}
                    sx={{ borderRadius: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(blog._id)}
                    sx={{ borderRadius: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <Chip
                    label={`${blog.likes || 0} likes`}
                    size="small"
                    sx={{ ml: 'auto' }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>
          {selectedBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              fullWidth
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Content"
              multiline
              rows={6}
              fullWidth
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Image URL"
              fullWidth
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              helperText="Enter a valid image URL"
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleClose} color="inherit">
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={isSubmitting}
              sx={{ minWidth: 100 }}
            >
              {isSubmitting ? 'Saving...' : selectedBlog ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Blogs;
