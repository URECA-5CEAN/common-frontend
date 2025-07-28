import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
  Suspense,
  lazy,
} from 'react';
import {
  CustomOverlayMap,
  MapMarker,
  MarkerClusterer,
} from 'react-kakao-maps-sdk';
import { useMedia } from 'react-use';
import type { LatLng, MarkerProps } from '../KakaoMapContainer';
import type { StoreInfo } from '../api/store';
import { getDistance } from '../utils/getDistance';

const StoreOverlay = lazy(() => import('./StoreOverlay'));

interface Props {
  hoveredMarkerId?: string | null; // 현재 호버된 마커 ID
  setHoveredMarkerId: (id: string | null) => void;
  stores: StoreInfo[]; // 제휴처 목록
  map?: kakao.maps.Map | null; // Kakao Map 인스턴스
  containerRef?: React.RefObject<HTMLDivElement | null>; // 지도+캔버스 컨테이너
  openDetail: (store: StoreInfo) => void; // 클릭 시 상세 열기
  onStartChange: (v: string) => void; // 출발지 변경
  onEndChange: (v: string) => void; // 도착지 변경
  toggleBookmark: (store: StoreInfo) => void;
  bookmarkIds: Set<string>;
  center: LatLng;
}

export default function FilterMarker({
  hoveredMarkerId,
  setHoveredMarkerId,
  stores,
  map,
  containerRef,
  openDetail,
  onStartChange,
  onEndChange,
  toggleBookmark,
  bookmarkIds,
  center,
}: Props) {
  // hover 해제 지연용 타이머 ID 저장
  const hoverOutRef = useRef<number | null>(null);
  //2d마커
  const [Markers, SetMarkers] = useState<MarkerProps[]>([]);
  // 오버레이 위치와 스토어 정보 저장
  const [overlay, setOverlay] = useState<{
    x: number;
    y: number;
    store: StoreInfo;
  } | null>(null);

  useEffect(() => {
    if (!map) return;

    const handleIdle = () => {
      const level = map.getLevel!();
      const max2D = level <= 2 ? 20 : level <= 4 ? 30 : level <= 6 ? 40 : 50;
      const enriched2D = stores
        .map((m) => ({
          marker: m,
          distance: getDistance(center, {
            lat: m.latitude,
            lng: m.longitude,
          }),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, max2D)
        .map((item) => ({
          id: item.marker.id,
          lat: item.marker.latitude,
          lng: item.marker.longitude,
          imageUrl: item.marker.brandImageUrl ?? '',
          isRecommended: item.marker.isRecommended ?? '',
        }));

      SetMarkers(enriched2D);
    };

    kakao.maps.event.addListener(map, 'idle', handleIdle);
    handleIdle();

    return () => {
      kakao.maps.event.removeListener(map, 'idle', handleIdle);
    };
  }, [map, center, stores]);

  // 2) stores 배열을 Map으로 변환
  const storeMap = useMemo(() => {
    const m = new Map<string, StoreInfo>();
    stores.forEach((s) => m.set(s.id, s));
    return m;
  }, [stores]);

  // hoveredMarkerId가 바뀔 때마다 오버레이 위치 계산
  useEffect(() => {
    if (!hoveredMarkerId || !map) {
      setOverlay(null);
      return;
    }
    // 호버 된 마커
    const marker = Markers.find((x) => x.id === hoveredMarkerId);
    const store = storeMap.get(hoveredMarkerId);
    const container = containerRef?.current;
    if (!marker || !store || !container) {
      setOverlay(null);
      return;
    }
    // 위도/경도 → 픽셀 좌표 변환
    const proj = map.getProjection();
    const pt = proj.containerPointFromCoords(
      new kakao.maps.LatLng(marker.lat, marker.lng),
    );
    const rect = container.getBoundingClientRect();
    // 화면 절대 좌표 계산 후 저장
    setOverlay({
      x: pt.x + rect.left,
      y: pt.y + rect.top,
      store,
    });
  }, [hoveredMarkerId, Markers, storeMap, map, containerRef]);

  //MouseOver 함수
  const handleMouseOver = useCallback(
    (id: string) => {
      if (hoverOutRef.current) window.clearTimeout(hoverOutRef.current);
      setHoveredMarkerId(id);
    },
    [setHoveredMarkerId],
  );
  //MouseOut 함수
  const handleMouseOut = useCallback(() => {
    if (hoverOutRef.current) window.clearTimeout(hoverOutRef.current);
    hoverOutRef.current = window.setTimeout(() => {
      setHoveredMarkerId(null);
    }, 300);
  }, [setHoveredMarkerId]);

  //클릭 시 detial창 오픈
  const handleClick = useCallback(
    (id: string) => {
      const store = storeMap.get(id);
      if (store) openDetail(store);
    },
    [openDetail, storeMap],
  );

  // MarkerImage 생성 함수 useMemo로 메모이제이션
  const createMarkerImage = useMemo(() => {
    return (imageUrl: string) => {
      const src = imageUrl;
      return {
        src,
        size: { width: 40, height: 40 },
        options: {
          offset: { x: 20, y: 40 },
        },
      } as const;
    };
  }, []);
  // 2D 마커 렌더링 함수 분리
  const renderFarMarkers = () =>
    Markers.map((m, idx) => {
      const markerImage = createMarkerImage(m.imageUrl);

      return (
        <React.Fragment key={`${m.id}-${idx}`}>
          {/* 기본 마커 */}
          <MapMarker
            position={{ lat: m.lat, lng: m.lng }}
            image={markerImage}
            zIndex={shouldCluster ? 2 : 3}
            onClick={() => handleClick(m.id)}
            onMouseOver={() => handleMouseOver(m.id)}
            onMouseOut={handleMouseOut}
          />

          {/* AI추천 마커 애니메이션 효과 */}
          {m.isRecommended && (
            <CustomOverlayMap
              position={{ lat: m.lat + 0.00005, lng: m.lng }}
              zIndex={2}
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-primaryGreen opacity-80 animate-ping " />
              </div>
            </CustomOverlayMap>
          )}
        </React.Fragment>
      );
    });

  // 마커 개수에 따라 클러스터링 여부 결정
  const shouldCluster = Markers.length > 20;
  // 데스크톱 여부 판단 (모바일에서 오버레이 안뜨게)
  const isDesktop = useMedia('(min-width: 640px)');

  return (
    <>
      {/* 클러스터링 분기 */}
      {shouldCluster ? (
        <MarkerClusterer
          averageCenter
          minLevel={6}
          gridSize={50}
          styles={[
            {
              width: '50px',
              height: '50px',
              color: '#ffffff',
              backgroundColor: '#6FC3D1',
              border: '2px solid #ffffff',
              borderRadius: '50%',
              textAlign: 'center',
              lineHeight: '50px',
              boxShadow: '0 2px 2px rgba(12, 16, 233, 0.329)',
              zIndex: 3,
            },
          ]}
        >
          {renderFarMarkers()}
        </MarkerClusterer>
      ) : (
        renderFarMarkers()
      )}

      {/* 오버레이 데스크톱에서만, Suspense로 lazy 로딩) */}
      {overlay && isDesktop && (
        <Suspense fallback={null}>
          <div
            style={{
              position: 'fixed',
              left: overlay.x,
              top: overlay.y,
              transform: 'translate(-50%, -120%)',
              pointerEvents: 'auto',
              zIndex: 2,
            }}
            onMouseEnter={() => {
              if (hoverOutRef.current) window.clearTimeout(hoverOutRef.current);
            }}
            onMouseLeave={handleMouseOut}
          >
            <StoreOverlay
              lat={overlay.store.latitude}
              lng={overlay.store.longitude}
              store={overlay.store}
              onStartChange={onStartChange}
              onEndChange={onEndChange}
              toggleBookmark={toggleBookmark}
              isBookmark={bookmarkIds.has(overlay.store.id)}
            />
          </div>
        </Suspense>
      )}
    </>
  );
}
