import { Routes, Route, useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';
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
import Contact from './pages/Contact';
import StaticPage from './pages/StaticPage';
import DeleteAccount from './pages/DeleteAccount';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-profile" element={<Dashboard />} />
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
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<StaticPage id="privacy-policy" />} />
          <Route path="/terms-conditions" element={<StaticPage id="terms-conditions" />} />
          <Route path="/partner-privacy-policy" element={<StaticPage id="partner-app-privacy-policy" />} />
          <Route path="/delete-account" element={<DeleteAccount />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
