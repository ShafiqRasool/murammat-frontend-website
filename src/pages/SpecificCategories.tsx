import React from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../Components/SpecificCategories/Hero';
import CategoryServicesGrid from '../Components/SpecificCategories/CategoryServicesGrid';  
import AppDownload from '../Components/LandingPage/AppDownload';
import TestimonialSliders from '../Components/SpecificCategories/TestimonialSliders';
import Complaints from '../Components/LandingPage/Complaints';

const SpecificCategories = () => {
  // Grab the state passed from the category card you clicked
  const location = useLocation();
  
  // If they clicked "Sofa Cleaning", location.state.categoryName will have it.
  // Otherwise, it defaults to "Home Maintenance"
  const dynamicHeading = location.state?.categoryName || "Home Maintenance";
  const parentId = location.state?.categoryId || null;

  return (
    <div>
      {/* Pass the dynamic heading into the Hero component */}
      <Hero heading={dynamicHeading} parentId={parentId} />
      <CategoryServicesGrid parentId={parentId} parentCategoryName={dynamicHeading} />  
      <AppDownload />
      <TestimonialSliders />   
      <Complaints /> 

      
      {/* Your variations and checkout cards will go down here... */}
    </div>
  );
};

export default SpecificCategories;