import { useState, useCallback } from 'react';

export function useCurrentLocation() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [hasLocation, setHasLocation] = useState(false);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setHasLocation(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setHasLocation(true);
      },
      () => {
        setHasLocation(false);
      },
      { enableHighAccuracy: true },
    );
  }, []);

  return {
    location,
    hasLocation,
    requestLocation,
    setLocation,
    setHasLocation,
  };
}
