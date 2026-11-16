import { Platform } from 'react-native';

export function startLocationTracking(
  onlocation: (lat: number, lng: number, accuracy?: number) => void,
  onerror?: (error: GeolocationPositionError) => void,
) {
  // На нативных сборках геолокация ещё не подключена: карта доступна только
  // в вебе, а `navigator.geolocation` там может быть заглушкой.
  if (
    Platform.OS !== 'web' ||
    typeof navigator === 'undefined' ||
    !navigator.geolocation
  ) {
    return () => {};
  }

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
      // GeolocationPositionError в консоли выглядит как `{}`: code и message
      // лежат на прототипе. Логируем их явно, чтобы причина была видна.
      const code = typeof error?.code === 'number' ? error.code : null;
      const message =
        typeof error?.message === 'string' && error.message
          ? error.message
          : 'unknown error';
      console.warn(
        `Geolocation error${code === null ? '' : ` (${code})`}: ${message}`,
      );
      onerror?.(error);
    },
    { maximumAge: 15_000 },
  );

  return () => {
    navigator.geolocation.clearWatch(watchId);
  };
}
