"use client";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Breadcrumbs from "@/components/home-services/homepage/Breadcrumbs";
import { ServiceCard } from "@/components/home-services/homepage/ServiceCard";
import { SubcategoryWithServicesType } from "@/types/service/services";
import { useSubcategoryServices } from "@/hooks/useHomeServices";
import { CategoriesSkeleton } from "@/components/ui/skeletonLoader";

export default function ExploreCategoriesPage() {
  const [activeCategory, setActiveCategory] = useState<string>("");
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Use React Query for data fetching
  const {
    data: subcategoriesData,
    isLoading,
    error,
  } = useSubcategoryServices();

  const subcategoriesServices: SubcategoryWithServicesType[] =
    subcategoriesData?.data || subcategoriesData || [];

  // Set category refs after data is loaded and DOM is rendered
  useEffect(() => {
    if (subcategoriesServices.length > 0) {
      // Set the first category as active by default
      setActiveCategory(subcategoriesServices[0]._id);

      // Use setTimeout to ensure DOM is rendered before accessing elements
      setTimeout(() => {
        subcategoriesServices.forEach((category) => {
          const element = document.getElementById(`category-${category._id}`);
          if (element) {
            categoryRefs.current[category._id] = element as HTMLDivElement;
          }
        });
      }, 100);
    }
  }, [subcategoriesServices]);

  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = categoryRefs.current[categoryId];
    if (element) {
      const elementTop = element.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: elementTop - 100, // Offset for sticky header
        behavior: "smooth",
      });
    }
  };

  // Update active category on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (subcategoriesServices.length === 0) return;

      const categoryElements = subcategoriesServices
        .map((category) => ({
          id: category._id,
          element: categoryRefs.current[category._id],
        }))
        .filter((item) => item.element);

      if (categoryElements.length === 0) return;

      const scrollPosition = window.scrollY + 100; // Offset for sticky header

      for (let i = categoryElements.length - 1; i >= 0; i--) {
        const category = categoryElements[i];
        if (category.element && category.element.offsetTop <= scrollPosition) {
          setActiveCategory(category.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [subcategoriesServices]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading categories...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-500">
          Error loading categories. Please try again.
        </div>
      </div>
    );
  }

  // Empty state
  if (subcategoriesServices.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">No categories available.</div>
      </div>
    );
  }
  // skeleton loader
  if (isLoading) {
    return <CategoriesSkeleton />;
  }

  return (
    <div className="min-h-screen transition-colors duration-300 dark:bg-gray-900 dark:text-gray-100 bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs
          paths={[
            { name: "Home", href: "/" },
            { name: "Home Services", href: "/home-services" },
            { name: "Explore Categories" },
          ]}
        />

        <div className="mt-8">
          <h1 className="text-2xl font-bold mb-6">Professional Services</h1>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Categories List - Left Side */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:w-1/4"
            >
              <div className="sticky top-24">
                <h2 className="text-lg font-semibold mb-4">Categories</h2>
                <div className="space-y-2">
                  {subcategoriesServices.map((category) => (
                    <motion.button
                      key={category._id}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => scrollToCategory(category._id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        activeCategory === category._id
                          ? "bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-200"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      {category.name}
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        ({category.services?.length || 0})
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Services Display - Right Side */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="lg:w-3/4"
            >
              <div className="space-y-12">
                {subcategoriesServices.map((category) => (
                  <div
                    key={category._id}
                    id={`category-${category._id}`}
                    className="scroll-mt-20"
                    ref={(el: HTMLDivElement | null) => {
                      if (el) {
                        categoryRefs.current[category._id] = el;
                      }
                    }}
                  >
                    <motion.h2
                      className="text-xl font-bold mb-6 pb-2 border-b border-gray-200 dark:border-gray-700"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true, margin: "-50px" }}
                    >
                      {category.name}
                    </motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {category.services && category.services.length > 0 ? (
                        category.services.map((service) => (
                          <motion.div
                            key={service._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            viewport={{ once: true, margin: "-50px" }}
                          >
                            <ServiceCard
                              id={service._id}
                              slug={service.slug}
                              title={service.name}
                              text={service.description}
                              season={"all"}
                              imageUrl={service.image_url}
                            />
                          </motion.div>
                        ))
                      ) : (
                        <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                          No services available in this category
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
