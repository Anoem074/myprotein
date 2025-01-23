import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface Blog {
  _id: string;
  title: string;
  content: string;
  image: string;
  category: string;
  createdAt: string;
}

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        setBlog(response.data);
      } catch (err) {
        setError('Failed to load blog post');
        console.error('Error fetching blog:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-accent-500 animate-spin"></div>
          <div className="mt-4 text-center text-accent-500 font-medium">Loading blog post...</div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-8">{error || 'Blog post not found'}</p>
          <Link
            to="/blogs"
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-accent-500 hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 transition-all duration-200"
          >
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/blogs"
              className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors duration-200"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Blogs
            </Link>
            <div className="flex items-center text-sm text-white/80 mb-4">
              <span className="inline-block bg-accent-500/20 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                {blog.category || 'General'}
              </span>
              <span className="mx-2">•</span>
              <time dateTime={blog.createdAt}>{formatDate(blog.createdAt)}</time>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              {blog.title}
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20"
      >
        <article className="prose prose-lg prose-accent mx-auto">
          {blog.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </article>

        {/* Share Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col items-center space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Share this article</h3>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
                className="group relative flex items-center justify-center p-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 text-white hover:from-blue-500 hover:to-blue-600 transition-all duration-300 hover:scale-110"
                aria-label="Share on Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
                <span className="absolute left-full ml-2 px-2 py-1 text-sm text-gray-700 bg-white rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Twitter
                </span>
              </button>
              
              <button 
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                className="group relative flex items-center justify-center p-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-110"
                aria-label="Share on Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
                <span className="absolute left-full ml-2 px-2 py-1 text-sm text-gray-700 bg-white rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Facebook
                </span>
              </button>
              
              <button 
                onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${blog.title} - ${window.location.href}`)}`, '_blank')}
                className="group relative flex items-center justify-center p-3 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:scale-110"
                aria-label="Share on WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M20.11 3.89C17.95 1.73 15.17 0.5 12.19 0.5C5.87 0.5 0.69 5.68 0.69 12C0.69 13.96 1.17 15.87 2.07 17.56L0.5 23.5L6.44 21.93C8.13 22.83 10.04 23.31 12 23.31C18.32 23.31 23.5 18.13 23.5 11.81C23.5 8.83 22.27 6.05 20.11 3.89ZM12.19 21.38C10.42 21.38 8.69 20.93 7.15 20.08L6.75 19.85L3.29 20.77L4.21 17.31L3.96 16.89C3.04 15.31 2.54 13.52 2.54 11.69C2.54 6.74 6.74 2.54 11.69 2.54C14.2 2.54 16.57 3.58 18.37 5.38C20.17 7.18 21.21 9.55 21.21 12.06C21.46 17.26 17.26 21.38 12.19 21.38ZM17.07 14.32C16.78 14.17 15.37 13.47 15.12 13.39C14.87 13.31 14.67 13.27 14.47 13.56C14.27 13.85 13.72 14.51 13.56 14.71C13.39 14.91 13.23 14.93 12.94 14.78C12.65 14.63 11.73 14.31 10.65 13.35C9.81 12.59 9.23 11.65 9.07 11.36C8.91 11.07 9.05 10.92 9.19 10.78C9.31 10.66 9.46 10.46 9.58 10.3C9.7 10.14 9.74 10.02 9.82 9.82C9.9 9.62 9.86 9.46 9.82 9.31C9.78 9.16 9.19 7.75 8.95 7.17C8.71 6.59 8.47 6.67 8.31 6.67C8.15 6.67 7.95 6.67 7.75 6.67C7.55 6.67 7.23 6.71 6.98 7C6.73 7.29 5.99 7.99 5.99 9.4C5.99 10.81 7.03 12.18 7.15 12.38C7.27 12.58 9.19 15.54 12.11 16.81C12.87 17.14 13.47 17.32 13.93 17.46C14.69 17.7 15.39 17.66 15.94 17.62C16.55 17.58 17.71 16.96 17.95 16.3C18.19 15.64 18.19 15.06 18.15 14.99C18.11 14.92 17.91 14.85 17.62 14.7L17.07 14.32Z" clipRule="evenodd" />
                </svg>
                <span className="absolute left-full ml-2 px-2 py-1 text-sm text-gray-700 bg-white rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  WhatsApp
                </span>
              </button>

              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  // You might want to add a toast notification here
                }}
                className="group relative flex items-center justify-center p-3 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 transition-all duration-300 hover:scale-110"
                aria-label="Copy Link"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span className="absolute left-full ml-2 px-2 py-1 text-sm text-gray-700 bg-white rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Copy Link
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      
    </div>
  );
};

export default BlogPost;
