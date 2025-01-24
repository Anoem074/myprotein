import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingBagIcon,
  ChartBarIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalBlogs: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalBlogs: 0
  });

  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  const menuItems = [
    {
      name: 'Products',
      icon: ShoppingBagIcon,
      href: '/admin/products',
      count: stats.totalProducts,
      color: 'bg-blue-600'
    },
    {
      name: 'Orders',
      icon: ChartBarIcon,
      href: '/admin/orders',
      count: stats.totalOrders,
      color: 'bg-green-600'
    },
    {
      name: 'Blog Posts',
      icon: DocumentTextIcon,
      href: '/admin/blogs',
      count: stats.totalBlogs,
      color: 'bg-purple-600'
    },
    {
      name: 'Settings',
      icon: Cog6ToothIcon,
      href: '/settings',
      color: 'bg-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 bg-white rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-14 w-14 bg-orange-500 rounded-2xl flex items-center justify-center shadow-sm">
                <HomeIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-orange-500">Welcome back, {user?.name || 'Admin'}</h1>
                <p className="text-gray-600 mt-1">Here's what's happening with your store today.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="group relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all duration-200"
            >
              <div className={`absolute right-8 top-8 h-12 w-12 rounded-2xl ${item.color} bg-opacity-10 flex items-center justify-center`}>
                <item.icon className={`h-6 w-6 ${item.color.replace('bg-', 'text-')}`} />
              </div>
              <p className="text-sm font-medium text-gray-600">{item.name}</p>
              {'count' in item && (
                <p className="mt-2 text-3xl font-bold text-gray-900">{item.count}</p>
              )}
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="group bg-white p-8 rounded-3xl transition-all duration-200 hover:shadow-lg shadow-sm"
          >
            <div className="relative">
              <ShoppingBagIcon className="h-12 w-12 text-blue-500 mb-4 group-hover:scale-105 transition-transform duration-200" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Products</h3>
              <p className="text-gray-500">Add, edit or remove products from your store</p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="group bg-white p-8 rounded-3xl transition-all duration-200 hover:shadow-lg shadow-sm"
          >
            <div className="relative">
              <DocumentTextIcon className="h-12 w-12 text-purple-500 mb-4 group-hover:scale-105 transition-transform duration-200" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Blog Posts</h3>
              <p className="text-gray-500">Create and edit your blog content</p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="group bg-white p-8 rounded-3xl transition-all duration-200 hover:shadow-lg shadow-sm"
          >
            <div className="relative">
              <Cog6ToothIcon className="h-12 w-12 text-orange-500 mb-4 group-hover:scale-105 transition-transform duration-200" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Settings</h3>
              <p className="text-gray-500">Configure your website settings</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
