import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { fetchBlogs } from '../store/slices/blogSlice';
import type { AppDispatch } from '../store/store';
import { motion } from 'framer-motion';
import { PhotoIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { toggleFavorite } from '../store/slices/favoritesSlice';

const Blogs = () => {
  const dispatch = useDispatch<AppDispatch>();
  const blogs = useSelector((state: RootState) => state.blogs.blogs);
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const isLoading = useSelector((state: RootState) => state.blogs.isLoading);

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

  const handleToggleFavorite = (blog: any) => {
    dispatch(toggleFavorite(blog));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-accent-500 animate-spin"></div>
          <div className="mt-4 text-center text-accent-500 font-medium">Loading blog posts...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Our Blog
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Stay updated with our latest articles and insights
            </p>
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {blogs.map((blog, index) => (
            <motion.article
              key={blog._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="relative w-full">
                {blog.image ? (
                  <>
                    <img
                      src={`http://localhost:5000${blog.image}`}
                      alt={blog.title}
                      className="aspect-[16/9] w-full rounded-t-2xl object-cover sm:aspect-[3/2] lg:aspect-[3/2]"
                    />
                    <div className="absolute inset-0 rounded-t-2xl bg-gradient-to-t from-gray-900/40 to-gray-900/0" />
                  </>
                ) : (
                  <div className="aspect-[16/9] w-full rounded-t-2xl bg-gray-100 flex items-center justify-center sm:aspect-[3/2] lg:aspect-[3/2]">
                    <PhotoIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <button
                  onClick={() => handleToggleFavorite(blog)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/90 shadow-md hover:bg-white transition-transform duration-200 hover:scale-110"
                >
                  {favorites.some(fav => fav._id === blog._id) ? (
                    <BookmarkSolidIcon className="h-5 w-5 text-accent-600" />
                  ) : (
                    <BookmarkIcon className="h-5 w-5 text-gray-600" />
                  )}
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-x-4 text-xs mb-4">
                  <time dateTime={blog.createdAt} className="text-gray-500">
                    {formatDate(blog.createdAt)}
                  </time>
                  <span className="relative z-10 rounded-full bg-accent-50 px-3 py-1.5 font-medium text-accent-600">
                    {blog.category || 'General'}
                  </span>
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-accent-600 transition-colors duration-200">
                    <Link to={`/blog/${blog._id}`}>
                      <span className="absolute inset-0" />
                      {blog.title}
                    </Link>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                    {blog.content}
                  </p>
                </div>
                <div className="mt-6">
                  <Link
                    to={`/blog/${blog._id}`}
                    className="text-sm font-medium text-accent-600 hover:text-accent-500"
                  >
                    Read more <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
