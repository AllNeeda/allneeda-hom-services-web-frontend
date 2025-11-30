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
import { getAccessToken } from "@/app/api/axios";
import { useUpdateServiceLocation } from "@/hooks/useServices";
import { useQueryClient } from "@tanstack/react-query";

const containerStyle = { width: "100%", height: "400px" };
const TAB_OPTIONS = [
    { label: "Select by Distance", value: "distance" },
];
const milesToMeters = (miles: number) => miles * 1609.34;
const DEFAULT_CENTER = { lat: 0, lng: 0 };
const DEFAULT_ZOOM = 2;

interface LocationData {
    _id?: string;
    service_id?: string;
    professional_id?: string;
    lat: number;
    lng: number;
    city?: string;
    state?: string;
    zip?: string;
    zipcode?: string[];
    address_line?: string;
    country?: string;
    serviceRadiusMiles?: number;
    coordinates?: {
        coordinates: [number, number];
    };
}

interface SelectedLocation {
    lat: number;
    lng: number;
    city?: string;
    state?: string;
    zip?: string;
    address_line?: string;
}

const EditLocation = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const serviceData = queryClient.getQueryData(['currentService']) as
        { service_id: string; professional_id: string } | undefined;

    const [locationData, setLocationData] = useState<LocationData | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        const storedLocation = localStorage.getItem('currentLocation');
        if (storedLocation) {
            try {
                const parsed = JSON.parse(storedLocation);
                if (parsed?.location_data) {
                    setLocationData(parsed.location_data);
                    setIsEditMode(true);
                }
            } catch {
                toast.error('Error parsing location data:');
            }
        }
    }, []);

    const serviceId = serviceData?.service_id || locationData?.service_id;
    const professional_id = serviceData?.professional_id || locationData?.professional_id;
    const locationId = locationData?._id;

    const token = getAccessToken() || "";
    const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const mapRef = useRef<google.maps.Map | null>(null);
    const circleRef = useRef<google.maps.Circle | null>(null);

    const [activeTab, setActiveTab] = useState("distance");
    const [radiusMiles, setRadiusMiles] = useState(10);
    const [center, setCenter] = useState<{ lat: number; lng: number }>(DEFAULT_CENTER);
    const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
    const [locationError, setLocationError] = useState("");
    const [isInitialized, setIsInitialized] = useState(false);

    const updateLocationMutation = useUpdateServiceLocation(token);

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) throw new Error('Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY');

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: apiKey,
        libraries: ['places'],
    });

    const onMapLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map;
    }, []);

    const initializeEditMode = useCallback(() => {
        if (!isLoaded || !locationData || isInitialized) return;
        const coords = locationData.coordinates?.coordinates ||
            (locationData.lat && locationData.lng ? [locationData.lng, locationData.lat] : null);
        if (coords) {
            const [lng, lat] = coords;
            const location = { lat, lng };

            setCenter(location);
            setRadiusMiles(locationData.serviceRadiusMiles || 10);

            const firstZip = locationData.zipcode?.[0] || locationData.zip;

            setSelectedLocation({
                lat,
                lng,
                city: locationData.city,
                state: locationData.state,
                zip: firstZip,
                address_line: locationData.address_line
            });

            if (inputRef.current) {
                const addressParts = [];
                if (locationData.address_line) addressParts.push(locationData.address_line);
                if (locationData.city) addressParts.push(locationData.city);
                if (locationData.state) addressParts.push(locationData.state);
                if (firstZip) addressParts.push(firstZip);

                inputRef.current.value = addressParts.join(', ') || 'Location selected';
            }

            setIsInitialized(true);
        }
    }, [isLoaded, locationData, isInitialized]);

    useEffect(() => {
        initializeEditMode();
    }, [initializeEditMode]);

    useEffect(() => {
        if (mapRef.current && selectedLocation && isLoaded) {
            const bounds = new google.maps.LatLngBounds();
            bounds.extend(selectedLocation);

            const circleBounds = new google.maps.Circle({
                center: selectedLocation,
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

    const onPlacesChanged = () => {
        const places = searchBoxRef.current?.getPlaces();
        if (!places || places.length === 0) return;

        const place = places[0];
        const location = place.geometry?.location;

        if (location) {
            const lat = location.lat();
            const lng = location.lng();
            let city = "", state = "", zip = "", address_line = "";

            if (place.address_components) {
                for (const comp of place.address_components) {
                    if (comp.types.includes("street_number") || comp.types.includes("route")) {
                        address_line = comp.long_name + (address_line ? " " + address_line : "");
                    }
                    if (comp.types.includes("locality")) city = comp.long_name;
                    if (comp.types.includes("administrative_area_level_1")) state = comp.short_name;
                    if (comp.types.includes("postal_code")) zip = comp.long_name;
                }
            }

            if (!address_line && place.formatted_address) {
                address_line = place.formatted_address;
            }

            setCenter({ lat, lng });
            setSelectedLocation({ lat, lng, city, state, zip, address_line });
            setLocationError("");
        }
    };

    const handleUpdateLocation = () => {
        if (!selectedLocation) {
            setLocationError("Please enter your service location.");
            inputRef.current?.focus();
            return;
        }

        if (!professional_id) {
            toast.error("Professional ID not found. Please complete previous steps.");
            return;
        }

        if (!serviceId) {
            toast.error("Service ID not found. Please complete previous steps.");
            return;
        }

        if (!locationId) {
            toast.error("Location ID not found. Cannot update location.");
            return;
        }

        const locationPayload = {
            professional_id,
            service_id: serviceId,
            location_id: locationId, // Pass the location ID for updating
            lat: selectedLocation.lat,
            lng: selectedLocation.lng,
            city: selectedLocation.city || "",
            state: selectedLocation.state || "",
            zip: selectedLocation.zip || "",
            address_line: selectedLocation.address_line || "",
            radiusMiles,
            isLoading: false,
        };

        updateLocationMutation.mutate(locationPayload, {
            onSuccess: () => {
                toast.success("Location updated successfully!");
                localStorage.removeItem('currentLocation');
                router.push("/home-services/dashboard/services/locations");
            },
            onError: (error: Error) => {
                toast.error(error.message || "Failed to update location");
            }
        });
    };

    const handleBack = () => {
        localStorage.removeItem('currentLocation');
        router.back();
    };

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.trim() && locationError) setLocationError("");
    };

    const canProceed = selectedLocation && professional_id && serviceId && locationId && !updateLocationMutation.isPending;

    if (loadError) return <div>Error loading Google Maps</div>;
    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="animate-spin w-8 h-8 text-[#0077B6]" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {isEditMode && (
                <div className="bg-[#0077B6]/10 border border-[#0077B6]/20 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                        <span className="text-[#0077B6] dark:text-[#0077B6]/80 text-md font-medium">
                            Editing Location
                        </span>
                        {locationData?.city && (
                            <span className="text-[#0077B6] dark:text-[#0077B6]/70 text-sm">
                                • {locationData.city}{locationData.state ? `, ${locationData.state}` : ''}
                            </span>
                        )}
                    </div>
                    <p className="text-[#0077B6] dark:text-[#0077B6]/70 text-xs mt-1">
                        Update your service area details.
                    </p>
                </div>
            )}

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

            {activeTab === "distance" && (
                <div className="rounded-lg bg-white dark:bg-gray-900 flex flex-col md:flex-row gap-4" style={{ minHeight: 400 }}>
                    <div className="flex flex-col gap-3 w-full md:w-1/3 px-4 py-6">
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                            Edit Location
                        </h2>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            Update your service location and radius
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

                    <div className="relative flex-1">
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={center}
                            zoom={DEFAULT_ZOOM}
                            onLoad={onMapLoad}
                        />
                    </div>
                </div>
            )}

            <div className="fixed bottom-6 right-6 flex gap-4 text-[13px]">
                <button
                    onClick={handleBack}
                    type="button"
                    className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white mt-6 py-2 px-5 rounded-[4px]"
                >
                    Back
                </button>
                <button
                    type="button"
                    onClick={handleUpdateLocation}
                    disabled={!canProceed}
                    className={`mt-6 py-2 px-6 rounded-[4px] flex items-center justify-center gap-2 text-white text-[13px] transition duration-300 ${!canProceed ? "bg-[#0077B6]/70 cursor-not-allowed" : "bg-[#0077B6] hover:bg-[#0077B6]/90"
                        }`}
                >
                    {updateLocationMutation.isPending && <Loader2 className="animate-spin w-4 h-4" />}
                    Update Location
                </button>
            </div>
        </div>
    );
};

export default EditLocation;