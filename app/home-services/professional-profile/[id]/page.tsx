// professionalDetails/page.tsx
"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { use } from "react";
import Breadcrumbs from "@/components/home-services/homepage/Breadcrumbs";

// Import components
import PhotosSection from "@/components/home-services/homepage/professional/PhotosSection";
import ProfileHeader from "@/components/home-services/homepage/professional/ProfileHeader";
import ServicesSection from "@/components/home-services/homepage/professional/ServicesSection";
import AboutSection from "@/components/home-services/homepage/professional/AboutSection";
import ProfileTabs from "@/components/home-services/homepage/professional/ProfileTabs";
import CredentialsSection from "@/components/home-services/homepage/professional/CredentialsSection";
import ReviewsSection from "@/components/home-services/homepage/professional/ReviewsSection";
import FAQsSection from "@/components/home-services/homepage/professional/FAQsSection";
import Sidebar from "@/components/home-services/homepage/professional/Sidebar";

// Import hooks - only need this one now
import { useProfessionalDetails } from "@/hooks/useProfessional";
import GlobalLoader from "@/components/ui/global-loader";

export default function ProfessionalProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  
  // Single API call for all professional details
 
  const { 
    data: professionalData, 
    isLoading, 
    isError,
    error 
  } = useProfessionalDetails(id);

  console.log("ProfessionalDetails: ", professionalData);

  // Extract data from the response
  const professionalDetails = professionalData?.data || {};
  const {
    professional,
    media = [],
    reviews = [],
    services = [],
    faqs = []
  } = professionalDetails;

  // State and refs
  const [activeTab, setActiveTab] = useState<string>("about");
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Refs
  const aboutRef = useRef<HTMLDivElement>(null);
  const serviceRef = useRef<HTMLDivElement>(null);
  const credentialRef = useRef<HTMLDivElement>(null);
  const photosRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const faqsRef = useRef<HTMLDivElement>(null);

  const tabs = useMemo(
    () => [
      { id: "about", name: "About", ref: aboutRef },
      { id: "service", name: "Service", ref: serviceRef },
      { id: "photo", name: "Photos", ref: photosRef },
      { id: "credential", name: "Credentials", ref: credentialRef },
      { id: "reviews", name: "Reviews", ref: reviewsRef },
      { id: "faqs", name: "FAQs", ref: faqsRef },
    ],
    []
  );

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      tabs.forEach((tab) => {
        if (tab.ref?.current) {
          const element = tab.ref.current;
          const elementTop = element.offsetTop;
          const elementBottom = elementTop + element.offsetHeight;
          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            setActiveTab(tab.id);
          }
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tabs]);

  const scrollTo = (tabId: string) => {
    setActiveTab(tabId);
    const tab = tabs.find((t) => t.id === tabId);
    if (tab?.ref?.current) {
      tab.ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <GlobalLoader/>
    );
  }

  // Error state
  if (isError || !professionalData?.success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">
            Failed to load professional profile
          </h2>
          <p className="text-gray-600 mt-2">
            {error?.message || professionalData?.error || "Please try refreshing the page"}
          </p>
        </div>
      </div>
    );
  }

  // No professional found
  if (!professional) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">
            Professional not found
          </h2>
          <p className="text-gray-600 mt-2">
            The professional you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-300 dark:bg-gray-900 dark:text-gray-100 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs
          paths={[
            { name: "Home", href: "/" },
            { name: "Home Services", href: "/home-services" },
            {
              name: "Professionals",
              href: "/home-services/professional-service/4",
            },
            { name: professional.business_name || "Profile" },
          ]}
        />
        
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          {/* Main Content */}
          <div className="flex-1 p-2 sm:p-4 order-2 lg:order-1">
            <ProfileHeader professional={professional} />
            
            <ProfileTabs 
              activeTab={activeTab} 
              scrollTo={scrollTo} 
              tabs={tabs}
            />
            
            {/* Tab Content */}
            <div className="mt-6">
              <AboutSection 
                ref={aboutRef} 
                professional={professional} 
              />
              
              <ServicesSection 
                ref={serviceRef} 
                // Pass services data instead of specializations
                services={services} 
                // If you still need specializations, use professional.specializations
                specializations={professional.specializations || []}
              />
              
              <CredentialsSection 
                ref={credentialRef} 
                // If credentials are in professional object
                credentials={professional.credentials || []}
              />
              
              <PhotosSection 
                ref={photosRef} 
                // Pass media as-is (array of objects)
                media={media}
                // Pass portfolio if you have it
                portfolio={professional.portfolio || []}
                currentPhotoIndex={currentPhotoIndex}
                onPhotoIndexChange={setCurrentPhotoIndex}
              />
              
              <ReviewsSection 
                ref={reviewsRef} 
                // Pass reviews data
                reviews={reviews}
                // Keep existing stats from professional object
                rating={professional.rating_avg}
                reviewCount={professional.total_review}
                totalHire={professional.total_hire}
              />
              
              <FAQsSection 
                ref={faqsRef} 
                // Use faqs from the API response
                faqs={faqs} 
              />
            </div>
          </div>

          {/* Sidebar */}
          <Sidebar 
            professional={professional} 
            // Pass additional data if needed by sidebar
            servicesCount={services.length}
            reviewsCount={reviews.length}
          />
        </div>
      </div>
    </div>
  );
}