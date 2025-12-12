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
import {
  // getServices,
  searchServiceByQuery,
} from "@/app/api/homepage/postServices";

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

interface ServiceData {
  _id: string;
  name: string;
  slug: string;
  subcategory_id: string;
  description: string;
}

interface ServiceWithId {
  id: string;
  name: string;
  slug: string;
}

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
  const [locationData, setLocationData] = useState<{
    city?: string;
    state?: string;
    postcode?: string;
  }>({});

  const [zipCode, setZipCode] = useState("");
  const [serviceQuery, setServiceQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showNoMatchDialog, setShowNoMatchDialog] = useState(false);
  const [suggestedServices, setSuggestedServices] = useState<ServiceWithId[]>(
    []
  );
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [noServiceInZipCode, setNoServiceInZipCode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [results, setResults] = useState<ServiceData[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceWithId[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [serviceSlug, setServiceSlug] = useState("");
  console.log("LOCATION DATA: ", locationData);
  useEffect(() => {
    setIsMounted(true);

    if (location?.city && location?.state) {
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
  }, [location]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const fetchData = async () => {
        if (serviceQuery.trim().length > 0) {
          try {
            const response = await searchServiceByQuery(serviceQuery);
            const services = response?.data || [];
            setResults(services);

            const filtered = services
              .filter((service: ServiceData) =>
                service.name.toLowerCase().includes(serviceQuery.toLowerCase())
              )
              .slice(0, 5)
              .map((service: ServiceData) => ({
                id: service._id,
                name: service.name,
                slug: service.slug,
              }));

            setFilteredServices(filtered);
          } catch (error) {
            console.error("Search error:", error);
            setResults([]);
            setFilteredServices([]);
          }
        } else {
          setResults([]);
          setFilteredServices([]);
        }
      };

      fetchData();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [serviceQuery]);

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

    localStorage.setItem("user_location", JSON.stringify(newLocation));
  };

  const handleSearch = async (selectedService?: ServiceWithId) => {
    setIsLoading(true);
    setError("");
    setShowSuggestions(false);
    setNoServiceInZipCode(false);
    setSuggestedServices([]);

    const searchTerm = selectedService?.name || serviceQuery;
    const serviceId = selectedService?.id || "";
    // console.log("submitted data: ", selectedServiceId, zipCode);

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

    try {
      const exactMatches = results.filter(
        (service) => service.name.toLowerCase() === searchTerm.toLowerCase()
      );

      if (exactMatches.length > 0) {
        const exactServiceId = exactMatches[0]?._id || serviceId;

        sessionStorage.setItem(
          "searchResults",
          JSON.stringify({
            query: searchTerm,
            serviceId: exactServiceId,
            zipCode,
            services: exactMatches.slice(0, 5),
          })
        );
        router.push(
          `/home-services/professional-service/${serviceSlug}?id=${selectedServiceId}&zipcode=${zipCode}`
        );

        setIsLoading(false);
        return;
      }

      const allServiceNames = results.map((service) => service.name);
      const similarServices = allServiceNames
        .map((service) => ({
          service,
          similarity: calculateSimilarity(searchTerm, service),
        }))
        .filter((item) => item.similarity > 0.3)
        .sort((a, b) => b.similarity - a.similarity)
        .map((item) => {
          const matchingService = results.find((s) => s.name === item.service);
          return {
            id: matchingService?._id || "",
            name: item.service,
          };
        })
        .filter((service) => service.id)
        .slice(0, 5);

      if (similarServices.length > 0) {
        const similarWithSlug = similarServices.map((s) => {
          const match = results.find((r) => r.name === s.name);
          return { id: s.id, name: s.name, slug: match?.slug || "" };
        });
        setSuggestedServices(similarWithSlug);
        setNoServiceInZipCode(false);
        setShowNoMatchDialog(true);
      } else {
        setError("No matching services found");
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Search failed:", error);
      setError("Failed to search. Please try again.");
      setIsLoading(false);
    }
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

  const handleServiceSuggestion = (service: ServiceWithId) => {
    setServiceQuery(service.name);
    setShowNoMatchDialog(false);
    handleSearch(service);
  };

  const handleSuggestionClick = (service: ServiceWithId) => {
    // console.log("SELECTED SERVICE: ", service);
    setServiceQuery(service.name);
    setSelectedServiceId(service.id);
    setServiceSlug(service.slug);
    setShowSuggestions(false);
  };

  const defaultLocation = {
    city: "New York",
    state: "NY",
    zipcode: "10001",
  };

  useEffect(() => {
    if (!localStorage.getItem("defaultLocation")) {
      localStorage.setItem("defaultLocation", JSON.stringify(defaultLocation));
    }
  }, []);

  const userDefaultLocation =
    location?.city && location?.state
      ? `${location.city}, ${location.state}`
      : `${defaultLocation.city}, ${defaultLocation.state}`;

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
                handleSearch={() => handleSearch()}
                isLoading={isLoading}
                isCompact={true}
                showSuggestions={showSuggestions}
                setShowSuggestions={setShowSuggestions}
                filteredServices={filteredServices}
                onSuggestionClick={handleSuggestionClick}
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

        <div
          className="w-full relative min-h-[15vh] md:min-h-[40vh] flex items-center justify-center 
                pt-4 pb-5 md:pt-8 md:pb-16"
        >
          <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-4 lg:px-8 h-full flex items-center">
            <div className="flex flex-col items-center text-center gap-4 sm:gap-6 w-full py-6">
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
                  handleSearch={() => handleSearch()}
                  isLoading={isLoading}
                  showSuggestions={showSuggestions}
                  setShowSuggestions={setShowSuggestions}
                  filteredServices={filteredServices}
                  onSuggestionClick={handleSuggestionClick}
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
      </div>
    </>
  );
};

export default TitlePage;
