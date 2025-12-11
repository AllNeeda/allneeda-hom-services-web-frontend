import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'maps.gstatic.com',
        pathname: '/mapfiles/place_api/icons/**',
      },
      {
        protocol: 'https',
        hostname: 'maps.gstatic.com',
        pathname: '**', // Or be more specific if needed
      },
      // Add other Google domains if needed
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'lh4.googleusercontent.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'lh5.googleusercontent.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'lh6.googleusercontent.com',
        pathname: '**',
      },
      // Add your local host for development
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '**',
      },
    ],
    domains: ['images.unsplash.com', 'images.pexels.com', 'cdn-icons-png.flaticon.com', 'cdn.pixabay.com',
      'commondatastorage.googleapis.com', 'sample-videos.com', 'randomuser.me', 'source.unsplash.com',
      'storyset.com', 'img.freepik.com', 'example.com', 'localhost', 'allneeda-hom-services-web-backend.onrender.com'], // allow Storyset/Freepik assets
  },
  // i18n is removed if using App Router
  eslint: {
    ignoreDuringBuilds: true,
  },

};

export default nextConfig;