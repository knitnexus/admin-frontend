"use client";

interface ReverseGeocodeResult {
  city?: string;
  state?: string;
  pincode?: string;
  address?: string;
}

/**
 * Reverse geocode using Nominatim (OpenStreetMap) - Free, no API key needed
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<ReverseGeocodeResult> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
      {
        headers: {
          "User-Agent": "YourAppName/1.0", // Required by Nominatim
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.status}`);
    }

    const data = await response.json();
    const address = data.address || {};

    return {
      city: address.city || address.town || address.village || address.county,
      state: address.state,
      pincode: address.postcode,
      address: data.display_name,
    };
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return {};
  }
}

/**
 * Alternative: Use Google Maps Geocoding API (requires API key)
 */
export async function reverseGeocodeGoogle(
  latitude: number,
  longitude: number,
  apiKey: string
): Promise<ReverseGeocodeResult> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
    );

    const data = await response.json();

    if (data.status !== "OK" || !data.results[0]) {
      throw new Error(`Geocoding failed: ${data.status}`);
    }

    const components = data.results[0].address_components;

    const getComponent = (type: string) => {
      // @ts-ignore
      const component = components.find((c: any) => c.types.includes(type));
      return component?.long_name;
    };

    return {
      city:
        getComponent("locality") || getComponent("administrative_area_level_2"),
      state: getComponent("administrative_area_level_1"),
      pincode: getComponent("postal_code"),
      address: data.results[0].formatted_address,
    };
  } catch (error) {
    console.error("Google geocoding error:", error);
    return {};
  }
}
