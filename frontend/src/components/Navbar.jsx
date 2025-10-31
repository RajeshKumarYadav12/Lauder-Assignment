import React from "react";
import { FaMusic, FaMapMarkerAlt } from "react-icons/fa";

/**
 * Navbar Component
 * Top navigation bar with branding
 */
const Navbar = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            <div className="bg-primary-600 p-2 rounded-lg">
              <FaMusic className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Louder<span className="text-primary-600">.</span>
              </h1>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <FaMapMarkerAlt className="text-primary-500" />
                Sydney Events
              </p>
            </div>
          </div>

          {/* Navigation Items (optional) */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="#events"
              className="text-gray-600 hover:text-primary-600 transition-colors font-medium cursor-pointer"
            >
              Events
            </a>
            <a
              href="#about"
              className="text-gray-600 hover:text-primary-600 transition-colors font-medium cursor-pointer"
            >
              About
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
