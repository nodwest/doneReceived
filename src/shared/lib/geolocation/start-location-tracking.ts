export function startLocationTracking(
  onlocation: (lat: number, lng: number, accuracy?: number) => void,
) {
  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude, accuracy } = position.coords;

      onlocation(
        latitude,
        longitude,
        Number.isFinite(accuracy) ? accuracy : undefined,
      );
    },
    (error) => {
      console.error('Geolocation error:', error);
    },
  );

  return () => {
    navigator.geolocation.clearWatch(watchId);
  };
}
