import { Roadview } from 'react-kakao-maps-sdk';
// import type { LatLng } from './KakaoMapContainer';

// interface RoadviewProps {
//   position?: LatLng;
//   radius?: number;
//   yAnchor?: number;
// }

export default function KakaoRoadview() {
  return (
    <Roadview
      position={{
        // 지도의 중심좌표
        lat: 33.450701,
        lng: 126.570667,
        radius: 50,
      }}
      // 지도의 크기
      style={{ width: '100%', height: '450px' }}
    />
  );
}
