import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCartIcon, BookmarkIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { addToCart } from '../store/slices/cartSlice';
import { toggleFavorite } from '../store/slices/favoritesSlice';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isFeatured: boolean;
  rating: number;
  numReviews: number;
  affiliateLinks: {
    shop: string;
    url: string;
    price: number;
    inStock: boolean;
    lastChecked: string;
  }[];
}

interface Review {
  _id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const calculateAverageRating = (reviews: Review[]): number => {
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return 0;
  }
  
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const isFavorite = favorites.some(fav => fav._id === id);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [productRes, relatedRes, reviewsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/products/${id}`),
          axios.get(`http://localhost:5000/api/products/related/${id}`),
          axios.get(`http://localhost:5000/api/products/${id}/reviews`)
        ]);
        setProduct(productRes.data);
        setRelatedProducts(relatedRes.data || []);
        setReviews(reviewsRes.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load product details. Please try again later.');
        setReviews([]);
        setRelatedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ ...product, quantity }));
    }
  };

  const handleToggleFavorite = () => {
    if (product) {
      dispatch(toggleFavorite(product));
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/products/${id}/reviews`, {
        userName,
        rating,
        comment: reviewText
      });
      
      // Reset form
      setRating(5);
      setReviewText('');
      setUserName('');
      setIsReviewOpen(false);
      
      // Refresh product data to show new review
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const [productRes, relatedRes, reviewsRes] = await Promise.all([
            axios.get(`http://localhost:5000/api/products/${id}`),
            axios.get(`http://localhost:5000/api/products/related/${id}`),
            axios.get(`http://localhost:5000/api/products/${id}/reviews`)
          ]);
          setProduct(productRes.data);
          setRelatedProducts(relatedRes.data || []);
          setReviews(reviewsRes.data || []);
          setError(null);
        } catch (err) {
          console.error('Error fetching data:', err);
          setError('Failed to load product details. Please try again later.');
          setReviews([]);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
      
      toast.success('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again.');
    }
  };

  const averageRating = calculateAverageRating(reviews);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-accent-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Error</h2>
          <p className="mt-2 text-gray-600">{error || 'Product not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Product Details */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col-reverse"
          >
            <div className="aspect-w-1 aspect-h-1 w-full">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover object-center rounded-lg shadow-lg"
              />
            </div>
          </motion.div>

          {/* Product info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0"
          >
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                {product.name}
              </h1>
              <button
                onClick={handleToggleFavorite}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                {isFavorite ? (
                  <BookmarkSolidIcon className="h-6 w-6 text-accent-600" />
                ) : (
                  <BookmarkIcon className="h-6 w-6 text-gray-600" />
                )}
              </button>
            </div>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl text-gray-900">${product.price.toFixed(2)}</p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="text-base text-gray-700 space-y-6">
                <p>{product.description}</p>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarSolidIcon
                      key={rating}
                      className={`${
                        rating < Math.round(averageRating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      } h-5 w-5 flex-shrink-0`}
                    />
                  ))}
                </div>
                <p className="ml-3 text-sm text-gray-700">
                  {averageRating > 0 ? (
                    <>
                      <span className="font-medium">{averageRating}</span> out of 5 stars ({reviews.length} reviews)
                    </>
                  ) : (
                    'No reviews yet'
                  )}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-center">
                <span className="text-sm text-gray-700 mr-3">Category:</span>
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-accent-100 text-accent-800">
                  {product.category}
                </span>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <label htmlFor="quantity" className="sr-only">
                    Quantity
                  </label>
                  <select
                    id="quantity"
                    name="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="rounded-md border border-gray-300 text-base font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500 sm:text-sm"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
                >
                  <ShoppingCartIcon className="h-5 w-5 mr-2" />
                  Add to Cart
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Affiliate Links */}
        <div className="mt-16">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Available at Stores</h3>
          <div className="space-y-4">
            {product.affiliateLinks?.map((link, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ShoppingBagIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="font-medium">{link.shop}</span>
                  </div>
                  <span className="text-lg font-semibold">${link.price}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className={`text-sm ${link.inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {link.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
                  >
                    View Offer
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 space-y-8">
          {/* Reviews List */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < (product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating?.toFixed(1)} out of 5 ({product.numReviews} {product.numReviews === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            </div>
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
                className="space-y-6"
              >
                {reviews.length > 0 ? (
                  reviews.map((review, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-50 p-4 rounded-lg border border-gray-100"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{review.userName}</span>
                        <div className="flex items-center">
                          {[...Array(review.rating)].map((_, i) => (
                            <svg
                              key={i}
                              className="w-5 h-5 text-yellow-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="mt-2 text-gray-600">{review.comment}</p>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>

          {/* Write Review Button */}
          <button
            onClick={() => setIsReviewOpen(!isReviewOpen)}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <span className="font-medium">Write a Review</span>
            <motion.span
              animate={{ rotate: isReviewOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </motion.span>
          </button>

          {/* Review Form */}
          <AnimatePresence>
            {isReviewOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-6 space-y-4 bg-white rounded-lg shadow-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Write Your Review</h3>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                        Rating
                      </label>
                      <div className="mt-1 flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`${
                              rating >= star ? 'text-yellow-400' : 'text-gray-300'
                            } hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 rounded-full p-1`}
                          >
                            <svg
                              className="w-6 h-6"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="review" className="block text-sm font-medium text-gray-700">
                        Your Review
                      </label>
                      <textarea
                        id="review"
                        name="review"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                        required
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-500 text-base font-medium text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:text-sm"
                    >
                      Submit Review
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((related) => (
                <motion.div
                  key={related._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <Link to={`/product/${related._id}`} className="block">
                    <div className="aspect-w-1 aspect-h-1 w-full">
                      <img
                        src={related.image}
                        alt={related.name}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900">{related.name}</h3>
                      <p className="mt-1 text-lg font-medium text-orange-500">
                        €{related.price.toFixed(2)}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
