import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { motion } from 'framer-motion';
import { StarIcon, ShieldCheckIcon, TruckIcon, CreditCardIcon, HeartIcon, EyeIcon, MagnifyingGlassIcon, ArrowPathIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isFeatured: boolean;
  category: string;
}

interface Blog {
  _id: string;
  title: string;
  content: string;
  image: string;
  category: string;
  createdAt: string;
  userName?: string;
  readTime?: string;
  likes: {
    count: number;
    users: string[];
  };
  views: number;
}

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [latestBlogs, setLatestBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [productsRes, blogsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/products/featured'),
          axios.get('http://localhost:5000/api/blogs')
        ]);

        if (Array.isArray(productsRes.data)) {
          setFeaturedProducts(productsRes.data);
        }
        if (Array.isArray(blogsRes.data)) {
          setLatestBlogs(blogsRes.data.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-accent-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative min-h-[80vh] bg-white">
        <div className="relative max-w-7xl mx-auto py-32 px-4 sm:py-40 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl mx-auto mb-4">
                <span className="block text-gray-800">
                  Premium Sports
                </span>
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-600">
                  Supplements
                </span>
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mb-8 rounded-full"></div>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12"
            >
              Discover our carefully selected collection of high-quality sports supplements from leading brands. 
              Enhance your performance and recovery with professional supplements trusted by athletes worldwide.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
            >
              <Link
                to="/products"
                className="group relative inline-flex items-center px-8 py-4 text-base font-bold rounded-lg text-white hover:text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <span className="relative z-10 text-white">Shop Now</span>
                <span className="relative z-10 ml-2 text-white transform transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link
                to="/blogs"
                className="group relative inline-flex items-center px-8 py-4 text-base font-bold rounded-lg text-white hover:text-white bg-gradient-to-r from-gray-600 to-gray-700 hover:from-orange-500 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <span className="relative z-10 text-white">Read Training Tips</span>
                <span className="relative z-10 ml-2 text-white transform transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Trust Badges Section - Moved inside hero */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="group flex flex-col items-center text-center hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 shadow-md mb-4 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheckIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Trusted Partners</h3>
              <p className="text-gray-600 leading-relaxed">Carefully selected premium brands and verified suppliers</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="group flex flex-col items-center text-center hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 shadow-md mb-4 group-hover:scale-110 transition-transform duration-300">
                <StarIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Content</h3>
              <p className="text-gray-600 leading-relaxed">In-depth reviews, guides and training tips from professionals</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="group flex flex-col items-center text-center hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 shadow-md mb-4 group-hover:scale-110 transition-transform duration-300">
                <MagnifyingGlassIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Easy Product Search</h3>
              <p className="text-gray-600 leading-relaxed">Find the perfect products to maximize your training results</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="group flex flex-col items-center text-center hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 shadow-md mb-4 group-hover:scale-110 transition-transform duration-300">
                <ArrowPathIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Weekly Updates</h3>
              <p className="text-gray-600 leading-relaxed">Fresh content and new product reviews every week</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Top Rated Supplements</h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Professional supplements selected by experts and loved by athletes
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group relative bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200"
              >
                <Link to={`/product/${product._id}`} className="block">
                  <div className="relative w-full h-80 rounded-lg overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.isFeatured && (
                      <div className="absolute top-2 right-2 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                      <p className="text-lg font-medium text-orange-500">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                    <div className="mt-2 flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className="h-5 w-5 text-yellow-400"
                          aria-hidden="true"
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-500">Trusted Product</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-accent-600 hover:bg-accent-700 transition-all duration-300"
            >
              View All Products
              <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      {/* Latest Blog Posts */}
      <div className="relative bg-gray-50 py-16 sm:py-24">
        <div className="relative">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Training Tips & Expert Reviews
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4">
              Discover professional insights and in-depth reviews to maximize your supplement results and achieve your fitness goals
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-lg gap-8 lg:max-w-none lg:grid-cols-3">
            {latestBlogs.map((blog) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex flex-col overflow-hidden rounded-lg shadow-lg"
              >
                <div className="flex-shrink-0">
                  <img
                    className="h-48 w-full object-cover"
                    src={blog.image ? `http://localhost:5000${blog.image}` : '/images/placeholder.jpg'}
                    alt={blog.title}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/placeholder.jpg';
                      target.onerror = null;
                    }}
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between bg-white p-6">
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <EyeIcon className="h-4 w-4 mr-1" />
                      {blog.views} views
                    </div>
                    <div className="flex items-center">
                      <HeartIcon className="h-4 w-4 mr-1" />
                      {blog.likes.count} likes
                    </div>
                    <div>{blog.readTime || '5 min read'}</div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-300">
                    <Link to={`/blogs/${blog._id}`} className="block">
                      {blog.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {blog.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {formatDate(blog.createdAt)}
                    </span>
                    <Link
                      to={`/blogs/${blog._id}`}
                      className="inline-flex items-center text-orange-600 font-semibold hover:text-orange-700 transition-colors duration-300"
                    >
                      Read more
                      <span className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="relative py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Get Expert Training Tips & Exclusive Deals
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Join our newsletter and receive weekly updates on new products and training techniques
            </p>
          </div>
          <form className="mx-auto mt-10 max-w-md">
            <div className="flex gap-x-4">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="min-w-0 flex-auto rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-offset-2 focus:ring-accent-600 sm:text-sm sm:leading-6"
                placeholder="Enter your email"
              />
              <button
                type="submit"
                className="flex-none rounded-md bg-accent-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-accent-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600"
              >
                Subscribe
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
