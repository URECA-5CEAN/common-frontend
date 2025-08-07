import React, { useState } from 'react';
import { CustomOverlayMap } from 'react-kakao-maps-sdk';
import mascotImage from '@/assets/image/dolphin-marker.png';

const FALLBACK_IMG = '/images/marker-default.webp';

interface CustomMarkerProps {
  id: string;
  lat: number;
  lng: number;
  imageUrl?: string;
  name?: string; // 없으면 대체용
  isRecommended?: string;
  selected: boolean;
  onClick: (id: string) => void;
  onMouseEnter: (id: string) => void;
  onMouseLeave: () => void;
  shouldCluster: boolean;
}

const CustomMarker: React.FC<CustomMarkerProps> = React.memo(
  ({
    id,
    lat,
    lng,
    imageUrl,
    name,
    isRecommended,
    selected,
    onClick,
    onMouseEnter,
    onMouseLeave,
    shouldCluster,
  }) => {
    // 이미지 로딩 에러 처리
    const [imgError, setImgError] = useState(false);

    const markerImg =
      !imgError && imageUrl
        ? imageUrl.replace(/\.png$/i, '.png')
        : FALLBACK_IMG;

    // isRecommended 아닌 경우 기존 스타일(일반 마커)로
    if (!isRecommended) {
      return (
        <CustomOverlayMap
          position={{ lat, lng }}
          zIndex={shouldCluster ? 2 : 3}
          xAnchor={0.5}
          yAnchor={1.0}
        >
          <div
            onClick={(e) => {
              onClick(id);
              e.stopPropagation();
            }}
            onMouseEnter={() => onMouseEnter(id)}
            onMouseLeave={onMouseLeave}
            style={{
              width: 40,
              height: 56,
              position: 'relative',
              cursor: 'pointer',
              transform: selected ? 'scale(1.3)' : 'scale(1.0)',
              transition: 'transform 0.25s cubic-bezier(.4,2,.2,1)',
              animation: selected
                ? 'floatY 2.0s ease-in-out infinite'
                : undefined,
            }}
          >
            {/* keyframe 애니메이션 인라인 */}
            {selected && (
              <style>
                {`
                  @keyframes floatY {
                    0%,100% { transform: scale(1.3) translateY(0); }
                    50% { transform: scale(1.3) translateY(-7px);}
                  }
                `}
              </style>
            )}
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
            {/* 원형 + 그림자 */}
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={markerImg}
                alt={name || '매장'}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
                loading="lazy"
                decoding="async"
                onError={() => setImgError(true)}
              />
            </div>
          </div>
        </CustomOverlayMap>
      );
    }

    // ai 추천 제휴처 마커
    return (
      <CustomOverlayMap
        position={{ lat, lng }}
        zIndex={shouldCluster ? 2 : 3}
        xAnchor={0.5}
        yAnchor={1.0}
      >
        <div
          onMouseEnter={() => onMouseEnter(id)}
          onMouseLeave={onMouseLeave}
          style={{
            width: 90,
            height: 130,
            position: 'relative',
            display: 'flex',
            top: -82,
            flexDirection: 'column',
            alignItems: 'center',
            pointerEvents: 'none',
            cursor: 'pointer',
            transform: 'translateX(-25px)',
            transition: 'transform 0.25s cubic-bezier(.4,2,.2,1)',
            animation: selected
              ? 'floatY 2.0s ease-in-out infinite'
              : undefined,
          }}
        >
          {/* keyframe 애니메이션 인라인 */}
          {selected && (
            <style>
              {`
                  @keyframes floatY {
                    0%,100% { transform: scale(1.1)  }
                    50% { transform: scale(1.1) }
                  }
                `}
            </style>
          )}
          {/* 마스코트 */}
          <img
            src={mascotImage}
            alt="AI마스코트"
            style={{
              width: 60,
              height: 60,
              position: 'absolute',
              left: '30%',
              top: 55,
              zIndex: 1,
              pointerEvents: 'none',
              transform: selected
                ? 'scale(1.3) '
                : 'scale(1.0) translateX(-50%)',
              transition: 'transform 0.25s cubic-bezier(.4,2,.2,1)',
            }}
            loading="lazy"
          />
          {/* 말풍선(테두리 원) + AI의 픽! */}
          <div
            onClick={(e) => {
              onClick(id);
              e.stopPropagation();
            }}
            style={{
              width: 50,
              height: 75,
              borderRadius: 45,
              background: '#158c9f',
              top: 82,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              pointerEvents: 'auto',
              justifyContent: 'flex-start',
              position: 'relative',
              boxShadow: '10px 10px 20px rgba(31, 209, 31, 0.28)',
              zIndex: 1,
            }}
          >
            <span
              style={{
                color: '#fff',
                fontWeight: 700,
                fontSize: 12,
                marginTop: 15,
                marginBottom: 2,
                letterSpacing: '-0.5px',

                textShadow: '0 2px 8px rgba(0,0,0,0.09)',
              }}
            >
              AI의 픽!
            </span>
            {/* 브랜드 원형 이미지 */}
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: '#fff',
                overflow: 'hidden',
                pointerEvents: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 2,
                boxShadow: '0 2px 10px rgba(18, 158, 223, 0.14)',
              }}
            >
              <img
                src={markerImg}
                alt={name || '매장'}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
                loading="lazy"
                decoding="async"
                onError={() => setImgError(true)}
              />
            </div>
          </div>
          {/* 꼬리(핀) */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 149,
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '18px solid transparent',
              borderRight: '18px solid transparent',
              borderTop: '30px solid #158c9f',
              zIndex: 0,
              filter: 'drop-shadow(2px 6px 10px rgba(22,100,180,0.12))',
            }}
          />
        </div>
        <CustomOverlayMap
          position={{ lat, lng }}
          zIndex={2}
          xAnchor={0.5}
          yAnchor={1.0}
        >
          <div className="relative -top-1">
            <div className="w-14 h-14 rounded-full bg-primaryGreen opacity-90 animate-ping" />
          </div>
        </CustomOverlayMap>
      </CustomOverlayMap>
    );
  },
);

export default CustomMarker;
