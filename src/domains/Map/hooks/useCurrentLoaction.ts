import { useState, useCallback } from 'react';

export function useCurrentLocation() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  // 상태값 추가
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('error');
      return;
    }
    setStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus('success');
      },
      () => {
        setStatus('error');
      },
      { enableHighAccuracy: true },
    );
  }, []);

  return {
    location,
    status,
    requestLocation,
    setLocation,
    setStatus,
  };
}
