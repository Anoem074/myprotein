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
  const [hasReviewed, setHasReviewed] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching data for product:', id);

        // First, fetch the product details
        const productRes = await axios.get(`http://localhost:5000/api/products/${id}`);
        console.log('Product data received:', productRes.data);
        setProduct(productRes.data);

        // Then fetch related products
        const relatedRes = await axios.get(`http://localhost:5000/api/products/related/${id}`);
        console.log('Related products received:', relatedRes.data);
        setRelatedProducts(relatedRes.data || []);

        // Fetch reviews
        console.log('Fetching reviews...');
        const reviewsRes = await axios.get(`http://localhost:5000/api/reviews/product/${id}`);
        console.log('Reviews received:', reviewsRes.data);
        setReviews(reviewsRes.data.reviews || []);

        // Check if user has reviewed
        console.log('Checking previous reviews...');
        const hasReviewedRes = await axios.get(`http://localhost:5000/api/reviews/check-ip/${id}`);
        console.log('Review check response:', hasReviewedRes.data);
        setHasReviewed(hasReviewedRes.data.hasReviewed);

        setError(null);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Response data:', err.response.data);
          console.error('Response status:', err.response.status);
          console.error('Response headers:', err.response.headers);
          setError(`Error ${err.response.status}: ${err.response.data.message || 'Failed to load product details.'}`);
        } else if (err.request) {
          // The request was made but no response was received
          console.error('Request:', err.request);
          setError('No response received from the server. Please try again later.');
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error message:', err.message);
          setError('An unexpected error occurred. Please try again later.');
        }
        
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
    setReviewError(null);

    if (hasReviewed) {
      setReviewError('You have already reviewed this product');
      return;
    }

    try {
      console.log('Submitting review:', {
        productId: id,
        userName,
        rating,
        comment: reviewText
      });

      const response = await axios.post('http://localhost:5000/api/reviews/add', {
        productId: id,
        userName,
        rating,
        comment: reviewText
      });

      console.log('Review submitted successfully:', response.data);
      setReviews(prev => [response.data, ...prev]);
      setHasReviewed(true);
      setIsReviewOpen(false);
      setReviewText('');
      setUserName('');
      setRating(5);
      toast.success('Review submitted successfully!');
    } catch (error: any) {
      console.error('Error submitting review:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        setReviewError(error.response.data.message || 'Failed to submit review');
        toast.error(error.response.data.message || 'Failed to submit review');
      } else if (error.request) {
        console.error('Request:', error.request);
        setReviewError('No response from server. Please try again.');
        toast.error('No response from server. Please try again.');
      } else {
        console.error('Error message:', error.message);
        setReviewError('An unexpected error occurred');
        toast.error('An unexpected error occurred');
      }
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
    <div className="container mx-auto px-4 py-8">
      {/* Product details section */}
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

        {/* Reviews Section */}
        <div className="mt-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Customer Reviews</h2>
            {!hasReviewed && (
              <button
                onClick={() => setIsReviewOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Write a Review
              </button>
            )}
          </div>

          {/* Review Form Modal */}
          <AnimatePresence>
            {isReviewOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  className="bg-white rounded-lg p-6 max-w-lg w-full mx-4"
                >
                  <h3 className="text-xl font-bold mb-4">Write a Review</h3>
                  {reviewError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                      {reviewError}
                    </div>
                  )}
                  <form onSubmit={handleSubmitReview}>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Rating
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="focus:outline-none"
                          >
                            {star <= rating ? (
                              <StarSolidIcon className="h-6 w-6 text-yellow-400" />
                            ) : (
                              <StarIcon className="h-6 w-6 text-gray-400" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Review
                      </label>
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                        rows={4}
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-4">
                      <button
                        type="button"
                        onClick={() => setIsReviewOpen(false)}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Submit Review
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review this product!</p>
            ) : (
              reviews.map((review) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{review.userName}</h4>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, index) => (
                          <StarSolidIcon
                            key={index}
                            className={`h-4 w-4 ${
                              index < review.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-2">{review.comment}</p>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Related products section */}
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
