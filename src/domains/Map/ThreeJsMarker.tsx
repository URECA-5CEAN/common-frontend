import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { MarkerProps } from './KakaoMapContainer';

interface ThreeJsMarkerProps {
  markers: MarkerProps[];
  map: kakao.maps.Map;
}

const ThreeJsMarker = ({ markers, map }: ThreeJsMarkerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.OrthographicCamera>();
  const sceneRef = useRef<THREE.Scene>();
  const groupRef = useRef<THREE.Group>();

  useEffect(() => {
    if (!map || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Three.js 기본 설정
    const scene = new THREE.Scene();
    sceneRef.current = scene; 

    const camera = new THREE.OrthographicCamera(
      -width / 2,
      width / 2,
      height / 2,
      -height / 2,
      0.1,
      2000,
    );
    camera.position.z = 1000;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.pointerEvents = 'none';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const group = new THREE.Group();
    scene.add(group);
    groupRef.current = group;

    const projection = map.getProjection();
    if (!projection) return;

    // 마커 렌더링
    markers.forEach((marker) => {
      const coords = new kakao.maps.LatLng(marker.lat, marker.lng);
      const point = projection.containerPointFromCoords(coords);
      const x = point.x - width / 2;
      const y = height / 2 - point.y;

      const geometry = new THREE.BoxGeometry(40, 40, 40);
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(x, y, 0);
      group.add(cube);
    });

    renderer.render(scene, camera);

    return () => {
      renderer.dispose();
      container.innerHTML = '';
    };
  }, [markers, map]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    />
  );
};

export default ThreeJsMarker;
