/// <reference types="@types/google.maps" />

"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  Circle,
  Autocomplete,
} from "@react-google-maps/api";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useGoogleMaps } from "./GoogleMapProvider";

interface LocationModalProps {
  onClose: () => void;
  onContinue: () => void;
  zip: string;
  milesRadius: number;
  center: { lat: number; lng: number };
}

const LocationModal: React.FC<LocationModalProps> = ({
  onClose,
  onContinue,
  zip,
  milesRadius,
  center: initialCenter,
}) => {
  const [radius, setRadius] = useState(milesRadius);
  const [postalCode, setPostalCode] = useState(zip);
  const [center, setCenter] = useState(initialCenter);
  const url = usePathname();
  const ViewMap = url.includes("home-services/dashboard/leads/leadSetting")
  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { isLoaded } = useGoogleMaps();


  useEffect(() => {
    if (!isLoaded) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: postalCode }, (results, status) => {
      if (
        status === "OK" &&
        results &&
        results.length > 0 &&
        results[0]?.geometry?.location
      ) {
        const location = results[0].geometry.location;
        setCenter({ lat: location.lat(), lng: location.lng() });
      }
    });
  }, [postalCode, isLoaded]);

  const onPlaceChanged = () => {
    if (autoCompleteRef.current !== null) {
      const place = autoCompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        const location = place.geometry.location;
        setCenter({ lat: location.lat(), lng: location.lng() });
        setPostalCode(place.formatted_address || "");
      }
    }
  };

  if (!isLoaded) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 rounded-sm shadow-lg border border-gray-200 dark:border-gray-700 max-w-3xl w-full max-h-[90vh] overflow-y-auto text-[12px] text-gray-700 dark:text-gray-300"
      >
        {/* Header */}
        <div className="relative bg-[#0077B6] text-white p-5 rounded-t-[4px]">
          <h2 className="text-[13px] font-semibold leading-tight">Select a location</h2>
          <p className="text-[11px] opacity-90">Set your preferred area to find new customers</p>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white hover:text-gray-300 focus:outline-none focus:ring-white rounded"
            aria-label="Close modal"
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          {ViewMap && (

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Postcode / City */}
              <div>
                <label className="block text-[11px] font-medium mb-1">
                  Postcode / City
                </label>
                <Autocomplete
                  onLoad={(autocomplete) => {
                    autoCompleteRef.current = autocomplete;
                  }}
                  onPlaceChanged={onPlaceChanged}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="Enter a postcode or city"
                    className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-sm px-3 py-2 text-[12px] focus:ring-[#0077B6] focus:border-[#0077B6]"
                  />
                </Autocomplete>
              </div>

              {/* Distance */}
              <div>
                <label className="block text-[11px] font-medium mb-2">
                  Distance: <span className="font-semibold">{radius} miles</span>
                </label>
                <input
                  type="range"
                  min={5}
                  max={300}
                  step={5}
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-full accent-[#0077B6]"
                />
              </div>
            </div>
          )}
          {/* Map Preview */}
          <div className="h-70 w-full border-t border-b border-gray-200 dark:border-gray-700">
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={center}
              zoom={radius > 100 ? 5 : radius > 100 ? 6 : 7}
              options={{
                disableDefaultUI: true,
                styles: [
                  {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }],
                  },
                ],
              }}
            >
              <Circle
                center={center}
                radius={radius * 1609.34}
                options={{
                  strokeColor: "#0077B6",
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: "#0077B6",
                  fillOpacity: 0.2,
                  clickable: false,
                }}
              />
            </GoogleMap>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 flex justify-between items-center bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-[11px]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Back
          </button>
          <button
            onClick={onContinue}
            className="px-4 py-2 text-white bg-[#0077B6] hover:bg-[#005f8e] rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
