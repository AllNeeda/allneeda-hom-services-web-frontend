// api/google/route.ts
import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const serviceName = searchParams.get("serviceName");
    const zipcode = searchParams.get("zipcode");

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

    // Text Search
    const textUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${serviceName}+in+${zipcode}&key=${GOOGLE_API_KEY}`;
    const textRes = await fetch(textUrl);
    const textData = await textRes.json();
    const places = textData.results || [];
    console.log("Places found: ", places);

    // Fetch complete place details with all fields
    const detailedPlaces = await Promise.all(
      places.slice(0, 5).map(async (place: any) => {
        // Include all the fields you need
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
        
        return {
          place_id: place.place_id,
          // Return all details from the details API
          ...details.result,
          // Fallback to text search data if details are not available
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
          // Also include original text search data for completeness
          original_data: place
        };
      })
    );
    console.log("Detailed Places: ", detailedPlaces);
    
    return NextResponse.json(
      { data: detailedPlaces },
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