import React from 'react';
import HeroBooking from '../Components/LandingPage/HeroBooking';
import TopServices from '../Components/LandingPage/TopServices';  
import RecommendedServices from '../Components/LandingPage/RecommendedServices';  
import WhyChooseUs from '../Components/LandingPage/WhyChooseUs';  
import AppDownload from '../Components/LandingPage/AppDownload';  
import CustomerReviews from '../Components/LandingPage/CustomerReviews';  
import Complaints from '../Components/LandingPage/Complaints';

const LandingPage: React.FC = () => {
  return (
    <main>
      <HeroBooking />
      <TopServices /> 
      <RecommendedServices />
      <WhyChooseUs />  
      <AppDownload /> 
      <Complaints />
      <CustomerReviews /> 
    </main>
  );
};

export default LandingPage;
    