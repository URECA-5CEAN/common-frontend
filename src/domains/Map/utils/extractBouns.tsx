export interface InternalBounds extends kakao.maps.LatLngBounds {
  pa: number;
  qa: number;
  oa: number;
  ha: number;
}

export function extractBouns(map: kakao.maps.Map): {
  latMin: number;
  latMax: number;
  lngMin: number;
  lngMax: number;
} | null {
  const bounds = map.getBounds() as InternalBounds;
  if (!bounds) return null;
  return {
    latMin: bounds.qa,
    latMax: bounds.pa,
    lngMin: bounds.ha,
    lngMax: bounds.oa,
  };
}
