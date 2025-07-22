import { CustomOverlayMap, Roadview } from 'react-kakao-maps-sdk';
import type { LatLng } from './KakaoMapContainer';

interface RoadviewProps {
  position: LatLng;
  radius?: number;
  yAnchor?: number;
}

export default function KakaoRoadview({
  position,
  radius = 50,
  yAnchor = 1.2,
}: RoadviewProps) {
  return (
    <CustomOverlayMap
      position={position}
      yAnchor={yAnchor}
      className="pointer-events-none"
    >
      <Roadview
        position={position} // { lat, lng }
        radius={radius} // 반경 (m)
        style={{ width: 300, height: 200, borderRadius: 8, overflow: 'hidden' }}
        panControl={true} // 옵션으로 컨트롤 켜기
        zoomControl={true}
      />
    </CustomOverlayMap>
  );
}
