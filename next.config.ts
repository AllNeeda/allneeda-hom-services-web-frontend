import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',

  images: {
    domains: ['images.unsplash.com', 'images.pexels.com', 'cdn-icons-png.flaticon.com', 'cdn.pixabay.com',
      'commondatastorage.googleapis.com', 'sample-videos.com', 'randomuser.me', 'source.unsplash.com',
      'storyset.com', 'img.freepik.com', 'example.com', 'localhost', 'servicyee-backend.onrender.com'], // allow Storyset/Freepik assets
  },
  // i18n is removed if using App Router

};

export default nextConfig;