import { useRef, useState } from 'react';
import KakaoMapContainer, { type MarkerProps } from '../KakaoMapContainer';
import ThreeJsMarker from '../ThreeJsMarker';

const MapPage = () => {
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [center, setCenter] = useState({ lat: 37.45, lng: 126.7 });
  const [nearbyMarkers, setNearbyMarkers] = useState<MarkerProps[]>([]); // 위치 필터링도 상위로
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-[1500px] pt-[62px] md:pt-[86px] relative">
      <div ref={containerRef} className="absolute inset-0">
        <KakaoMapContainer
          lat={center.lat}
          lng={center.lng}
          onMapCreate={(mapInstance) => setMap(mapInstance)}
          onNearbyMarkersChange={(markers) => setNearbyMarkers(markers)}
          onCenterChanged={(newCenter) => setCenter(newCenter)}
        />
        {map && <ThreeJsMarker markers={nearbyMarkers} map={map} />}
      </div>
    </div>
  );
};

export default MapPage;
