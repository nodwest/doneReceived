export function startLocationTracking(
  onlocation: (lat: number, lng: number) => void,
) {
  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      onlocation(latitude, longitude);
    },
    (error) => {
      console.error('Geolocation error:', error);
    },
  );

  return () => {
    navigator.geolocation.clearWatch(watchId);
  };
}
