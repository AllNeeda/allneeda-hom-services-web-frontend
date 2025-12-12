
import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

async function getCoordinatesFromZipcode(zipcode: string, apiKey?: string) {
  try {
    if (!apiKey) {
      console.error("Geocoding error: missing Google API key");
      return null;
    }

    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${zipcode}&key=${apiKey}`;
    const response = await fetch(geocodeUrl);
    const data = await response.json();
    
    if (data.status === "OK" && data.results[0]?.geometry?.location) {
      return {
        lat: data.results[0].geometry.location.lat,
        lng: data.results[0].geometry.location.lng
      };
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const serviceName = searchParams.get("serviceName");
    const zipcode = searchParams.get("zipcode");
    const radius = searchParams.get("radius") || "5000"; 

    if (!serviceName || !zipcode) {
      return NextResponse.json(
        { error: "serviceName & zipcode required" }, 
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          }
        }
      );
    }

    const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    const coordinates = await getCoordinatesFromZipcode(zipcode, GOOGLE_API_KEY);
    
    if (!coordinates) {
      return NextResponse.json(
        { error: "Could not find location for the zipcode" },
        { status: 404 }
      );
    }

    const nearbySearchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coordinates.lat},${coordinates.lng}&radius=${radius}&keyword=${encodeURIComponent(serviceName)}&key=${GOOGLE_API_KEY}`;
    
    const nearbyRes = await fetch(nearbySearchUrl);
    const nearbyData = await nearbyRes.json();
    
    let places = nearbyData.results || [];
    
    if (places.length === 0) {
      console.log("No results from nearby search, trying text search...");
      
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${zipcode}&key=${GOOGLE_API_KEY}`;
      const geoRes = await fetch(geocodeUrl);
      const geoData = await geoRes.json();
      
      let locationName = zipcode;
      if (geoData.status === "OK" && geoData.results[0]) {
       
        const addressComponents = geoData.results[0].address_components;
        const cityComponent = addressComponents.find((comp: any) => 
          comp.types.includes("locality") || comp.types.includes("postal_town")
        );
        const stateComponent = addressComponents.find((comp: any) => 
          comp.types.includes("administrative_area_level_1")
        );
        
        if (cityComponent && stateComponent) {
          locationName = `${cityComponent.long_name}, ${stateComponent.short_name}`;
        }
      }
      
      const textUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(serviceName)}+in+${encodeURIComponent(locationName)}&key=${GOOGLE_API_KEY}`;
      const textRes = await fetch(textUrl);
      const textData = await textRes.json();
      places = textData.results || [];
    }

    console.log(`Found ${places.length} places for ${serviceName} near ${zipcode}`);

    
    const detailedPlaces = await Promise.all(
      places.slice(0, 15).map(async (place: any) => {
        try {
          const fields = [
            'name',
            'formatted_phone_number',
            'formatted_address',
            'rating',
            'user_ratings_total',
            'business_status',
            'opening_hours',
            'photos',
            'geometry',
            'types',
            'website',
            'url',
            'reviews',
            'price_level',
            'icon',
            'icon_background_color',
            'icon_mask_base_uri'
          ].join(',');

          const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=${fields}&key=${GOOGLE_API_KEY}`;
          const detailsRes = await fetch(detailsUrl);
          const details = await detailsRes.json();
          
          // Calculate distance from original zipcode
          let distanceInMeters = null;
          if (details.result?.geometry?.location && coordinates) {
            const lat1 = coordinates.lat;
            const lon1 = coordinates.lng;
            const lat2 = details.result.geometry.location.lat;
            const lon2 = details.result.geometry.location.lng;
            
            // Haversine formula to calculate distance
            const R = 6371e3; // Earth's radius in meters
            const φ1 = lat1 * Math.PI/180;
            const φ2 = lat2 * Math.PI/180;
            const Δφ = (lat2-lat1) * Math.PI/180;
            const Δλ = (lon2-lon1) * Math.PI/180;
            
            const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                      Math.cos(φ1) * Math.cos(φ2) *
                      Math.sin(Δλ/2) * Math.sin(Δλ/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            distanceInMeters = Math.round(R * c);
          }
          
          return {
            place_id: place.place_id,
            ...details.result,
            name: details.result?.name ?? place.name,
            formatted_address: details.result?.formatted_address ?? place.formatted_address,
            formatted_phone_number: details.result?.formatted_phone_number ?? "Not Available",
            rating: details.result?.rating ?? place.rating ?? "N/A",
            user_ratings_total: details.result?.user_ratings_total ?? place.user_ratings_total ?? 0,
            business_status: details.result?.business_status ?? place.business_status ?? "UNKNOWN",
            opening_hours: details.result?.opening_hours ?? place.opening_hours,
            photos: details.result?.photos ?? place.photos,
            geometry: details.result?.geometry ?? place.geometry,
            types: details.result?.types ?? place.types,
            icon: details.result?.icon ?? place.icon,
            icon_background_color: details.result?.icon_background_color ?? place.icon_background_color,
            icon_mask_base_uri: details.result?.icon_mask_base_uri ?? place.icon_mask_base_uri,
            distance: distanceInMeters,
            // Convert to miles for display
            distance_miles: distanceInMeters ? (distanceInMeters / 1609.34).toFixed(1) : null
          };
        } catch (error) {
          console.error(`Error fetching details for ${place.place_id}:`, error);
          return {
            place_id: place.place_id,
            name: place.name,
            formatted_address: place.formatted_address,
            rating: place.rating,
            user_ratings_total: place.user_ratings_total,
            business_status: place.business_status,
            types: place.types,
            geometry: place.geometry,
            icon: place.icon,
            distance: null,
            distance_miles: null
          };
        }
      })
    );

    // Sort by distance (closest first)
    const sortedPlaces = detailedPlaces
      .filter(place => place !== null)
      .sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });

    console.log("Returning", sortedPlaces.length, "detailed places");
    
    return NextResponse.json(
      { 
        data: sortedPlaces,
        searchLocation: {
          zipcode,
          coordinates,
          radius: parseInt(radius)
        }
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" }, 
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      }
    );
  }
}