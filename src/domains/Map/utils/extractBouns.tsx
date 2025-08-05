export interface InternalBounds extends kakao.maps.LatLngBounds {
  pa: number; // latMax
  qa: number; // latMin
  oa: number; // lngMax
  ha: number; // lngMin
}

export function extractBouns(map: kakao.maps.Map): {
  latMin: number;
  latMax: number;
  lngMin: number;
  lngMax: number;
  centerLat: number;
  centerLng: number;
} | null {
  const bounds = map.getBounds() as InternalBounds;
  if (!bounds) return null;

  const center = map.getCenter();

  return {
    latMin: bounds.qa,
    latMax: bounds.pa,
    lngMin: bounds.ha,
    lngMax: bounds.oa,
    centerLat: center.getLat(),
    centerLng: center.getLng(),
  };
}
