import clsx from 'clsx';
import { useEffect, useRef } from 'react';

interface LatLng {
  lat: number;
  lng: number;
  isDetail?: boolean;
}

export default function RoadviewViewer({ location }: { location: LatLng }) {
  const roadviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.kakao || !roadviewRef.current) return;

    const roadview = new kakao.maps.Roadview(roadviewRef.current);
    const roadviewClient = new kakao.maps.RoadviewClient();

    const position = new kakao.maps.LatLng(location.lat, location.lng);

    // 해당 위치 주변의 가장 가까운 로드뷰 ID 검색
    roadviewClient.getNearestPanoId(position, 50, (panoId) => {
      if (panoId) {
        roadview.setPanoId(panoId, position);
      }
    });
  }, [location]);

  return (
    <div
      ref={roadviewRef}
      className={clsx(
        location.isDetail ? 'fixed w-80 h-48 top-20 right-8' : 'w-full h-48 ',
        'hidden md:block',
      )}
    />
  );
}
