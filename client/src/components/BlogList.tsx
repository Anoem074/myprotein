import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../store/store';
import { fetchBlogs } from '../store/slices/blogSlice';
import { motion } from 'framer-motion';

const BlogList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const blogs = useSelector((state: RootState) => state.blogs.blogs);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-accent-50 to-accent-100 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-accent-500/10 to-accent-600/10" />
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-white/10" />
          <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-white/10" />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 text-center mb-4">
            Our Blog
          </h1>
          <p className="text-xl text-gray-600 text-center max-w-2xl mx-auto">
            Discover insights, stories, and the latest updates from our team
          </p>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <Link to={`/blog/${blog._id}`} className="block">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span className="inline-block bg-accent-100 text-accent-800 px-3 py-1 rounded-full text-xs font-medium">
                      {blog.category || 'General'}
                    </span>
                    <span className="mx-2">•</span>
                    <time dateTime={blog.createdAt}>{formatDate(blog.createdAt)}</time>
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-gray-900 mb-3 group-hover:text-accent-600 transition-colors duration-200">
                    {blog.title}
                  </h2>
                  <p className="text-gray-600 line-clamp-3 mb-4">
                    {blog.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-accent-100 flex items-center justify-center">
                        <span className="text-accent-700 font-medium">
                          {blog.author ? blog.author[0].toUpperCase() : 'A'}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">
                        {blog.author || 'Anonymous'}
                      </span>
                    </div>
                    <span className="text-accent-600 text-sm font-medium group-hover:translate-x-1 transition-transform duration-200">
                      Read more →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      
    </div>
  );
};

export default BlogList;
