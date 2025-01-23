import { useState, useEffect } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { PlusIcon, TrashIcon, PencilIcon, ChartBarIcon, TagIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface Blog {
  _id: string;
  title: string;
  content: string;
  image: string;
  category: string;
  createdAt: string;
}

interface BlogStats {
  totalBlogs: number;
  totalViews: number;
  recentPosts: number;
}

const Blogs = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [stats, setStats] = useState<BlogStats>({
    totalBlogs: 0,
    totalViews: 0,
    recentPosts: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    image: null as File | null,
  });
  const [previewImage, setPreviewImage] = useState<string>('');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setFormData(prev => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  });

  useEffect(() => {
    fetchBlogs();
    fetchStats();
  }, []);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5000/api/blogs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (Array.isArray(response.data)) {
        setBlogs(response.data);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/analytics/blog-stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      category: blog.category,
      image: null,
    });
    setPreviewImage(blog.image);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchBlogs();
        fetchStats();
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('Form data being sent:', formData); // Debug log
      
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('category', formData.category || '');
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const config = {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      let response;
      if (editingBlog) {
        response = await axios.put(`http://localhost:5000/api/blogs/${editingBlog._id}`, formDataToSend, config);
      } else {
        response = await axios.post('http://localhost:5000/api/blogs', formDataToSend, config);
      }

      console.log('Server response:', response.data); // Debug log

      setShowModal(false);
      setFormData({
        title: '',
        content: '',
        category: '',
        image: null,
      });
      setPreviewImage('');
      setEditingBlog(null);
      fetchBlogs();
      fetchStats();
    } catch (error: any) {
      console.error('Error saving blog:', error);
      console.error('Error response:', error.response?.data); // Debug log
      alert(error.response?.data?.message || 'Error saving blog post');
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="p-6">
      {/* Stats Section */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6">
          <dt>
            <div className="absolute rounded-md bg-accent-500 p-3">
              <DocumentTextIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">Total Posts</p>
          </dt>
          <dd className="ml-16 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{stats.totalBlogs}</p>
          </dd>
        </div>

        <div className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6">
          <dt>
            <div className="absolute rounded-md bg-accent-500 p-3">
              <ChartBarIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">Total Views</p>
          </dt>
          <dd className="ml-16 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{stats.totalViews}</p>
          </dd>
        </div>

        <div className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6">
          <dt>
            <div className="absolute rounded-md bg-accent-500 p-3">
              <TagIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">Recent Posts (7d)</p>
          </dt>
          <dd className="ml-16 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{stats.recentPosts}</p>
          </dd>
        </div>
      </div>

      {/* Header Section */}
      <div className="mb-6 sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Blog Posts
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your blog posts, create new content, and organize categories
          </p>
        </div>
        <div className="mt-4 sm:ml-4 sm:mt-0">
          <button
            type="button"
            onClick={() => {
              setEditingBlog(null);
              setFormData({
                title: '',
                content: '',
                category: '',
                image: null,
              });
              setPreviewImage('');
              setShowModal(true);
            }}
            className="inline-flex items-center rounded-md bg-accent-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            New Blog Post
          </button>
        </div>
      </div>

      {/* Blog List */}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <div key={blog._id} className="overflow-hidden rounded-lg bg-white shadow">
              <div className="relative h-48 w-full">
                {blog.image ? (
                  <img
                    src={`http://localhost:5000${blog.image}`}
                    alt={blog.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100">
                    <DocumentTextIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">{blog.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{blog.content}</p>
                <div className="mt-4 flex justify-between">
                  <span className="inline-flex items-center rounded-full bg-accent-100 px-2.5 py-0.5 text-xs font-medium text-accent-800">
                    {blog.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(blog.createdAt)}
                  </span>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    <PencilIcon className="h-5 w-5 inline-block mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="inline-flex items-center rounded-md bg-red-50 px-2.5 py-1.5 text-sm font-semibold text-red-700 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-100"
                  >
                    <TrashIcon className="h-5 w-5 inline-block mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                    Content
                  </label>
                  <textarea
                    name="content"
                    id="content"
                    rows={5}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Blog Image</label>
                  <div
                    {...getRootProps()}
                    className={`mt-1 flex justify-center rounded-md border-2 border-dashed px-6 pt-5 pb-6 ${
                      isDragActive ? 'border-accent-500 bg-accent-50' : 'border-gray-300'
                    }`}
                  >
                    <div className="space-y-1 text-center">
                      <input {...getInputProps()} />
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="mx-auto h-32 w-32 object-cover"
                        />
                      ) : (
                        <div className="text-gray-600">
                          <PlusIcon className="mx-auto h-12 w-12" aria-hidden="true" />
                          <p className="text-sm">Drag & drop an image here, or click to select</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md bg-accent-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500 sm:col-start-2"
                  >
                    {editingBlog ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;
