// MapPage.tsx
import { useRef, useState } from 'react';
import KakaoMapContainer, { type MarkerProps } from '../KakaoMapContainer';
import ThreeJsMarker from '../ThreeJsMarker';

const MapPage = () => {
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [center, setCenter] = useState({ lat: 37.45, lng: 126.7 });
  const [nearbyMarkers, setNearbyMarkers] = useState<MarkerProps[]>([]);
  const [hoveredMarkerId, setHoveredMarkerId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-dvh pt-[62px] md:pt-[86px] relative">
      <div ref={containerRef} className="absolute inset-0">
        <KakaoMapContainer
          lat={center.lat}
          lng={center.lng}
          onMapCreate={setMap}
          onNearbyMarkersChange={setNearbyMarkers}
          onCenterChanged={setCenter}
          hoveredMarkerId={hoveredMarkerId}
          setHoveredMarkerId={setHoveredMarkerId}
        />
        {map && (
          <ThreeJsMarker
            markers={nearbyMarkers}
            map={map}
            hoveredMarkerId={hoveredMarkerId}
            setHoveredMarkerId={setHoveredMarkerId}
            container={containerRef.current!}
          />
        )}
      </div>
    </div>
  );
};

export default MapPage;
