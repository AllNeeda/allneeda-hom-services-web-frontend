'use client';

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function NotFound() {
  const router = useRouter();

  const floatingContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const floatingItem = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <>
      <Head>
        <title>Page Not Found | 404 Error</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
      </Head>

      <div className="relative min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <motion.div
          className="w-full max-w-xl mx-auto text-center"
          initial="hidden"
          animate="show"
          variants={floatingContainer}
        >
          {/* 404 Title */}
          <motion.div className="relative mb-6 md:mb-8" variants={floatingItem}>
            <span className="text-[#0077B6] text-7xl md:text-8xl font-bold opacity-10 select-none">
              404
            </span>
            <motion.h1
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl md:text-3xl font-semibold text-gray-800"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 100,
                damping: 10,
                delay: 0.5,
              }}
            >
              Page Not Found
            </motion.h1>
          </motion.div>

          {/* Small message */}
          <motion.p
            className="text-gray-600 text-sm md:text-base mb-4 md:mb-5 leading-relaxed max-w-md mx-auto"
            variants={floatingItem}
          >
            This page might have been moved, deleted, or never existed in the first place.
          </motion.p>

          {/* Search bar */}
          <motion.div className="mb-8 max-w-sm mx-auto" variants={floatingItem}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search something..."
                className="w-full px-4 py-2.5 pr-10 rounded-md border border-gray-300 focus:border-[#0077B6] focus:ring-2 focus:ring-[#0077B6]/50 text-sm shadow-sm"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#0077B6] hover:text-[#0065a3]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-3 mb-10"
            variants={floatingItem}
          >
            <motion.button
              onClick={() => router.back()}
              className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Go Back
            </motion.button>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/"
                className="px-4 py-2 text-sm bg-[#0077B6] rounded-md text-white hover:bg-[#0065a3] transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Return Home
              </Link>
            </motion.div>
          </motion.div>

          {/* Help Section */}
          <motion.div
            className="mt-8 pt-5 border-t border-gray-200"
            variants={floatingItem}
          >
            <p className="text-gray-500 mb-2 text-xs md:text-sm">Still need help?</p>
            <motion.div whileHover={{ x: 3 }}>
              <Link
                href="/contact"
                className="text-sm text-[#0077B6] font-medium hover:underline inline-flex items-center"
              >
                Contact Support
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          className="absolute bottom-4 w-full text-center text-gray-400 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          &copy; {new Date().getFullYear()} Servicyee Development Team. All rights reserved.
        </motion.footer>
      </div>
    </>
  );
}
