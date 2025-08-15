import React, { useState, useContext } from 'react';
// Import NavLink along with Link
import { Link, NavLink } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from './context/UserContext.js';
import { Heart, FolderOpen, LogOut, Settings } from 'lucide-react';

const Header = () => {
  const { user, setUser } = useContext(UserContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const getUserInitials = (name) => {
    if (!name || typeof name !== 'string') return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // This function determines the className for our NavLinks
  const navLinkClasses = ({ isActive }) =>
    `px-3 py-2 rounded-md text-md font-medium transition-colors ${
      isActive ? 'text-teal-600' : 'text-gray-700 hover:text-teal-600'
    }`;

  // This function determines the className for our mobile NavLinks
  const mobileNavLinkClasses = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors ${
      isActive ? 'text-teal-600 bg-teal-50' : 'text-gray-700 hover:text-teal-600'
    }`;


  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-1 text-2xl font-bold text-teal-600 hover:text-teal-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
              Sahayog
            </Link>
          </div>


          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {/* Use NavLink for desktop view */}
              <NavLink to="/" className={navLinkClasses}>
                Home
              </NavLink>
              <NavLink to="/about" className={navLinkClasses}>
                About Us
              </NavLink>
            </div>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              // User is logged in - show user info and dropdown
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 text-gray-700 hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none"
                >
                  {/* Avatar */}
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.firstName || 'User'}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {getUserInitials(user.firstName || 'User')}
                    </div>
                  )}
                  <span className="max-w-32 truncate">{user.firstName || 'User'}</span>
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Enhanced User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100">
                    {/* User Info Section */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.firstName || 'User'}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {getUserInitials(user.firstName || 'User')}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : (user.firstName || 'User')}
                          </p>
                          <p className="text-sm text-gray-500 truncate">{user.email || 'No email'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <Link
                        to="/my-campaigns"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600 transition-colors"
                      >
                        <FolderOpen className="h-4 w-4 mr-3" />
                        My Campaigns
                      </Link>

                      <Link
                        to="/my-contributions"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600 transition-colors"
                      >
                        <Heart className="h-4 w-4 mr-3" />
                        My Contributions
                      </Link>

                      <Link
                        to="/settings"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600 transition-colors"
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Settings
                      </Link>
                    </div>

                    {/* Logout Section - Separated at bottom */}
                    <div className="border-t border-gray-100 py-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // User is not logged in - show login/signup buttons
              <>
                <Link to="/login" className="text-gray-700 hover:text-teal-600 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-teal-600 text-white hover:bg-teal-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="bg-gray-50 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {/* Conditionally render Hamburger or Close icon */}
              {isMenuOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu - Enhanced for better user experience */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`} id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* Use NavLink for mobile view */}
            <NavLink to="/" onClick={() => setIsMenuOpen(false)} className={mobileNavLinkClasses}>
              Home
            </NavLink>
            <NavLink to="/about" onClick={() => setIsMenuOpen(false)} className={mobileNavLinkClasses}>
              About Us
            </NavLink>

            {/* Mobile Auth Section */}
            <div className="pt-4 pb-3 border-t border-gray-200">
              {user ? (
                // User is logged in - Enhanced mobile menu
                <div className="space-y-3">
                  <div className="flex items-center px-3 space-x-3">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.firstName || 'User'}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {getUserInitials(user.firstName || 'User')}
                      </div>
                    )}
                    <div>
                      <div className="text-base font-medium text-gray-800">
                        {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : (user.firstName || 'User')}
                      </div>
                      <div className="text-sm font-medium text-gray-500">{user.email || 'No email'}</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Link
                      to="/my-campaigns"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50"
                    >
                      <FolderOpen className="h-5 w-5 mr-3" />
                      My Campaigns
                    </Link>
                    <Link
                      to="/my-contributions"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50"
                    >
                      <Heart className="h-5 w-5 mr-3" />
                      My Contributions
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50"
                    >
                      <Settings className="h-5 w-5 mr-3" />
                      Settings
                    </Link>
                    <div className="border-t border-gray-200 pt-2">
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <LogOut className="h-5 w-5 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // User is not logged in - show login/signup buttons
                <div className="flex items-center px-3 space-x-3">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-teal-600 px-3 py-2 rounded-md text-base font-medium">
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)} className="bg-teal-700 text-white hover:bg-teal-900 px-3 py-2 rounded-md text-base font-medium">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
export default Header;