/// <reference types="@types/google.maps" /> 
"use client";

import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, Circle, Autocomplete } from "@react-google-maps/api";
import { X } from "lucide-react";
import { useGoogleMaps } from "./GoogleMapProvider";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Update path according to your project

interface TravelModalProps {
  onClose: () => void;
  onContinue: () => void;
}

const staticData = {
  zip: "Wrexham",
  milesRadius: 10,
  center: { lat: 53.046, lng: -2.9925 },
  travelTime: "30 minutes",
  transportMode: "Driving",
};

const TravelModal: React.FC<TravelModalProps> = ({ onClose, onContinue }) => {
  const [radius] = useState(staticData.milesRadius);
  const [postalCode, setPostalCode] = useState(staticData.zip);
  const [center, setCenter] = useState(staticData.center);
  const [travelTime, setTravelTime] = useState(staticData.travelTime);
  const [transportMode, setTransportMode] = useState(staticData.transportMode);

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
        <div className="relative bg-[#0077B6] text-white p-5 rounded-sm">
          <h2 className="text-[14px] font-semibold leading-tight">Travel Time</h2>
          <p className="mt-1 text-[11px] opacity-90">
            Enter a postcode or city, the maximum time you would spend travelling,
            and the mode of transport you would use.
          </p>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-3 right-3 text-white hover:text-gray-300 focus:outline-none focus:ring-white rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Inputs */}
        <div className="p-5 space-y-4 text-[11px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Postcode Input */}
            <div>
              <label className="block font-medium mb-1">Postcode / City</label>
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
                  placeholder="e.g. Wrexham"
                  className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-sm px-3 py-2 text-[11px] focus:outline-none focus:ring-1 focus:ring-[#0077B6]"
                />
              </Autocomplete>
            </div>

            {/* Travel Time */}
            <div>
              <label className="block font-medium mb-1">Travel time</label>
              <Select value={travelTime} onValueChange={setTravelTime}>
                <SelectTrigger className="w-full text-[11px]">
                  <SelectValue placeholder="Select travel time" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "15 minutes",
                    "30 minutes",
                    "45 minutes",
                    "1 hour",
                    "1.5 hours",
                    "2 hours",
                  ].map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Transport Mode */}
            <div>
              <label className="block font-medium mb-1">Travelling by</label>
              <Select value={transportMode} onValueChange={setTransportMode}>
                <SelectTrigger className="w-full text-[11px]">
                  <SelectValue placeholder="Select transport mode" />
                </SelectTrigger>
                <SelectContent>
                  {["Driving", "Walking", "Cycling", "Public transport"].map(
                    (option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="h-70 w-full border-t border-b border-gray-200 dark:border-gray-700">
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={center}
            zoom={radius > 100 ? 5 : radius > 50 ? 6 : 7}
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

export default TravelModal;
