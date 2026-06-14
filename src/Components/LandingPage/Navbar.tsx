import React, { useState } from 'react';
import { Menu, X, PhoneCall, User as UserIcon, ChevronDown } from 'lucide-react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { logout } from '../../store/authSlice';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  // Your specific Nav Links
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Why Murammat', href: '/why-murammat' },
    { name: 'Track my order', href: '/track-order' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-[#878787]/20 w-full z-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* 1. Logo Section (Always Visible) */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Murammat.pk" className="h-10 w-auto object-contain" />
              <span className="text-gray-900 font-bold tracking-tight text-xl sm:text-2xl">
                Murammat<span className="text-[#00674F]">.pk</span>
              </span>
            </Link>
          </div>

          {/* 2. Desktop Nav Links (Hidden on < md screens) */}
          <div className="hidden md:flex space-x-6 lg:space-x-8 items-center">
            {navLinks.map((link, index) => (
              <NavLink 
                key={index} 
                to={link.href} 
                className={({ isActive }) => 
                  `font-medium transition-colors duration-200 text-sm lg:text-base ${
                    isActive ? 'text-[#00674F] font-semibold' : 'text-gray-700 hover:text-[#00674F]'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Auth Link (Desktop) */}
            <div className="hidden md:flex items-center gap-2 relative">
              {isAuthenticated ? (
                <div className="relative">
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 focus:outline-none hover:bg-gray-50 px-2 py-1 rounded-full transition-colors border border-gray-200"
                  >
                    <div className="w-10 h-10 bg-[#00674F] text-white rounded-full flex items-center justify-center font-bold shadow-sm">
                      {user?.email ? user.email.charAt(0).toUpperCase() : <UserIcon size={20} />}
                    </div>
                    <ChevronDown size={16} className="text-gray-600" />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                      </div>
                      <Link 
                        to="/dashboard" 
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#00674F] transition-colors"
                      >
                        Dashboard
                      </Link>
                      <Link 
                        to="/profile" 
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#00674F] transition-colors"
                      >
                        Edit Profile
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button 
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-[#dc2626] hover:bg-red-50 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="text-sm font-medium text-[#00674F] border border-[#00674F] hover:bg-[#00674F] hover:text-white px-4 py-2 rounded-lg transition-all">Sign In</Link>
              )}
            </div>

            {/* Phone Call Button (Visible on ALL screens) */}
            {/* The href="tel:..." automatically opens the phone dialer */}
            <a 
              href="tel:03218180319" 
              className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-[#00674F] rounded-full text-white shadow-md hover:bg-[#00523f] transition-all transform hover:scale-105"
              aria-label="Call Us"
            >
              {/* Added a subtle pulse animation to draw the eye to the call button */}
              <PhoneCall size={20} className="animate-pulse" />
            </a>

            {/* Mobile Menu Button (Visible ONLY on < md screens) */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 hover:text-[#00674F] focus:outline-none p-1"
                aria-label="Toggle Menu"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Mobile Menu Dropdown (Slides down when hamburger is clicked) */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-[#878787]/20 absolute w-full left-0 shadow-xl z-40">
          <div className="px-4 pt-2 pb-6 space-y-2 sm:px-6">
            {navLinks.map((link, index) => (
              <NavLink
                key={index}
                to={link.href}
                className={({ isActive }) => 
                  `block px-3 py-3 rounded-md text-base font-medium transition-colors border-b border-gray-50 last:border-0 ${
                    isActive ? 'text-[#00674F] bg-[#00674F]/5' : 'text-gray-700 hover:text-[#00674F] hover:bg-[#00674F]/5'
                  }`
                }
                onClick={() => setIsOpen(false)} // Auto-close menu when a link is tapped
              >
                {link.name}
              </NavLink>
            ))}
            {!isAuthenticated ? (
               <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-md text-base font-bold text-[#00674F] text-center bg-gray-50 uppercase">Login / Register</Link>
            ) : (
               <>
                 <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-md text-base font-bold text-white text-center bg-[#00674F] uppercase">My Dashboard</Link>
                 <Link to="/profile" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-md text-base font-bold text-[#00674F] border border-[#00674F] text-center hover:bg-[#00674F]/5 uppercase mt-2">Edit Profile</Link>
                 <button onClick={handleLogout} className="block w-full px-3 py-3 rounded-md text-base font-bold text-[#dc2626] text-center border border-[#dc2626] hover:bg-[#dc2626] hover:text-white uppercase mt-2">Logout</button>
               </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;