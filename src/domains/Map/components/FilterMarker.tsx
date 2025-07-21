import React, { useRef, useState, useEffect, useMemo } from 'react';
import { MapMarker } from 'react-kakao-maps-sdk';
import StoreOverlay from './StoreOverlay';
import type { MarkerProps } from '../KakaoMapContainer';
import type { StoreInfo } from '../api/store';
import { MarkerClusterer } from 'react-kakao-maps-sdk';
interface Props {
  nearbyMarkers: MarkerProps[]; //3d마커
  farMarkers: MarkerProps[]; //2D마커
  hoveredMarkerId?: string | null;
  setHoveredMarkerId: (id: string | null) => void;
  stores: StoreInfo[]; //제휴처
  map?: kakao.maps.Map | null;
  containerRef?: React.RefObject<HTMLDivElement | null>; // 지도+캔버스 컨테이너
  openDetail: (store: StoreInfo) => void; //click시 상세보기 open
}

export default function FilterMarker({
  nearbyMarkers,
  farMarkers,
  hoveredMarkerId,
  setHoveredMarkerId,
  stores,
  map,
  containerRef,
  openDetail,
}: Props) {
  // hover 해제 지연용 타이머 ID 저장
  const hoverOutRef = useRef<number | null>(null);
  //오버레이에 전해줄 값
  const [overlay, setOverlay] = useState<{
    x: number;
    y: number;
    store: StoreInfo;
  } | null>(null);

  // allMarkers를 useMemo로 묶어 nearbyMarkers/farMarkers가 바뀔 때만 재계산
  const allMarkers = useMemo(
    () => [...nearbyMarkers, ...farMarkers],
    [nearbyMarkers, farMarkers],
  );

  // hoveredMarkerId가 바뀔 때마다 overlay 위치 계산
  useEffect(() => {
    if (!hoveredMarkerId || !map) {
      setOverlay(null);
      return;
    }
    //마커와 제휴처 찾기
    const m = allMarkers.find((x) => x.id === hoveredMarkerId);
    const store = stores.find((s) => s.id === hoveredMarkerId);
    const container = containerRef?.current;
    if (!m || !store || !container) {
      setOverlay(null);
      return;
    }
    //위도,경도 → 화면 픽셀로 변환
    const proj = map.getProjection();
    const pt = proj.containerPointFromCoords(
      new kakao.maps.LatLng(m.lat, m.lng),
    );
    const rect = container.getBoundingClientRect();
    // overlay에 위도경도와 제휴처 정보 저장
    setOverlay({
      x: pt.x + rect.left,
      y: pt.y + rect.top,
      store,
    });
  }, [hoveredMarkerId, allMarkers, stores, map, containerRef]);

  // farMarkers 개수에 따라 클러스터링 여부 결정
  const shouldCluster = farMarkers.length > 20;
  return (
    <>
      {shouldCluster ? (
        <MarkerClusterer
          averageCenter={true}
          minLevel={5} // 줌 레벨 5 이상에서 클러스터 해체
          gridSize={50} // 클러스터 반경(px)
          styles={[
            {
              width: '53px',
              height: '52px',
              color: '#ffffff',
              backgroundColor: '#6FC3D1',
              border: '2px solid #ffffff',
              borderRadius: '50%',
              textAlign: 'center',
              lineHeight: '52px',
              boxShadow: '0 2px 2px rgba(12, 16, 233, 0.329)',
              zIndex: 10,
            },
          ]}
        >
          {farMarkers.map((m) => {
            //마커에 해당하는 제휴처 찾기
            const store = stores.find((s) => s.id === m.id);
            if (!store) return null;
            return (
              <MapMarker
                key={m.id}
                position={{ lat: m.lat, lng: m.lng }}
                onClick={() => openDetail(store)}
                image={{
                  src: `/s3-bucket/${m.imageUrl.split('/').pop()!}`, //클러스팅
                  size: { width: 40, height: 40 },
                  options: { offset: { x: 20, y: 40 } },
                }}
                zIndex={1}
                onMouseOver={() => {
                  if (hoverOutRef.current) clearTimeout(hoverOutRef.current);
                  setHoveredMarkerId(m.id);
                }}
                onMouseOut={() => {
                  if (hoverOutRef.current) clearTimeout(hoverOutRef.current);
                  hoverOutRef.current = window.setTimeout(
                    () => setHoveredMarkerId(null),
                    300,
                  );
                }}
              />
            );
          })}
        </MarkerClusterer>
      ) : (
        farMarkers.map((m) => {
          const store = stores.find((s) => s.id === m.id);
          if (!store) return null;
          return (
            <MapMarker
              key={m.id}
              position={{ lat: m.lat, lng: m.lng }}
              onClick={() => openDetail(store)}
              image={{
                src: m.imageUrl,
                size: { width: 40, height: 40 },
                options: { offset: { x: 20, y: 40 } },
              }}
              zIndex={1}
              onMouseOver={() => {
                if (hoverOutRef.current) clearTimeout(hoverOutRef.current);
                setHoveredMarkerId(m.id);
              }}
              onMouseOut={() => {
                if (hoverOutRef.current) clearTimeout(hoverOutRef.current);
                hoverOutRef.current = window.setTimeout(
                  () => setHoveredMarkerId(null),
                  300,
                );
              }}
            />
          );
        })
      )}
      {overlay && (
        <div
          style={{
            position: 'absolute',
            left: overlay.x,
            top: overlay.y,
            transform: 'translate(-50%, -120%)',
            pointerEvents: 'auto', // overlay 상호작용 허용
            zIndex: 9999,
          }}
          onMouseEnter={() => {
            if (hoverOutRef.current) clearTimeout(hoverOutRef.current);
          }}
          onMouseLeave={() => {
            if (hoverOutRef.current) clearTimeout(hoverOutRef.current);
            hoverOutRef.current = window.setTimeout(
              () => setHoveredMarkerId(null),
              200,
            );
          }}
        >
          <StoreOverlay
            lat={overlay.store.latitude}
            lng={overlay.store.longitude}
            store={overlay.store}
          />
        </div>
      )}
    </>
  );
}
