import React from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main footer content with grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand and Mission */}
          <div className="md:col-span-2">
            <Link
              to="/"
              className="text-xl font-bold text-white hover:text-gray-300 transition-colors"
            >
              Sahayog
            </Link>
            <p className="mt-4 text-gray-400 leading-relaxed max-w-sm">
              Empowering creators and innovators to bring their ideas to life
              through community funding.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
              Explore
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  to="/create-event"
                  className="hover:text-white transition-colors"
                >
                  Start a Campaign
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="hover:text-white transition-colors"
                >
                  Explore Projects
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  to="/about"
                  className="hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <a
                  href="mailto:sahayog.platform@gmail.com"
                  className="hover:text-white transition-colors flex items-center"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Us
                </a>
              </li>
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
            <a
              href="https://github.com/Sahil9309"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <span className="sr-only">GitHub</span>
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com/in/sahil9309"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="mailto:sahayog.platform@gmail.com"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <span className="sr-only">Email</span>
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
