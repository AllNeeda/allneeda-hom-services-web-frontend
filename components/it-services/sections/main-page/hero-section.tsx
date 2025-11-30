'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ChevronDown, MapPin} from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

// Category data
const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'wordpress', label: 'WordPress Development' },
  { value: 'custom-web', label: 'Custom Websites Development' },
  { value: 'website-dev', label: 'Website Development' },
  { value: 'software-dev', label: 'Software Development' },
  { value: 'web-app', label: 'Web Application Development' },
  { value: 'mobile-dev', label: 'Mobile Development' },
  { value: 'ui-ux', label: 'UI/UX Design' },
  { value: 'seo', label: 'SEO Services' },
  { value: 'digital-marketing', label: 'Digital Marketing' },
];

// Location data
const locations = [
  'Current Location',
  'New York, NY',
  'Los Angeles, CA',
  'Chicago, IL',
  'Houston, TX',
  'Phoenix, AZ',
  'Philadelphia, PA',
  'San Antonio, TX',
  'San Diego, CA', 
  'Dallas, TX',
];

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('Current Location');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const router = useRouter();
  const locationRef = useRef<HTMLDivElement>(null);

  // Handle click outside for location dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('query', searchQuery);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (selectedLocation !== 'Current Location') params.set('location', selectedLocation);
    // if (showMapFilter) params.set('radius', radius.toString());
    
    router.push(`/it-services/search/?${params.toString()}`);
  };

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setShowLocationDropdown(false);
  };

  return (
    <section className="relative bg-[#204c3f] text-white overflow-hidden min-h-[40vh] sm:min-h-[50vh] z-0 ">
      {/* Topographic contour lines background */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="topographic" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              {/* Contour lines */}
              <path d="M0,20 Q25,15 50,20 T100,20" stroke="white" strokeWidth="1.3" fill="none" opacity="0.3"/>
              <path d="M0,40 Q25,35 50,40 T100,40" stroke="white" strokeWidth="1.3" fill="none" opacity="0.3"/>
              <path d="M0,60 Q25,55 50,60 T100,60" stroke="white" strokeWidth="1.3" fill="none" opacity="0.3"/>
              <path d="M0,80 Q25,75 50,80 T100,80" stroke="white" strokeWidth="1.3" fill="none" opacity="0.3"/>
              
              {/* Vertical contour lines */}
              <path d="M20,0 Q15,25 20,50 T20,100" stroke="white" strokeWidth="1.3" fill="none" opacity="0.3"/>
              <path d="M40,0 Q35,25 40,50 T40,100" stroke="white" strokeWidth="1.3" fill="none" opacity="0.3"/>
              <path d="M60,0 Q55,25 60,50 T60,100" stroke="white" strokeWidth="1.3" fill="none" opacity="0.3"/>
              <path d="M80,0 Q75,25 80,50 T80,100" stroke="white" strokeWidth="1.3" fill="none" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#topographic)" />
        </svg>
      </div>
      
      {/* Additional background pattern overlay */}
      <div className="absolute inset-0 opacity-10 hidden md:block">
        <div className="absolute top-20 left-10 w-32 h-32 border border-white/20 rounded-full"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 border border-white/20 rounded-full"></div>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 items-center">
          {/* Content */}
          <div className="space-y-6 sm:space-y-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              Find the perfect freelance <br /> services for your business.
            </h1>
            
            <p className="text-base sm:text-lg text-white/90 max-w-xl">
              Work with talented people at the most affordable price to get the most out of your time and cost.
            </p>

            {/* Enhanced Search Bar with Filters */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                {/* Main Search Row */}
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search Input */}
                  <div className="flex-1 relative group">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    <Input
                      type="text"
                      placeholder="What service are you looking for?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="
                        pl-10 pr-4 py-6
                        border-2 border-gray-200
                        group-hover:border-[#1dbf73] group-hover:shadow-md
                        focus:border-[#1dbf73] focus:ring-2 focus:ring-[#1dbf73]
                        transition-all duration-200
                        text-gray-900 placeholder-gray-500
                        rounded-lg outline-none
                        bg-white
                      "
                    />
                  </div>

                  {/* Category Filter */}
                  <div className="w-full lg:w-64">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild >
                        <Button 
                          variant="outline" 
                          className="w-full justify-between py-6 px-4 text-black border-gray-300  hover:text-black dark:hover:text-black hover:border-[#1dbf73] group-hover:shadow-md"
                        >
                          {categories.find(cat => cat.value === selectedCategory)?.label || 'All Categories'}
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-80">
                        <DropdownMenuLabel>Category</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
                          {categories.map((category) => (
                            <DropdownMenuRadioItem key={category.value} value={category.value}>
                              {category.label}
                            </DropdownMenuRadioItem>
                          ))}
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Location Filter */}
                  <div className="w-full lg:w-64 relative" ref={locationRef}>
                    <Button
                      variant="outline"
                      className="w-full justify-between py-6 px-4 text-black border-gray-300  hover:text-black hover:border-[#1dbf73] group-hover:shadow-md"
                      onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                    >
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-[#1dbf73]" />
                        <span className="truncate">{selectedLocation}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showLocationDropdown ? 'rotate-180' : ''}`} />
                    </Button>
                    
                    {showLocationDropdown && (
                      <div className="absolute z-30 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        <div className="px-4 py-2 text-sm font-medium text-gray-900 border-b border-gray-100">
                          Select Location
                        </div>
                        {locations.map((location) => (
                          <button
                            key={location}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors "
                            onClick={() => handleLocationSelect(location)}
                          >
                            {location}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Search Button */}
                  <Button 
                    onClick={handleSearch}
                    className="bg-[#1dbf73] hover:bg-[#19a463] text-white px-8 py-3 w-full lg:w-auto"
                  >
                    Search
                  </Button>
                </div>

                {/* Filter Options Row */}
                <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-gray-200">
                  {/* Filter Tags */}
                  <div className="flex text-black  items-center gap-2 ml-auto">
                    <span className="text-xs text-gray-500">Quick filters:</span>
                    <Button variant="outline" size="sm" className="text-xs px-3 py-1 h-7">
                      Top Rated
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs px-3 py-1 h-7">
                      Fast Delivery
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs px-3 py-1 h-7">
                      Budget Friendly
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}