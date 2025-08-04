import React from 'react';
import { CustomOverlayMap } from 'react-kakao-maps-sdk';

interface CustomMarkerProps {
  id: string;
  lat: number;
  lng: number;
  imageUrl: string;
  isRecommended?: string;
  selected: boolean;
  onClick: (id: string) => void;
  onMouseEnter: (id: string) => void;
  onMouseLeave: () => void;
  shouldCluster: boolean;
}

const CustomMarker = React.memo(function CustomMarker({
  id,
  lat,
  lng,
  imageUrl,
  isRecommended,
  selected,
  onClick,
  onMouseEnter,
  onMouseLeave,
  shouldCluster,
}: CustomMarkerProps) {
  return (
    <>
      <CustomOverlayMap
        position={{ lat, lng }}
        zIndex={shouldCluster ? 2 : 3}
        xAnchor={0.5}
        yAnchor={1.0}
      >
        <div
          onClick={() => onClick(id)}
          onMouseEnter={() => onMouseEnter(id)}
          onMouseLeave={onMouseLeave}
          style={{
            width: 40,
            height: 56,
            position: 'relative',
            cursor: 'pointer',
            transform: selected ? 'scale(1.3)' : 'scale(1.0)',
            transition: 'transform 0.25s ease',
            animation: selected ? 'floatY 2.0s ease infinite' : undefined,
          }}
        >
          {/* 꼬리 */}
          <div
            style={{
              position: 'absolute',
              top: 38,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              zIndex: 1,
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderTop: '15px solid white',
              filter: 'drop-shadow(2px 4px 4px rgba(0,0,0,0.3))',
            }}
          />
          {/* 동그란 마커 */}
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              overflow: 'hidden',
              backgroundColor: '#fff',
              border: '2px solid #fff',
              boxShadow: selected
                ? '0 10px 20px rgba(18, 158, 223, 0.35), 0 6px 6px rgba(0, 0, 0, 0.12)'
                : '2px 4px 10px rgba(0, 0, 0, 0.35)',
              position: 'relative',
              zIndex: 2,
            }}
          >
            <img
              src={imageUrl}
              alt="store"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
              loading="lazy"
              decoding="async"
              width={30}
              height={30}
            />
          </div>
        </div>
      </CustomOverlayMap>

      {/* 추천 매장 효과 */}
      {isRecommended && (
        <CustomOverlayMap
          position={{ lat, lng }}
          zIndex={2}
          xAnchor={0.5}
          yAnchor={1.0}
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-primaryGreen opacity-80 animate-ping " />
          </div>
        </CustomOverlayMap>
      )}
    </>
  );
});

export default CustomMarker;
