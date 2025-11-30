/// <reference types="@types/google.maps" />
"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  GoogleMap,
  useLoadScript,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import { Loader2 } from "lucide-react";
import { ProgressBar } from "./ProgressBar";
import { useProfessionalReview, useSaveLocation } from "@/hooks/RegisterPro/useRegister";
import { getAccessToken } from "@/app/api/axios";
import GlobalLoader from "@/components/ui/global-loader";

const ONBOARDING_STEPS = [
  { id: 1, name: "Profile" },
  { id: 2, name: "Reviews" },
  { id: 3, name: "Preferences" },
  { id: 4, name: "Location" },
  { id: 5, name: "Payment" },
  { id: 6, name: "Background" },
];
const containerStyle = { width: "100%", height: "400px" };
const TAB_OPTIONS = [
  { label: "Select by Distance", value: "distance" },
  { label: "Advanced", value: "advanced" },
];
const milesToMeters = (miles: number) => miles * 1609.34;
const DEFAULT_CENTER = { lat: 0, lng: 0 };
const DEFAULT_ZOOM = 2;

const Map = () => {
  const router = useRouter();
  const token = getAccessToken() || "";
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const circleRef = useRef<google.maps.Circle | null>(null);
  const [professionalId, setProfessionalId] = useState<string | null>(null);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("distance");
  const [radiusMiles, setRadiusMiles] = useState(10);
  const [currentStep] = useState(4);
  const [center, setCenter] = useState<{ lat: number; lng: number }>(DEFAULT_CENTER);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    city?: string;
    state?: string;
    zip?: string;
  } | null>(null);
  const [zoom] = useState<number>(DEFAULT_ZOOM);
  const [locationError, setLocationError] = useState<string>("");
  const [isGeolocationAllowed, setIsGeolocationAllowed] = useState<boolean | null>(null);
  const saveLocationMutation = useSaveLocation(token);
  const {
    data: professionalData,
    isLoading: isLoadingProfessionalData,
    error: professionalError,
  } = useProfessionalReview(token);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) throw new Error('Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY');
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: ['places'],
  });
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);
  useEffect(() => {
    if (professionalData) {
      try {
        const professional = professionalData.professional || professionalData;
        const proId = professional?.professional?._id || professional?.id;
        const serviceAnswers = professional?.serviceAnswers || professional?.services || [];
        const servId = serviceAnswers[0]?.service_id || serviceAnswers[0]?.id;

        if (proId) {
          setProfessionalId(proId);
        } else {
          toast.error("Professional ID not found. Please complete previous steps.");
        }

        if (servId) {
          setServiceId(servId);
        }
      } catch (error) {
        toast.error(`Error parsing professional data.${error}`);
      }
    }
  }, [professionalData]);
  useEffect(() => {
    if (professionalError) {
      toast.error("Failed to load professional data. Please complete previous steps.");
    }
  }, [professionalError]);
  useEffect(() => {
    if (mapRef.current && selectedLocation && isLoaded) {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend({ lat: selectedLocation.lat, lng: selectedLocation.lng });

      const circleBounds = new google.maps.Circle({
        center: { lat: selectedLocation.lat, lng: selectedLocation.lng },
        radius: milesToMeters(radiusMiles),
      }).getBounds();
      if (circleBounds) bounds.union(circleBounds);
      mapRef.current.fitBounds(bounds);
    }
  }, [radiusMiles, selectedLocation, isLoaded]);
  useEffect(() => {
    if (!mapRef.current || !selectedLocation || !isLoaded) return;

    if (circleRef.current) {
      circleRef.current.setCenter(selectedLocation);
      circleRef.current.setRadius(milesToMeters(radiusMiles));
    } else {
      circleRef.current = new google.maps.Circle({
        map: mapRef.current,
        center: selectedLocation,
        radius: milesToMeters(radiusMiles),
        fillColor: "#0077B6",
        fillOpacity: 0.2,
        strokeColor: "#0077B6",
        strokeOpacity: 0.8,
        strokeWeight: 1.5,
      });
    }
  }, [radiusMiles, selectedLocation, isLoaded]);

  // Get user geolocation
  useEffect(() => {
    if (navigator.geolocation && isLoaded) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const userLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setIsGeolocationAllowed(true);
          setCenter(userLoc);

          try {
            const geocoder = new google.maps.Geocoder();
            const result = await geocoder.geocode({ location: userLoc });

            if (result.results[0]) {
              const address = result.results[0];
              let city = "", state = "", zip = "";

              for (const comp of address.address_components) {
                if (comp.types.includes("locality")) city = comp.long_name;
                if (comp.types.includes("administrative_area_level_1")) state = comp.short_name;
                if (comp.types.includes("postal_code")) zip = comp.long_name;
              }

              setSelectedLocation({ lat: userLoc.lat, lng: userLoc.lng, city, state, zip });
              if (inputRef.current) inputRef.current.value = address.formatted_address;
            } else {
              setSelectedLocation({ ...userLoc });
            }
          } catch {
            setSelectedLocation({ ...userLoc });
          }
        },
        () => {
          setIsGeolocationAllowed(false);
          setCenter(DEFAULT_CENTER);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    }
  }, [isLoaded]);

  // Handle place selection
  const onPlacesChanged = () => {
    const places = searchBoxRef.current?.getPlaces();
    if (!places || places.length === 0) return;

    const place = places[0];
    const location = place.geometry?.location;
    const addressComponents = place.address_components;

    if (location) {
      const lat = location.lat();
      const lng = location.lng();
      let city = "", state = "", zip = "";

      if (addressComponents) {
        for (const comp of addressComponents) {
          if (comp.types.includes("locality")) city = comp.long_name;
          if (comp.types.includes("administrative_area_level_1")) state = comp.short_name;
          if (comp.types.includes("postal_code")) zip = comp.long_name;
        }
      }

      setCenter({ lat, lng });
      setSelectedLocation({ lat, lng, city, state, zip });
      setLocationError("");
    }
  };

  const handleNext = () => {
    if (!selectedLocation) {
      setLocationError("Please enter your service location.");
      inputRef.current?.focus();
      return;
    }

    if (isGeolocationAllowed === false && !inputRef.current?.value) {
      setLocationError("Please enter your business location in the search field.");
      inputRef.current?.focus();
      return;
    }

    if (!professionalId) {
      toast.error("Professional data not available. Please complete previous steps.");
      return;
    }

    try {
      saveLocationMutation.mutate({
        professional_id: professionalId,
        service_id: serviceId || "", // Use empty string as fallback
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        city: selectedLocation.city || "",
        state: selectedLocation.state || "",
        zip: selectedLocation.zip || "",
        radiusMiles,
        isLoading: false,
      });
    } catch (err) {
      toast.error((err as Error).message);
    }
  };
  const handleBack = () => router.back();
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.trim() && locationError) setLocationError("");
  };
  const canProceed = selectedLocation && professionalId && !saveLocationMutation.isPending;
  if (loadError) return <div>Error loading Google Maps</div>;
  if (!isLoaded || isLoadingProfessionalData) {
    return (
      <GlobalLoader></GlobalLoader>
    );
  }
  return (
    <div className="space-y-4">
      <ProgressBar currentStep={currentStep} totalSteps={ONBOARDING_STEPS.length} steps={ONBOARDING_STEPS} className="mb-8" />

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px text-xs font-medium text-center" role="tablist">
          {TAB_OPTIONS.map((tab) => (
            <li className="me-2" key={tab.value}>
              <button
                className={`inline-block p-2.5 border-b-2 rounded-t-lg transition-colors duration-200 ${activeTab === tab.value
                  ? "text-[#0077B6] border-[#0077B6]"
                  : "text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300"
                  }`}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Distance Tab */}
      {activeTab === "distance" && (
        <div className="rounded-lg bg-white dark:bg-gray-900 flex flex-col md:flex-row gap-4" style={{ minHeight: 400 }}>
          {/* Left Controls */}
          <div className="flex flex-col gap-3 w-full md:w-1/3 px-4 py-6">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Select by distance</h2>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Set the max distance from your business location
            </p>

            <div className="mb-4">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Search Business Location
              </label>
              <StandaloneSearchBox
                onLoad={(ref) => { searchBoxRef.current = ref; }}
                onPlacesChanged={onPlacesChanged}
              >
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search location..."
                  onChange={handleSearchInputChange}
                  className={`mt-1 block w-full text-[12px] px-4 py-2 border rounded-[2px] focus:outline-none focus:ring-1 focus:border-transparent text-gray-800 dark:text-white dark:bg-gray-800 text-sm ${locationError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-400 dark:border-gray-700 focus:ring-[#0096C7]"
                    }`}
                />
              </StandaloneSearchBox>
              {locationError && <p className="mt-1 text-xs text-red-500">{locationError}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium">Distance radius</span>
                <span className="text-xs font-medium text-[#0077B6]">{radiusMiles} miles</span>
              </div>
              <input
                type="range"
                min={1}
                max={300}
                value={radiusMiles}
                onChange={(e) => setRadiusMiles(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg cursor-pointer dark:bg-gray-700"
                style={{ accentColor: "#0077B6" }}
              />
            </div>

          </div>

          {/* Map Panel */}
          <div className="relative flex-1">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={zoom}
              onLoad={onMapLoad}
            />
          </div>
        </div>
      )}

      {/* Advanced Tab */}
      {activeTab === "advanced" && (
        <div className="p-6 rounded-lg bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-700 flex items-center justify-center" style={{ minHeight: 400 }}>
          <div className="text-center max-w-xs">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Advanced Filters</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Coming soon: More advanced filtering options for precise location targeting.
            </p>
          </div>
        </div>
      )}

      {/* Footer Controls */}
      <div className="fixed bottom-6 right-6 flex gap-4 text-[13px]">
        <button onClick={handleBack} type="button" className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white mt-6 py-2 px-5 rounded-[4px]">
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!canProceed}
          className={`mt-6 py-2 px-6 rounded-[4px] flex items-center justify-center gap-2 text-white text-[13px] transition duration-300 ${!canProceed ? "bg-[#0077B6]/70 cursor-not-allowed" : "bg-[#0077B6] hover:bg-[#0077B6]/90"
            }`}
        >
          {saveLocationMutation.isPending && <Loader2 className="animate-spin w-4 h-4" />}
          Next
        </button>
      </div>
    </div>
  );
};

export default Map;