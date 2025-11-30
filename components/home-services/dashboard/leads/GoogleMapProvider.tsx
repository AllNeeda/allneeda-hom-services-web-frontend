// components/GoogleMapsProvider.tsx
"use client";

import React, { createContext, useContext } from "react";
import { useLoadScript } from "@react-google-maps/api";

const libraries = ["drawing", "places"] as (
  | "drawing"
  | "places"
)[];

interface GoogleMapsContextValue {
  isLoaded: boolean;
  loadError?: Error | null;
}

const GoogleMapsContext = createContext<GoogleMapsContextValue | null>(null);

export const GoogleMapsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
    id: "google-maps-script-loader", // consistent ID to avoid duplicates
  });

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </GoogleMapsContext.Provider>
  );
};

export const useGoogleMaps = () => {
  const context = useContext(GoogleMapsContext);
  if (!context) {
    throw new Error("useGoogleMaps must be used within a GoogleMapsProvider");
  }
  return context;
};
