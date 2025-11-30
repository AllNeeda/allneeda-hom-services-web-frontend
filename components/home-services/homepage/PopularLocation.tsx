"use client";
import { ChevronRight, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const PopularLocation = () => {
  const locations = [
    { id: 1, name: "New York, NY", professionals: 1243 },
    { id: 2, name: "Los Angeles, CA", professionals: 982 },
    { id: 3, name: "Chicago, IL", professionals: 756 },
    { id: 4, name: "Houston, TX", professionals: 632 },
    { id: 5, name: "Phoenix, AZ", professionals: 521 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="my-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Service{" "}
              <span className="text-sky-600 dark:text-sky-400">Locations</span>
            </h2>
          </div>

          <div className="flex items-center">
            <Link
              href="/home-services/all-locations"
              className="inline-flex items-center text-sm font-medium text-sky-600 dark:text-sky-400 hover:underline"
            >
              View all locations
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3"
        >
          {locations.map((location) => (
            <motion.div
              key={location.id}
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              className="group relative rounded-lg bg-white dark:bg-gray-800 p-3 shadow-xs hover:shadow-sm transition-all duration-200 border border-gray-200 dark:border-gray-700"
            >
              <Link
                href={`/home-services?location=${encodeURIComponent(
                  location.name
                )}`}
                className="flex flex-col"
              >
                <div className="flex items-center">
                  <div className="p-1.5 bg-sky-100/50 dark:bg-sky-900/20 rounded-md">
                    <MapPin className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                  </div>
                  <h3 className="ml-2 text-sm font-medium text-gray-900 dark:text-white truncate">
                    {location.name}
                  </h3>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {location.professionals.toLocaleString()} pros
                  </span>
                  <ChevronRight className="h-3 w-3 text-gray-400 group-hover:text-sky-500 transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PopularLocation;
