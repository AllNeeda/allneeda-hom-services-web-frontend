// lib/location.ts
import axios from "axios";

export async function getLocationFromCoords(lat: number, lon: number) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
  const { data } = await axios.get(url);
  const { country, state, city, town, village, postcode } = data.address || {};
  return {
    country,
    state,
    city: city || town || village,
    postcode,
  };
}

export const getLocationFromZip = async (zip: string, country = "us") => {
  const response = await fetch(`https://api.zippopotam.us/${country}/${zip}`);

  if (!response.ok) {
    throw new Error("Invalid ZIP code");
  }

  const data = await response.json();
  const place = data.places?.[0];
  if (!place) throw new Error("No location found");

  return {
    country: data.country,
    state: place["state abbreviation"], // <-- use abbreviation
    city: place["place name"],
    postcode: data["post code"],
  };
};

