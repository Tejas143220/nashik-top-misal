// Default Fallback Coordinates: Nashik City Center (CBS / Panchavati)
export const NASHIK_CENTER_COORDS = { lat: 20.0059, lng: 73.7898 };

export const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 3.5;
  const R = 6371.0;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const getUserGPSCoordinates = () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(NASHIK_CENTER_COORDS);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      (_err) => {
        // Fallback to Nashik Center on permission denial or timeout
        resolve(NASHIK_CENTER_COORDS);
      },
      { timeout: 8000 }
    );
  });
};
