export type MyLocation = { lat: number; lng: number };

export function requestCurrentLocation(
  onSuccess: (loc: MyLocation) => void,
  onFail?: (err: GeolocationPositionError) => void,
) {
  if (!navigator.geolocation) {
    onFail?.(
      new Error('이 브라우저에서는 위치 정보를 지원하지 않습니다.') as any,
    );
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      onSuccess({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    },
    (err) => {
      onFail?.(err);
    },
    { enableHighAccuracy: true },
  );
}
