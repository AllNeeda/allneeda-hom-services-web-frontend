// components/home-services/professional-profile/components/sections/ServicesSection.tsx
import { forwardRef, useMemo } from "react";

interface ServicesSectionProps {
  specializations?: string[];  // Keep for backward compatibility
  services?: Array<{ name: string; description?: string; price?: number }>; // New prop
}

const ServicesSection = forwardRef<HTMLDivElement, ServicesSectionProps>(
  ({ specializations = [], services = [] }, ref) => {
    const defaultServices = [
      "Standard Cleaning",
      "Deep Cleaning",
      "Moving out Cleaning",
      "Vacation rental Cleaning"
    ];

    // Decide which data to use: services first, then specializations, then defaults
    const displayItems = useMemo(() => {
      if (services.length > 0) {
        // If services are objects, extract names
        return services.map(service => service.name || service?.name || '');
      }
      
      if (specializations.length > 0) {
        return specializations;
      }
      
      return defaultServices;
    }, [services, specializations]);

    return (
      <div ref={ref} className="space-y-4 mt-10">
        <h3 className="text-md font-semibold">Our Services</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {displayItems.map((item, index) => (
            <div 
              key={index} 
              className="border border-gray-200 dark:border-gray-700 p-3 rounded-lg"
            >
              <h4 className="text-sm font-semibold">
                {item}
              </h4>
              {/* If you have service descriptions, you could add them here */}
              {services[index]?.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {services[index]?.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

ServicesSection.displayName = "ServicesSection";

export default ServicesSection;