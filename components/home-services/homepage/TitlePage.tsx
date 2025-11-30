"use client";
import React, { useState, useEffect } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { MapPinHouse, SquareMousePointer } from "lucide-react";
import NoMatchDialog from "@/components/home-services/homepage/titleComponents/NoMatchDialog";
import LocationDialog from "@/components/home-services/homepage/titleComponents/LocationDialog";
import SearchBar from "@/components/home-services/homepage/titleComponents//SearchBar";
import {
  getLocationFromCoords,
  getLocationFromZip,
} from "@/lib/locationService";

// Function to calculate similarity between two strings
const calculateSimilarity = (a: string, b: string): number => {
  const str1 = a.toLowerCase();
  const str2 = b.toLowerCase();

  if (str1.includes(str2)) return 1;
  if (str2.includes(str1)) return 1;

  const set1 = new Set(str1.split(" "));
  const set2 = new Set(str2.split(" "));
  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return intersection.size / union.size;
};
const MOCK_PROFESSIONALS = [
  {
    id: "1",
    company: "John's Plumbing",
    service: "Plumbing",
    rating: 4.8,
    services: ["Pipe Repair", "Leak Fixing", "Faucet Installation"],
    zipCodes: ["90001", "90002", "90003"],
    distance: 1.2,
    guarantee: true,
    employee_count: 24,
    total_hires: 15,
    founded: 2012,
    background_check: true,
    status: "Available",
    description:
      "Licensed plumbing services with 10 years of experience in residential and commercial properties.",
    imageUrl: "/assets/home-service/service (1).jpg",
  },
  {
    id: "2",
    company: "Electric Solutions",
    service: "Electrical",
    rating: 4.5,
    services: ["Wiring", "Outlet Installation", "Circuit Breaker"],
    zipCodes: ["90001", "90005"],
    distance: 0.8,
    guarantee: true,
    employee_count: 18,
    total_hires: 22,
    founded: 2015,
    background_check: true,
    status: "Available",
    description:
      "Certified electricians providing safe and efficient electrical solutions.",
    imageUrl: "/assets/home-service/service (2).jpg",
  },
  {
    id: "3",
    company: "Clean Home Services",
    service: "Cleaning",
    rating: 4.9,
    services: ["Deep Cleaning", "Carpet Cleaning", "Window Washing"],
    zipCodes: ["90002", "90004"],
    distance: 2.5,
    guarantee: true,
    employee_count: 42,
    total_hires: 35,
    founded: 2016,
    background_check: true,
    status: "Available",
    description:
      "Premium cleaning services using eco-friendly products and techniques.",
    imageUrl: "/assets/home-service/service (3).jpg",
  },
  {
    id: "4",
    company: "Quick Fix Handyman",
    service: "Handyman",
    rating: 4.3,
    services: ["Furniture Assembly", "Shelving", "Minor Repairs"],
    zipCodes: ["90001", "90003", "90005"],
    distance: 1.7,
    guarantee: false,
    employee_count: 8,
    total_hires: 12,
    founded: 2019,
    background_check: true,
    status: "Available",
    description:
      "Reliable handyman services for all your home maintenance needs.",
    imageUrl: "/assets/home-service/service (4).jpg",
  },
  {
    id: "5",
    company: "Green Thumb Landscaping",
    service: "Landscaping",
    rating: 4.7,
    services: ["Lawn Care", "Tree Trimming", "Garden Design"],
    zipCodes: ["90002", "90004", "90006"],
    distance: 3.1,
    guarantee: true,
    employee_count: 15,
    total_hires: 28,
    founded: 2014,
    background_check: true,
    status: "Available",
    description:
      "Professional landscaping services creating beautiful outdoor spaces.",
    imageUrl: "/assets/home-service/service (5).jpg",
  },
  {
    id: "6",
    company: "Green World",
    service: "Landscaping",
    rating: 4.7,
    services: ["Lawn Care", "Tree Trimming", "Garden Design"],
    zipCodes: ["90002", "90004", "90006"],
    distance: 3.1,
    guarantee: false,
    employee_count: 12,
    total_hires: 18,
    founded: 2017,
    background_check: true,
    status: "Available",
    description:
      "Sustainable landscaping solutions with native plants and eco-friendly practices.",
    imageUrl: "/assets/home-service/service (1).jpg",
  },
  {
    id: "7",
    company: "Green and Clean Globe",
    service: "Landscaping",
    rating: 4.7,
    services: ["Lawn Care", "Tree Trimming", "Garden Design"],
    zipCodes: ["90002", "90004", "90006"],
    distance: 3.1,
    guarantee: true,
    employee_count: 20,
    total_hires: 32,
    founded: 2013,
    background_check: true,
    status: "Available",
    description:
      "Full-service landscaping and garden maintenance with a focus on sustainability.",
    imageUrl: "/assets/home-service/service (2).jpg",
  },
  {
    id: "8",
    company: "Clark Construction",
    service: "Roofing",
    rating: 4.7,
    services: ["Roof installation", "Roof Repairing", "Roof Maintenance"],
    zipCodes: ["90002", "90004", "90006"],
    distance: 3.1,
    guarantee: true,
    employee_count: 20,
    total_hires: 32,
    founded: 2013,
    background_check: true,
    status: "Available",
    description:
      "Full-service landscaping and garden maintenance with a focus on sustainability.",
    imageUrl: "/assets/home-service/service (5).jpg",
  },
  {
    id: "9",
    company: "Brand Construction",
    service: "Roofing",
    rating: 4.7,
    services: ["Roof installation", "Roof Repairing", "Roof Maintenance"],
    zipCodes: ["90002", "90004", "90006"],
    distance: 3.1,
    guarantee: true,
    employee_count: 20,
    total_hires: 32,
    founded: 2013,
    background_check: true,
    status: "Available",
    description:
      "Full-service landscaping and garden maintenance with a focus on sustainability.",
    imageUrl: "/assets/home-service/service (3).jpg",
  },
];

// Extract all unique services for suggestions
const ALL_SERVICES = Array.from(
  new Set(MOCK_PROFESSIONALS.flatMap((pro) => pro.services))
);

const titleVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 10,
      delay: 0.5,
    },
  },
};
interface TitlePageProps {
  location?: {
    country?: string;
    state?: string;
    city?: string;
    postcode?: string;
  };
}

const TitlePage = ({ location }: TitlePageProps) => {
  const router = useRouter();
  const [userLocation, setUserLocation] = useState<string | null>(null);
  /* eslint-disable no-unused-vars */
  const [locationData, setLocationData] = useState<{
    city?: string;
    state?: string;
    postcode?: string;
  }>({});
  /* eslint-enable no-unused-vars */
  const [zipCode, setZipCode] = useState("");
  const [serviceQuery, setServiceQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showNoMatchDialog, setShowNoMatchDialog] = useState(false);
  const [suggestedServices, setSuggestedServices] = useState<string[]>([]);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [noServiceInZipCode, setNoServiceInZipCode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Filter services based on input
  const filteredServices = ALL_SERVICES.filter((service) =>
    service.toLowerCase().includes(serviceQuery.toLowerCase())
  ).slice(0, 5);

  useEffect(() => {
    setIsMounted(true);

    // Priority: 1. Props location, 2. Local storage, 3. Default
    if (location?.city && location?.state) {
      // Use location from props
      setLocationData({
        city: location.city,
        state: location.state,
        postcode: location.postcode,
      });
      setUserLocation(`${location.city}, ${location.state}`);
      if (location.postcode) {
        setZipCode(location.postcode);
      }
    } else {
      // Fallback to localStorage
      const storedLocation = localStorage.getItem("user_location");
      if (storedLocation) {
        const { city, state, postcode } = JSON.parse(storedLocation);
        setLocationData({ city, state, postcode });
        setUserLocation(`${city}, ${state}`);
        setZipCode(postcode || "");
      }
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location]); // Add location to dependencies

  const updateLocation = (newLocation: {
    city: string;
    state: string;
    postcode?: string;
  }) => {
    setLocationData(newLocation);
    setUserLocation(`${newLocation.city}, ${newLocation.state}`);
    if (newLocation.postcode) {
      setZipCode(newLocation.postcode);
    }

    // Also update localStorage for persistence
    localStorage.setItem("user_location", JSON.stringify(newLocation));
  };

  const handleSearch = (selectedService?: string) => {
    setIsLoading(true);
    setError("");
    setShowSuggestions(false);
    setNoServiceInZipCode(false);
    setSuggestedServices([]);

    const searchTerm = selectedService || serviceQuery;

    // Validate inputs
    if (!searchTerm.trim()) {
      setError("Please enter a service");
      setIsLoading(false);
      return;
    }

    if (!zipCode.trim()) {
      setError("Please enter a zip code");
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      // 1. First check zip code validity
      const validZipCode = MOCK_PROFESSIONALS.some((pro) =>
        pro.zipCodes.includes(zipCode)
      );

      if (!validZipCode) {
        setNoServiceInZipCode(true);
        setShowNoMatchDialog(true);
        setIsLoading(false);
        return;
      }

      // 2. Check for exact service matches in this zip code
      const exactMatches = MOCK_PROFESSIONALS.filter(
        (pro) =>
          pro.zipCodes.includes(zipCode) &&
          pro.services.some((s) => s.toLowerCase() === searchTerm.toLowerCase())
      );

      if (exactMatches.length > 0) {
        // Found exact matches - proceed to results
        sessionStorage.setItem(
          "searchResults",
          JSON.stringify({
            query: searchTerm,
            zipCode,
            professionals: exactMatches.slice(0, 5),
          })
        );
        router.push(
          `/home-services/search?query=${encodeURIComponent(
            searchTerm
          )}&zip=${encodeURIComponent(zipCode)}`
        );
        setIsLoading(false);
        return;
      }

      // 3. No exact matches - find similar services
      const similarServices = ALL_SERVICES.map((service) => ({
        service,
        similarity: calculateSimilarity(searchTerm, service),
      }))
        .filter((item) => item.similarity > 0.3)
        .sort((a, b) => b.similarity - a.similarity)
        .map((item) => item.service)
        .slice(0, 5);

      if (similarServices.length > 0) {
        setSuggestedServices(similarServices);
        setNoServiceInZipCode(false);
        setShowNoMatchDialog(true);
      } else {
        setError("No matching services found");
      }

      setIsLoading(false);
    }, 1000);
  };

  const handleZipCodeChange = (zip: string) => {
    setZipCode(zip);
    setError("");
  };

  const setCurrentLocation = async () => {
    setIsLoading(true);
    setError("");

    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const locationData = await getLocationFromCoords(latitude, longitude);

          const newLocation = {
            city: locationData.city,
            state: locationData.state,
            postcode: locationData.postcode,
          };

          updateLocation(newLocation);
          setIsLocationDialogOpen(false);
        } catch {
          setError("Unable to fetch location details");
        } finally {
          setIsLoading(false);
        }
      },
      () => {
        setError("Location access denied");
        setIsLoading(false);
      }
    );
  };

  const handleZipCodeLookup = async (zip: string) => {
    if (!zip || zip.length < 4) return;

    setIsLoading(true);
    setError("");

    try {
      const locationData = await getLocationFromZip(zip);
      const newLocation = {
        city: locationData.city,
        state: locationData.state,
        postcode: zip,
      };

      updateLocation(newLocation);
    } catch {
      setError("Invalid ZIP code or no location found");
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceSuggestion = (service: string) => {
    setServiceQuery(service);
    setShowNoMatchDialog(false);
    handleSearch(service);
  };
  //default location fallback
  const defaultLocation = {
    city: "New York",
    state: "NY",
    zipcode: "10001",
  };
  // store it in local storage for access (avoid overwriting if already set)
  if (!localStorage.getItem("defaultLocation")) {
    localStorage.setItem("defaultLocation", JSON.stringify(defaultLocation));
  }
  // get default location from localStorage
  // const storedDefaultLocationRaw = localStorage.getItem("defaultLocation");
  // const storedLocation = storedDefaultLocationRaw
  //   ? JSON.parse(storedDefaultLocationRaw)
  //   : null;

  // Use prop location as fallback for default display
  const userDefaultLocation =
    location?.city && location?.state
      ? `${location.city}, ${location.state}`
      : `${defaultLocation.city}, ${defaultLocation.state}`;

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return (
      <div className="w-full relative min-h-[15vh] md:min-h-[40vh] flex items-center justify-center pt-4 pb-5 md:pt-8 md:pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-4 lg:px-8 h-full flex items-center justify-center">
          <div className="animate-pulse text-gray-800 dark:text-gray-100 text-xl">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <NoMatchDialog
        open={showNoMatchDialog}
        onOpenChange={setShowNoMatchDialog}
        suggestedServices={suggestedServices}
        onServiceSelect={handleServiceSuggestion}
        noServiceInZipCode={noServiceInZipCode}
        zipCode={zipCode}
      />
      <LocationDialog
        open={isLocationDialogOpen}
        onOpenChange={setIsLocationDialogOpen}
        zipCode={zipCode}
        onZipCodeChange={(zip) => {
          handleZipCodeChange(zip);
          handleZipCodeLookup(zip);
        }}
        onSetCurrentLocation={setCurrentLocation}
        isLoading={isLoading}
        error={error}
      />

      {/* Persistent Search Bar */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-md z-50 py-3 px-4 border-b border-gray-200 dark:border-gray-700"
          >
            <div className="max-w-6xl mx-auto">
              <SearchBar
                serviceQuery={serviceQuery}
                setServiceQuery={setServiceQuery}
                zipCode={zipCode}
                setZipCode={setZipCode}
                handleSearch={handleSearch}
                isLoading={isLoading}
                isCompact={true}
                showSuggestions={showSuggestions}
                setShowSuggestions={setShowSuggestions}
                filteredServices={filteredServices}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <div
        className="w-full relative min-h-[15vh] md:min-h-[40vh] flex items-center justify-center 
                pt-4 pb-5 md:pt-8 md:pb-16"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Moving gradient background - different for light/dark */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-50 via-teal-50 to-indigo-50 
                dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
            style={{
              backgroundSize: "200% 200%",
            }}
          />

          {/* Animated floating service icons - different opacity for light/dark */}
          {["🔧", "🚿", "🔨", "🧹", "💡", "🔌", "🚪", "🛠️"].map(
            (icon, index) => (
              <motion.div
                key={index}
                className="absolute text-5xl opacity-60 dark:opacity-60 dark:text-gray-500"
                initial={{
                  x: Math.random() * 100,
                  y: Math.random() * 100,
                  rotate: Math.random() * 360,
                }}
                animate={{
                  x: [null, Math.random() * 100],
                  y: [null, Math.random() * 100],
                  rotate: [null, Math.random() * 360],
                }}
                transition={{
                  duration: 20 + Math.random() * 20,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "linear",
                }}
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: `${10 + Math.random() * 80}%`,
                }}
              >
                {icon}
              </motion.div>
            )
          )}

          {/* Subtle grid pattern - different color for light/dark */}
          <div
            className="absolute inset-0 
                  bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] 
                  dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] 
                  bg-[size:24px_24px]"
          />

          {/* Pulsing circles - different colors for light/dark */}
          <motion.div
            className="absolute rounded-full bg-blue-100 dark:bg-blue-900/20"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              width: "300px",
              height: "300px",
              top: "20%",
              left: "10%",
            }}
          />
          <motion.div
            className="absolute rounded-full bg-teal-100 dark:bg-teal-900/20"
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            style={{
              width: "400px",
              height: "400px",
              bottom: "10%",
              right: "15%",
            }}
          />

          {/* Additional dark mode elements */}
          <motion.div
            className="absolute rounded-full bg-indigo-100 dark:bg-indigo-900/15"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            style={{
              width: "250px",
              height: "250px",
              top: "60%",
              left: "70%",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-4 lg:px-8 h-full flex items-center">
          <div className="flex flex-col items-center text-center gap-4 sm:gap-6 w-full py-6">
            {/* Title - Reduced gap and padding */}
            <motion.div
              variants={titleVariants}
              initial="hidden"
              animate="show"
              className="text-gray-800 dark:text-gray-100 w-full"
            >
              <motion.h1
                className="text-2xl sm:text-xl md:text-4xl lg:text-4xl font-bold leading-tight px-2"
                whileHover={{
                  x: 5,
                  transition: { type: "spring", stiffness: 300 },
                }}
              >
                <div className="flex flex-col">
                  <span>Find the Best Home Service in</span>
                  <button
                    onClick={() => setIsLocationDialogOpen(true)}
                    className="cursor-pointer focus-visible:outline-none border-b-2 border-dashed border-gray-800 dark:border-gray-300 self-center mt-2 sm:mt-3"
                  >
                    {userLocation ? (
                      <span>{userLocation} </span>
                    ) : (
                      <span className="flex flex-row gap-2 justify-center items-center">
                        <span>{userDefaultLocation}</span>
                        <SquareMousePointer className="w-5 h-5 sm:w-6 sm:h-6" />
                      </span>
                    )}
                    <MapPinHouse
                      className="inline p-1 rounded bg-sky-200 dark:bg-sky-900 text-sky-600 dark:text-sky-500 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-900 dark:hover:text-white duration-500 transition"
                      size={32}
                    />
                  </button>
                </div>
              </motion.h1>
            </motion.div>

            {/* Search Box - Hero Version */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full max-w-3xl px-4"
            >
              <SearchBar
                serviceQuery={serviceQuery}
                setServiceQuery={setServiceQuery}
                zipCode={zipCode}
                setZipCode={handleZipCodeChange}
                handleSearch={handleSearch}
                isLoading={isLoading}
                showSuggestions={showSuggestions}
                setShowSuggestions={setShowSuggestions}
                filteredServices={filteredServices}
              />
              {error && (
                <p className="text-sm text-red-500 dark:text-red-400 mt-2">
                  {error}
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TitlePage;
