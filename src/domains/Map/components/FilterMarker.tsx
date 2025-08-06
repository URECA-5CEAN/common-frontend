import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
  Suspense,
  lazy,
  memo,
} from 'react';
import { MarkerClusterer } from 'react-kakao-maps-sdk';
import { useMedia } from 'react-use';
import type { LatLng } from '../KakaoMapContainer';
import type { StoreInfo } from '../api/store';
import { getDistance } from '../utils/getDistance';
import type { LocationInfo } from '../pages/MapPage';
import { Ring } from 'ldrs/react';
import type { Panel } from './sidebar/MapSidebar';
import CustomMarker from './CustomMarker';

const StoreOverlay = lazy(() => import('./StoreOverlay'));

interface Props {
  hoveredMarkerId?: string | null; // 현재 호버된 마커 ID
  setHoveredMarkerId: (id: string | null) => void;
  stores: StoreInfo[]; // 제휴처 목록
  map?: kakao.maps.Map | null; // Kakao Map 인스턴스
  containerRef?: React.RefObject<HTMLDivElement | null>; // 지도+캔버스 컨테이너
  openDetail: (store: StoreInfo) => void; // 클릭 시 상세 열기
  onStartChange: (v: LocationInfo) => void; // 출발지 변경
  onEndChange: (v: LocationInfo) => void; // 도착지 변경
  toggleBookmark: (store: StoreInfo) => void;
  bookmarkIds: Set<string>;
  center: LatLng;
  selectedCardId: string;
  setSelectedCardId: React.Dispatch<React.SetStateAction<string>>;
  goToStore: (store: StoreInfo) => void;
  panel: Panel;
}
function FilterMarker({
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
  selectedCardId,
  setSelectedCardId,
  goToStore,
  panel,
}: Props) {
  // hover 해제 지연용 타이머 ID 저장
  const hoverOutRef = useRef<number | null>(null);
  //2d마커

  // 오버레이 위치와 스토어 정보 저장
  const [overlay, setOverlay] = useState<{
    x: number;
    y: number;
    store: StoreInfo;
  } | null>(null);

  const Markers = useMemo(() => {
    if (!map) return [];
    if (panel.menu === '길찾기') return [];
    const level = map.getLevel?.() ?? 5;
    let candidates = stores;
    if (level <= 6) {
      candidates = stores
        .map((m) => ({
          marker: m,
          distance: getDistance(center, { lat: m.latitude, lng: m.longitude }),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, level <= 2 ? 60 : level <= 4 ? 40 : 30)
        .map((item) => item.marker);
    } else {
      candidates = stores.slice(0, 100);
    }
    return candidates.map((m) => ({
      id: m.id,
      lat: m.latitude,
      lng: m.longitude,
      imageUrl: m.brandImageUrl ?? '',
      isRecommended: m.isRecommended ?? '',
    }));
  }, [stores, map, panel.menu, center]);

  // stores 배열을 Map으로 변환
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
      if (store) {
        setSelectedCardId(id);
        openDetail(store);
        goToStore(store);
      }
    },
    [openDetail, goToStore, storeMap, setSelectedCardId],
  );

  // const visibleMarkers = useMemo(() => {
  //   if (!map) return Markers;
  //   const bounds = map.getBounds();
  //   // 실제 화면에 보이는 마커만 필터링
  //   return Markers.filter((m) => {
  //     const pos = new kakao.maps.LatLng(m.lat, m.lng);
  //     return bounds.contain(pos);
  //   });
  // }, [Markers, map]);

  const visibleMarkers = useMemo(() => {
    return Markers;
  }, [Markers]);

  // 마커 개수에 따라 클러스터링 여부 결정
  const shouldCluster = Markers.length > 10;

  // 2D 마커 렌더링 함수 분리
  const renderFarMarkers = useCallback(
    () =>
      visibleMarkers.map((m, idx) => (
        <CustomMarker
          key={m.id && m.id.trim() !== '' ? m.id : `unknown-${idx}`}
          id={m.id}
          lat={m.lat}
          lng={m.lng}
          imageUrl={m.imageUrl}
          isRecommended={m.isRecommended}
          selected={selectedCardId === m.id}
          onClick={handleClick}
          onMouseEnter={handleMouseOver}
          onMouseLeave={handleMouseOut}
          shouldCluster={shouldCluster}
        />
      )),
    [
      visibleMarkers,
      selectedCardId,
      handleClick,
      handleMouseOver,
      handleMouseOut,
      shouldCluster,
    ],
  );

  // 데스크톱 여부 판단 (모바일에서 오버레이 안뜨게)
  const isDesktop = useMedia('(min-width: 800px)');

  if (panel.menu === '길찾기') return null;
  return (
    <>
      {/* 클러스터링 분기 */}
      {shouldCluster ? (
        <MarkerClusterer
          averageCenter
          minLevel={7}
          gridSize={200}
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
        <Suspense
          fallback={
            <Ring size="24" stroke="3" bgOpacity="0" speed="2" color="white" />
          }
        >
          <div
            style={{
              position: 'fixed',
              left: overlay.x,
              top: overlay.y,
              transform: 'translate(-48%, -130%)',
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

export default memo(FilterMarker);
