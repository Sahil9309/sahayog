import React from 'react';
import { Link } from 'react-router-dom';

// It's helpful to define icon components or import them from a library like 'react-icons'
// Placeholder icons for demonstration:
const FacebookIcon = () => <svg /* ... */ />;
const TwitterIcon = () => <svg /* ... */ />;
const InstagramIcon = () => <svg /* ... */ />;


const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Main footer content with grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Brand and Mission */}
          <div className="md:col-span-2">
            <Link to="/" className="text-xl font-bold text-white hover:text-gray-300 transition-colors">
              Sahayog
            </Link>
            <p className="mt-4 text-gray-400 leading-relaxed max-w-sm">
              Empowering creators and innovators to bring their ideas to life through community funding.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Explore</h3>
            <ul className="mt-4 space-y-3">
              <li><Link to="/start-campaign" className="hover:text-white transition-colors">Start a Campaign</Link></li>
              <li><Link to="/projects" className="hover:text-white transition-colors">Explore Projects</Link></li>
              <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
            </ul>
          </div>

          {/* Column 3: Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-3">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom bar with copyright and social links */}
        <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Sahayog. All rights reserved.
          </p>
          <div className="flex space-x-5 mt-4 sm:mt-0">
            {/* Replace with actual social links and icons */}
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <span className="sr-only">Facebook</span>
              {/* <FacebookIcon /> */}
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <span className="sr-only">Twitter</span>
              {/* <TwitterIcon /> */}
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <span className="sr-only">Instagram</span>
              {/* <InstagramIcon /> */}
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;