export async function getLocationInfo(): Promise<{
  lat: number;
  lng: number;
  country?: string;
  state?: string;
  city?: string;
  postcode?: string;
}> {
  // Step 1: Get browser coordinates
  /* eslint-disable no-undef */
  const position = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 15000,
    });
  });
/* eslint-enable no-undef */
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;

  // Step 2: Reverse geocode via Nominatim
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
  );
  const data = await res.json();
  const addr = data.address || {};

  return {
    lat,
    lng,
    country: addr.country,
    state: addr.state || addr.region,
    city: addr.city || addr.town || addr.village,
    postcode: addr.postcode,
  };
}
