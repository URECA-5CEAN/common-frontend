import { useState, useCallback } from 'react';

export function useCurrentLocation() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [hasLocation, setHasLocation] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  const requestLocation = useCallback(() => {
    if (isRequesting) return; // 중복 방지
    if (!navigator.geolocation) {
      // setStatus('error');
      return;
    }

    setIsRequesting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log('위치 성공');
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setHasLocation(true);
        setIsRequesting(false);
      },
      (error) => {
        console.log('위치 실패', error.code, error.message);
        setHasLocation(false);
        setIsRequesting(false);
      },
      { enableHighAccuracy: true },
    );
  }, [isRequesting]);

  return {
    location,
    hasLocation,
    requestLocation,
    setLocation,
  };
}
