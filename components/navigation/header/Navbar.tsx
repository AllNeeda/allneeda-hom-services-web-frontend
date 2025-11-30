'use client'
import { useState, useEffect } from 'react';
import { Search, Menu, X, User, ShoppingBag, MapPin, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Palos Hills, IL');

  const categories = [
    "Beauty & Spas",
    "Things To Do",
    "Auto & Home",
    "Food & Drink",
    "Gifts",
    "Local",
    "Travel",
    "Goods",
    "Coupons"
  ];

  const popularLocations = [
    'Chicago, IL',
    'New York, NY',
    'Los Angeles, CA',
    'Houston, TX',
    'Miami, FL'
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-white'}`}>
      {/* Top Bar */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-green-600">GROUPON</h1>
          </Link>

          {/* Location Picker - Desktop */}
          <div className="hidden md:flex items-center ml-6 relative">
            <button 
              className="flex items-center text-sm text-gray-700 hover:text-green-600"
              onClick={() => setIsLocationMenuOpen(!isLocationMenuOpen)}
            >
              <MapPin className="h-4 w-4 mr-1" />
              <span>{currentLocation}</span>
              <ChevronDown className="h-4 w-4 ml-1" />
            </button>
            
            {isLocationMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-2 text-xs text-gray-500">POPULAR LOCATIONS</div>
                {popularLocations.map((location, index) => (
                  <button
                    key={index}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-green-600"
                    onClick={() => {
                      setCurrentLocation(location);
                      setIsLocationMenuOpen(false);
                    }}
                  >
                    {location}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder={`Search for deals in ${currentLocation}`}
                className="w-full py-2 px-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <Search className="h-5 w-5 text-gray-400 absolute right-3 top-2.5" />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <button className="hidden md:flex items-center space-x-1 text-gray-700 hover:text-green-600">
              <User className="h-5 w-5" />
              <span className="text-sm">Sign In</span>
            </button>
            <button className="p-2 text-gray-700 hover:text-green-600 relative">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </button>
            <button 
              className="p-2 text-gray-700 hover:text-green-600 md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search and Location */}
        <div className="mt-3 md:hidden">
          <div className="flex items-center mb-2">
            <button className="flex items-center text-sm text-gray-700 mr-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{currentLocation}</span>
            </button>
          </div>
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search for deals..."
              className="w-full py-2 px-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <Search className="h-5 w-5 text-gray-400 absolute right-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <nav className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto py-3 hide-scrollbar">
            <div className="flex space-x-6 whitespace-nowrap">
              {categories.map((category, index) => (
                <Link
                  key={index}
                  href="#"
                  className={`px-2 py-1 text-sm font-medium transition-colors ${index === 0 ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600 hover:text-green-600'}`}
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-4 px-4 shadow-inner">
          <div className="flex flex-col space-y-4">
            <Link 
              href="#"
              className="flex items-center space-x-3 text-gray-700 hover:text-green-600 px-2 py-1"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User className="h-5 w-5" />
              <span>Sign In</span>
            </Link>
            <Link 
              href="#"
              className="flex items-center space-x-3 text-gray-700 hover:text-green-600 px-2 py-1"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <ShoppingBag className="h-5 w-5" />
              <span>My Deals</span>
              <span className="ml-auto bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </Link>
            <div className="border-t border-gray-200 pt-3">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">Popular Locations</h4>
              <div className="space-y-2">
                {popularLocations.map((location, index) => (
                  <button
                    key={index}
                    className={`block w-full text-left px-2 py-1 text-sm ${currentLocation === location ? 'text-green-600' : 'text-gray-700'}`}
                    onClick={() => {
                      setCurrentLocation(location);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}