import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import Analytics from './pages/admin/Analytics';
import Blogs from './pages/admin/Blogs';
import BlogList from './components/BlogList';
import BlogPost from './pages/BlogPost';
import Favorites from './pages/Favorites';
import Settings from './pages/admin/Settings'; // Added import statement for Settings

function App() {
  return (
    <Router>
      <Routes>
        {/* Main public routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="blogs" element={<BlogList />} />
          <Route path="blog/:id" element={<BlogPost />} />
          {/* Add other public routes here */}
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="settings" element={<Settings />} />
          {/* Add other admin routes here */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
