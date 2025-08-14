import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <span className="text-xl font-bold">Sahayog</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Empowering creators and innovators to bring their ideas to life through community funding.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">For Creators</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="#" className="hover:text-white transition-colors">Start a Campaign</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Creator Resources</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Success Stories</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Creator Handbook</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">For Backers</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="#" className="hover:text-white transition-colors">Explore Projects</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Backer Protection</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Community Guidelines</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Help Center</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Press</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">© 2025 Sahayog. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
            <Link to="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;