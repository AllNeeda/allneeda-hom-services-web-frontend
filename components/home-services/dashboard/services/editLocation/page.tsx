/// <reference types="@types/google.maps" />
"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
    GoogleMap,
    useLoadScript,
    StandaloneSearchBox,
} from "@react-google-maps/api";
import { Loader2 } from "lucide-react";
import { getAccessToken } from "@/app/api/axios";
import { useGetServiceLocationById, useUpdateServiceLocation } from "@/hooks/useServices";
import GlobalLoader from "@/components/ui/global-loader";

const containerStyle = { width: "100%", height: "400px" };
const TAB_OPTIONS = [
    { label: "Select by Distance", value: "distance" },
];
const milesToMeters = (miles: number) => miles * 1609.34;
const DEFAULT_CENTER = { lat: 0, lng: 0 };
const DEFAULT_ZOOM = 2;

interface SelectedLocation {
    lat: number;
    lng: number;
    city?: string;
    state?: string;
    zip?: string;
    address_line?: string;
}

interface LocationData {
    _id?: string;
    location_id?: string;
    id?: string;
    coordinates?: {
        coordinates: [number, number];
    };
    lat?: number;
    lng?: number;
    serviceRadiusMiles?: number;
    radius_miles?: number;
    radius?: number;
    service_radius?: number;
    zipcode?: string[];
    zip?: string;
    postal_code?: string;
    zip_code?: string;
    city?: string;
    locality?: string;
    town?: string;
    state?: string;
    province?: string;
    region?: string;
    address_line?: string;
    address?: string;
    street_address?: string;
    formatted_address?: string;
    location?: {
        coordinates?: {
            coordinates: [number, number];
        };
    };
    location_lat?: number;
    location_lng?: number;
    // For nested structure
    location_ids?: Array<{
        _id?: string;
        location_id?: string;
        id?: string;
        coordinates?: {
            coordinates: [number, number];
        };
        serviceRadiusMiles?: number;
        radius_miles?: number;
        radius?: number;
        service_radius?: number;
        zipcode?: string[];
        zip?: string;
        postal_code?: string;
        zip_code?: string;
        city?: string;
        locality?: string;
        town?: string;
        state?: string;
        province?: string;
        region?: string;
        address_line?: string;
        address?: string;
        street_address?: string;
        formatted_address?: string;
    }>;
}

const EditLocation = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const location_id = searchParams.get("location_id") || "";
    const serviceId = searchParams.get("service_id") || "";
    const professionalId = searchParams.get("professional_id") || "";
    const service_id = serviceId;
    const professional_id = professionalId;
    const token = getAccessToken() || "";
    const hasRequiredParams = location_id && service_id && professional_id;
    const shouldFetch = hasRequiredParams;
    const {
        data: locationDataResponse,
        isLoading: isLocationLoading,
        error: locationError,
    } = useGetServiceLocationById(
        hasRequiredParams ? service_id : "",
        hasRequiredParams ? professional_id : "",
        hasRequiredParams ? location_id : "",
        hasRequiredParams ? token : ""
    );
    const locationDataArray = locationDataResponse?.data?.data;
    const responseData = locationDataResponse?.data;
    const findLocationById = useCallback((data: any): LocationData | null => {
        if (!data) return null;
        if (Array.isArray(data)) {
            const foundLocation = data.find((location: any) => {
                const match =
                    location._id === location_id ||
                    location.location_id === location_id ||
                    location.id === location_id;
                return match;
            });
            if (foundLocation) {
                return foundLocation;
            }
            for (const location of data) {
                if (location.location_ids && Array.isArray(location.location_ids)) {
                    const foundNestedLocation = location.location_ids.find((nested: any) => {
                        const match =
                            nested._id === location_id ||
                            nested.location_id === location_id ||
                            nested.id === location_id;
                        return match;
                    });

                    if (foundNestedLocation) {
                        return foundNestedLocation;
                    }
                }
            }
        }
        // If data is a single object
        else if (typeof data === 'object' && data !== null) {
            if (data._id === location_id || data.location_id === location_id || data.id === location_id) {
                return data;
            }
            if (data.location_ids && Array.isArray(data.location_ids)) {
                const foundNestedLocation = data.location_ids.find((nested: any) => {
                    const match =
                        nested._id === location_id ||
                        nested.location_id === location_id ||
                        nested.id === location_id;
                    return match;
                });

                if (foundNestedLocation) {
                    return foundNestedLocation;
                }
            }
            if (data.data && typeof data.data === 'object') {
                return findLocationById(data.data);
            }
            if (data.locations && Array.isArray(data.locations)) {
                return findLocationById(data.locations);
            }
        }
        return null;
    }, [location_id]);
    const locationData = findLocationById(locationDataArray || responseData);
    const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const mapRef = useRef<google.maps.Map | null>(null);
    const circleRef = useRef<google.maps.Circle | null>(null);
    const [activeTab, setActiveTab] = useState("distance");
    const [radiusMiles, setRadiusMiles] = useState(10);
    const [center, setCenter] = useState<{ lat: number; lng: number }>(DEFAULT_CENTER);
    const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
    const [locationErrorMsg, setLocationErrorMsg] = useState("");
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
        if (!isLoaded || !locationData || isInitialized || isLocationLoading) return;

        let lat = 0;
        let lng = 0;

        if (locationData.coordinates?.coordinates) {
            const [lngCoord, latCoord] = locationData.coordinates.coordinates;
            lat = latCoord;
            lng = lngCoord;
        }
        else if (locationData.lat && locationData.lng) {
            lat = locationData.lat;
            lng = locationData.lng;
        }
        else if (locationData.location?.coordinates?.coordinates) {
            const [lngCoord, latCoord] = locationData.location.coordinates.coordinates;
            lat = latCoord;
            lng = lngCoord;
        }
        else if (locationData.location_lat && locationData.location_lng) {
            lat = locationData.location_lat;
            lng = locationData.location_lng;
        }

        if (lat !== 0 && lng !== 0) {
            const location = { lat, lng };
            setCenter(location);

            const radius = locationData.serviceRadiusMiles ||
                locationData.radius_miles ||
                (locationData as any).radius ||
                (locationData as any).service_radius ||
                10;
            setRadiusMiles(radius);

            const firstZip = Array.isArray(locationData.zipcode) ? locationData.zipcode[0] :
                locationData.zip ||
                (locationData as any).postal_code ||
                (locationData as any).zip_code || "";

            const addressLine = locationData.address_line ||
                (locationData as any).address ||
                (locationData as any).street_address ||
                (locationData as any).formatted_address || "";

            const city = locationData.city ||
                (locationData as any).locality ||
                (locationData as any).town || "";

            const state = locationData.state ||
                (locationData as any).province ||
                (locationData as any).region || "";

            setSelectedLocation({
                lat,
                lng,
                city,
                state,
                zip: firstZip,
                address_line: addressLine
            });

            // Set input value after a small delay to ensure ref is ready
            setTimeout(() => {
                if (inputRef.current) {
                    const addressParts = [];
                    if (addressLine) addressParts.push(addressLine);
                    if (city) addressParts.push(city);
                    if (state) addressParts.push(state);
                    if (firstZip) addressParts.push(firstZip);

                    inputRef.current.value = addressParts.join(', ') || 'Location selected';
                }
            }, 100);

            setIsInitialized(true);
        } else {
            console.warn("No coordinates found in location data:", locationData);
        }
    }, [isLoaded, locationData, isInitialized, isLocationLoading]);

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

    // Update or create circle on map
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

    // Handle search box place selection
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
            setLocationErrorMsg("");
        }
    };

    const handleUpdateLocation = () => {
        if (!selectedLocation) {
            setLocationErrorMsg("Please enter your service location.");
            inputRef.current?.focus();
            return;
        }

        if (!hasRequiredParams) {
            toast.error("Missing required parameters. Please go back and try again.");
            return;
        }

        const locationPayload = {
            professional_id,
            service_id,
            location_id,
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
                const params = new URLSearchParams({
                    service_id: service_id,
                    professional_id: professional_id,
                }).toString();
                toast.success("Location updated successfully!");
                router.push(`/home-services/dashboard/services/locations?${params}`);
            },
            onError: (error: any) => {
                toast.error(error?.response?.data?.message || "Failed to update location");
            }
        });
    };

    const handleBack = () => {
        router.back();
    };

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.trim() && locationErrorMsg) setLocationErrorMsg("");
    };

    const canProceed = selectedLocation && professional_id && service_id && location_id && !updateLocationMutation.isPending;

    // Show missing parameters error
    if (!hasRequiredParams && !isLocationLoading) {
        return (
            <div className="space-y-4">
                <div className="bg-red-100 border border-red-200 rounded-sm p-4">
                    <div className="flex items-center gap-2">
                        <span className="text-red-600 text-md font-medium">
                            Missing Parameters
                        </span>
                    </div>
                    <p className="text-red-600 text-xs mt-1">
                        Required parameters (location_id, service_id, professional_id) are missing from the URL.
                    </p>
                    <button
                        onClick={handleBack}
                        className="mt-4 bg-gray-300 text-gray-800 py-2 px-5 rounded-[4px] text-[13px]"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (loadError) return <div>Error loading Google Maps</div>;

    if (!isLoaded || (shouldFetch && isLocationLoading)) {
        return <GlobalLoader />;
    }

    // Show error if location couldn't be loaded
    if (locationError) {
        return (
            <div className="space-y-4">
                <div className="bg-red-100 border border-red-200 rounded-sm p-4">
                    <div className="flex items-center gap-2">
                        <span className="text-red-600 text-md font-medium">
                            Error Loading Location
                        </span>
                    </div>
                    <p className="text-red-600 text-xs mt-1">
                        Could not load location data. Please check the URL parameters and try again.
                    </p>
                    <button
                        onClick={handleBack}
                        className="mt-4 bg-gray-300 text-gray-800 py-2 px-5 rounded-[4px] text-[13px]"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }
    if (shouldFetch && !locationData && !isLocationLoading) {
        if (locationDataArray || responseData) {
            return (
                <div className="flex items-center justify-center">
                    <div className="space-y-4 rounded-sm text-center">
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-[#0077B6] text-md font-medium">
                                Location Not Found in Data
                            </span>
                        </div>
                        <p className="text-xs mt-1">
                            Location was not found in the service data.
                        </p>
                        <button
                            onClick={handleBack}
                            className="mt-4 bg-[#0077B6] text-white py-2 px-5 rounded-[4px] text-[13px]"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            );
        } else {
            // No data at all
            return (
                <div className="flex items-center justify-center">
                    <div className="space-y-4 rounded-sm text-center">
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-[#0077B6] text-md font-medium">
                                No Location Data Available
                            </span>
                        </div>
                        <p className="text-xs mt-1">
                            Could not load location data from the server.
                        </p>
                        <button
                            onClick={handleBack}
                            className="mt-4 bg-[#0077B6] text-white py-2 px-5 rounded-[4px] text-[13px]"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            );
        }
    }

    return (
        <div className="space-y-4">
            <div className="bg-[#0077B6]/10 border border-[#0077B6]/20 rounded-sm p-4">
                <div className="flex items-center gap-2">
                    <span className="dark:text-[#0077B6]/80 text-md font-medium">
                        Editing Location
                    </span>
                </div>
                <p className="dark:text-[#0077B6]/70 text-xs mt-1">
                    Update your service area details.
                </p>
            </div>

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
                <div className="rounded-sm bg-white dark:bg-gray-900 flex flex-col md:flex-row gap-4" style={{ minHeight: 400 }}>
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
                                    className={`mt-1 block w-full text-[12px] px-4 py-2 border rounded-[2px] focus:outline-none focus:ring-1 focus:border-transparent text-gray-800 dark:text-white dark:bg-gray-800 text-sm ${locationErrorMsg
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-gray-400 dark:border-gray-700 focus:ring-[#0096C7]"
                                        }`}
                                />
                            </StandaloneSearchBox>
                            {locationErrorMsg && <p className="mt-1 text-xs text-red-500">{locationErrorMsg}</p>}
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
                                className="w-full h-1.5 bg-gray-200 rounded-sm cursor-pointer dark:bg-gray-700"
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