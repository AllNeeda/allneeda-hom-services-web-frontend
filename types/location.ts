export type LocationType = "user" | "service" | "lead" | "project" | "professional";

export interface Coordinates {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface LocationData {
  type: LocationType;
  country: string;
  state?: string;
  city: string;
  zipcode?: string;
  coordinates: Coordinates;
}

// Validation function
export function isValidLocation(location: LocationData): boolean {
  const [longitude, latitude] = location.coordinates.coordinates;
  return (
    longitude >= -180 && longitude <= 180 &&
    latitude >= -90 && latitude <= 90
  );
}