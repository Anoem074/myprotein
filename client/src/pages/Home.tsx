import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { motion } from 'framer-motion';
import { StarIcon, ShieldCheckIcon, TruckIcon, CreditCardIcon, HeartIcon, EyeIcon } from '@heroicons/react/24/outline';

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
      <div className="relative bg-white">
        <div className="absolute inset-0">
          <img
            src="/images/hero-sports.jpg"
            alt="Sports Equipment"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white to-white/90 mix-blend-overlay" />
        </div>
        <div className="relative max-w-7xl mx-auto py-32 px-4 sm:py-40 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl lg:max-w-3xl">
              Premium Sports Equipment
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl leading-relaxed">
              Discover our carefully selected collection of high-quality sports gear from leading brands. 
              Transform your workout with professional equipment trusted by athletes worldwide.
            </p>
            <div className="mt-10 flex flex-wrap gap-6">
              <Link
                to="/products"
                className="inline-flex items-center px-8 py-4 border-2 border-orange-500 text-base font-bold rounded-md shadow-lg text-white bg-orange-500 hover:bg-orange-600 hover:border-orange-600 transition-all duration-300"
              >
                Shop Now
                <span className="ml-3 text-xl" aria-hidden="true">→</span>
              </Link>
              <Link
                to="/blogs"
                className="inline-flex items-center px-8 py-4 border-2 border-orange-500 text-base font-bold rounded-md text-orange-500 hover:bg-orange-50 transition-all duration-300"
              >
                Read Training Tips
                <span className="ml-3 text-xl" aria-hidden="true">→</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Trust Badges Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-orange-500 mb-4">
                <ShieldCheckIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Authentic Products</h3>
              <p className="text-gray-600 leading-relaxed">100% genuine products from official suppliers</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-col items-center text-center"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-orange-500 mb-4">
                <TruckIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600 leading-relaxed">Free shipping on orders over €50</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex flex-col items-center text-center"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-orange-500 mb-4">
                <CreditCardIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Payment</h3>
              <p className="text-gray-600 leading-relaxed">Protected by SSL encryption</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="flex flex-col items-center text-center"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-orange-500 mb-4">
                <StarIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Reviews</h3>
              <p className="text-gray-600 leading-relaxed">Tested by professional athletes</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Top Rated Sports Equipment
              </h2>
              <p className="mt-4 text-xl text-gray-500">
                Professional gear selected by experts and loved by athletes
              </p>
            </motion.div>
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

          <div className="mt-12 text-center">
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 transition-all duration-200"
            >
              View All Products
              <span className="ml-2" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Latest Blog Posts Section */}
      <div className="bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Training Tips & Reviews
              </h2>
              <div className="mt-4 flex justify-center">
                <p className="text-xl text-gray-600 max-w-2xl">
                  Ontdek professionele tips en reviews om het maximale uit je sportuitrusting te halen
                </p>
              </div>
            </motion.div>
          </div>

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {latestBlogs.map((blog, index) => (
              <motion.article
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <Link to={`/blog/${blog._id}`} className="block aspect-[16/10]">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
                  <img
                    src={blog.image || '/images/blog-placeholder.jpg'}
                    alt={blog.title}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/blog-placeholder.jpg';
                    }}
                    className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                
                <div className="p-6">
                  <Link 
                    to={`/blog/${blog._id}`} 
                    className="block"
                  >
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-500 transition-colors duration-300 line-clamp-2 mb-3">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-2 mb-6 text-sm leading-relaxed">
                      {blog.content}
                    </p>
                  </Link>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <HeartIcon className="h-5 w-5 text-orange-500" />
                        <span>{blog.likes?.count || 0}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <EyeIcon className="h-5 w-5 text-orange-500" />
                        <span>{blog.views || 0}</span>
                      </div>
                    </div>
                    <time dateTime={blog.createdAt} className="text-gray-500">
                      {new Date(blog.createdAt).toLocaleDateString('nl-NL', {
                        day: 'numeric',
                        month: 'long'
                      })}
                    </time>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              to="/blogs"
              className="inline-flex items-center px-8 py-3 text-base font-semibold text-orange-500 hover:text-orange-600 transition-colors duration-300"
            >
              Bekijk alle artikelen
              <span className="ml-2 text-lg" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Get Expert Training Tips & Exclusive Deals
              </h2>
              <p className="mt-4 text-lg text-white/80">
                Join our newsletter and receive weekly updates on new products and training techniques
              </p>
              <form className="mt-8 sm:flex sm:max-w-md sm:mx-auto">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  type="email"
                  name="email-address"
                  id="email-address"
                  autoComplete="email"
                  required
                  className="w-full px-5 py-3 placeholder-gray-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-orange-600 focus:ring-white rounded-md"
                  placeholder="Enter your email"
                />
                <button
                  type="submit"
                  className="mt-3 w-full px-5 py-3 bg-white text-orange-500 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-orange-600 focus:ring-white sm:mt-0 sm:ml-3 sm:w-auto sm:flex-shrink-0"
                >
                  Subscribe
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
