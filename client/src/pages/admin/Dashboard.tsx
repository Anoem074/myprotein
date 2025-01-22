import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  ShoppingBagIcon,
  ChartBarIcon,
  UsersIcon,
  CogIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalProducts: number;
  totalViews: number;
  totalCustomers: number;
}

const Dashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalViews: 0,
    totalCustomers: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const [productsRes, analyticsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/products'),
        axios.get('http://localhost:5000/api/analytics/stats')
      ]);

      setStats({
        totalProducts: Array.isArray(productsRes.data) ? productsRes.data.length : 0,
        totalViews: analyticsRes.data.totalViews || 0,
        totalCustomers: 0 // To be implemented
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const cards = [
    {
      name: 'Products',
      icon: ShoppingBagIcon,
      value: stats.totalProducts,
      unit: 'items',
      href: '/products',
      color: 'bg-orange-500'
    },
    {
      name: 'Analytics',
      icon: ChartBarIcon,
      value: stats.totalViews,
      unit: 'views',
      href: '/analytics',
      color: 'bg-orange-400'
    },
    {
      name: 'Customers',
      icon: UsersIcon,
      value: stats.totalCustomers,
      unit: 'users',
      href: '/customers',
      color: 'bg-orange-500'
    },
    {
      name: 'Settings',
      icon: CogIcon,
      href: '/settings',
      color: 'bg-orange-600'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-14 w-14 bg-orange-500 rounded-2xl flex items-center justify-center shadow-sm">
                <CogIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-orange-500">Welcome back, {user?.name || 'Admin'}</h1>
                <p className="text-gray-500 mt-1">Here's an overview of your website's performance and management options.</p>
              </div>
            </div>
            <Link
              to="/products/new"
              className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-medium rounded-2xl hover:bg-orange-600 transition-all duration-200 shadow-sm"
            >
              <ShoppingBagIcon className="h-5 w-5 mr-2" />
              Add New Product
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cards.map((card) => (
            <Link
              key={card.name}
              to={card.href}
              className="group bg-white p-6 rounded-3xl transition-all duration-200 hover:shadow-lg shadow-sm"
            >
              <div className="flex items-center">
                <div className="h-12 w-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
                  <card.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-500 text-sm">{card.name}</p>
                  {card.value !== undefined && (
                    <p className="text-2xl font-bold text-orange-500">
                      {card.value} <span className="text-sm font-normal text-gray-400">{card.unit}</span>
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/products/new"
            className="group bg-white p-8 rounded-3xl transition-all duration-200 hover:shadow-lg shadow-sm"
          >
            <div className="relative">
              <ShoppingBagIcon className="h-12 w-12 text-orange-500 mb-4 group-hover:scale-105 transition-transform duration-200" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Add New Product</h3>
              <p className="text-gray-500">Create and publish new products</p>
            </div>
          </Link>

          <Link
            to="/analytics"
            className="group bg-white p-8 rounded-3xl transition-all duration-200 hover:shadow-lg shadow-sm"
          >
            <div className="relative">
              <ChartBarIcon className="h-12 w-12 text-orange-500 mb-4 group-hover:scale-105 transition-transform duration-200" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">View Analytics</h3>
              <p className="text-gray-500">Track your website performance</p>
            </div>
          </Link>

          <Link
            to="/settings"
            className="group bg-white p-8 rounded-3xl transition-all duration-200 hover:shadow-lg shadow-sm"
          >
            <div className="relative">
              <CogIcon className="h-12 w-12 text-orange-500 mb-4 group-hover:scale-105 transition-transform duration-200" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Settings</h3>
              <p className="text-gray-500">Configure your website settings</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
