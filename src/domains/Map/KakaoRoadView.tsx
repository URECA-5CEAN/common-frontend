import { Roadview } from 'react-kakao-maps-sdk';
import type { LatLng } from './KakaoMapContainer';

interface RoadviewProps {
  position?: LatLng;
  radius?: number;
  yAnchor?: number;
}

export default function KakaoRoadview({
  position,
  radius = 50,
}: RoadviewProps) {
  return (
    <Roadview
      position={{
        lat: position?.lat ?? 33.450701,
        lng: position?.lng ?? 126.570667,
        radius,
      }}
      style={{ width: '100%', height: '450px' }}
    />
  );
}
