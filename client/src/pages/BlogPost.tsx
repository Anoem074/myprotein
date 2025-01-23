import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Blog } from '../store/slices/blogSlice';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

const BlogPost = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const [blogResponse, blogsResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/blogs/${id}`),
          axios.get('http://localhost:5000/api/blogs')
        ]);
        
        setBlog(blogResponse.data);
        
        const otherBlogs = blogsResponse.data.filter((b: Blog) => b._id !== id);
        setRelatedBlogs(otherBlogs.slice(0, 2));
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleLike = async () => {
    if (!blog || isLiking) return;

    setIsLiking(true);
    try {
      const response = await axios.post(`http://localhost:5000/api/blogs/${id}/like`);
      setBlog(response.data);
      setHasLiked(response.data.hasLiked);
    } catch (error: any) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-500"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Blog post not found</h2>
          <p className="mt-2 text-gray-600">The blog post you're looking for doesn't exist.</p>
          <Link to="/" className="mt-4 text-accent-500 hover:text-accent-600">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 transition-transform hover:-translate-x-1">
          <Link to="/" className="text-accent-500 hover:text-accent-600 flex items-center text-sm font-medium group">
            <svg
              className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to blog
          </Link>
        </div>

        <article className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:shadow-xl">
          <div className="flex flex-col lg:flex-row">
            {blog.image && (
              <div className="lg:w-1/2">
                <div className="h-full relative aspect-w-16 aspect-h-9">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            )}
            <div className={`p-6 lg:p-8 ${blog.image ? 'lg:w-1/2' : 'w-full'}`}>
              <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                {blog.title}
              </h1>
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center text-gray-500">
                  <span className="text-sm">
                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <button
                  onClick={handleLike}
                  disabled={isLiking}
                  className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
                >
                  {hasLiked ? (
                    <HeartSolid className="h-5 w-5 text-red-500" />
                  ) : (
                    <HeartOutline className="h-5 w-5" />
                  )}
                  <span className="text-sm font-medium">{blog.likes.count}</span>
                </button>
              </div>
              <div className="prose prose-lg max-w-none">
                {blog.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </article>

        {relatedBlogs.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedBlogs.map((relatedBlog) => (
                <Link
                  key={relatedBlog._id}
                  to={`/blog/${relatedBlog._id}`}
                  className="group"
                >
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-lg">
                    {relatedBlog.image && (
                      <div className="aspect-w-16 aspect-h-9">
                        <img
                          src={relatedBlog.image}
                          alt={relatedBlog.title}
                          className="w-full h-full object-cover transform transition-transform group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-accent-500 transition-colors">
                        {relatedBlog.title}
                      </h3>
                      <p className="mt-2 text-gray-600 line-clamp-2">
                        {relatedBlog.excerpt || relatedBlog.content.substring(0, 150) + '...'}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPost;
