import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ServiceDetails from './pages/ServiceDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Checkout from './pages/Checkout';
import CategoryServices from './pages/CategoryServices';
import Navbar from './Components/LandingPage/Navbar';
import Footer from './Components/LandingPage/Footer';
import SpecificCategories from './pages/SpecificCategories';
import ServicesPage from './pages/Services';
import EditProfile from './pages/EditProfile';
import WhyMurammat from './pages/WhyMurammat';
import Blogs from './pages/Blogs';
import BlogDetails from './pages/BlogDetails';
import TrackOrder from './pages/TrackOrder';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<EditProfile />} />
          <Route path="/category/:id" element={<CategoryServices />} />
          <Route path="/services/:id" element={<ServiceDetails />} />
          <Route path="/checkout/:service_id" element={<Checkout />} />
          <Route path="/specific-categories" element={<SpecificCategories />} />
          <Route path="/subcategory/:subcategoryId/services" element={<ServicesPage />} />
          <Route path="/why-murammat" element={<WhyMurammat />} />
          <Route path="/blog" element={<Blogs />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
          <Route path="/track-order" element={<TrackOrder />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
