// src/components/ThreeJsMarker.tsx
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three-stdlib';
import type { MarkerProps } from './KakaoMapContainer';

interface ThreeJsMarkerProps {
  markers: MarkerProps[];
  map: kakao.maps.Map;
  setHoveredMarkerId: (id: number | null) => void;
  container: HTMLDivElement;
}

export default function ThreeJsMarker({
  markers,
  map,
  setHoveredMarkerId,
  container,
}: ThreeJsMarkerProps) {
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.OrthographicCamera>();
  const sceneRef = useRef<THREE.Scene>();
  const groupRef = useRef<THREE.Group>();
  const textureCache = useRef<Map<string, THREE.Texture>>(new Map());
  const meshMap = useRef<Map<number, THREE.Mesh>>(new Map());
  const hoverOutTimeout = useRef<number | null>(null);
  const lastHoverRef = useRef<number | null>(null);

  // 1) 씬/카메라/렌더러 초기화
  useEffect(() => {
    if (!container || !map) return;
    const w = container.clientWidth,
      h = container.clientHeight;
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.OrthographicCamera(
      -w / 2,
      w / 2,
      h / 2,
      -h / 2,
      1,
      2000,
    );
    camera.position.set(0, 0, 1000);
    cameraRef.current = camera;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    Object.assign(renderer.domElement.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      pointerEvents: 'none',
      zIndex: '10',
    });
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    scene.add(new THREE.AmbientLight(0xffffff, 1));
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(0, 0, 1000);
    scene.add(light);
    const group = new THREE.Group();
    scene.add(group);
    groupRef.current = group;

    const handleResize = () => {
      const W = container.clientWidth,
        H = container.clientHeight;
      camera.left = -W / 2;
      camera.right = W / 2;
      camera.top = H / 2;
      camera.bottom = -H / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
      updatePositions();
    };
    window.addEventListener('resize', handleResize);
    kakao.maps.event.addListener(map, 'idle', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      kakao.maps.event.removeListener(map, 'idle', handleResize);
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [container, map]);

  // 2) 텍스처 로드 및 메쉬 빌드
  useEffect(() => {
    if (!map) return;
    const loader = new THREE.TextureLoader();
    Promise.all(
      markers.map(
        (m) =>
          new Promise<void>((res) => {
            if (textureCache.current.has(m.imageUrl)) return res();
            loader.load(m.imageUrl, (tex) => {
              textureCache.current.set(m.imageUrl, tex);
              res();
            });
          }),
      ),
    ).then(buildOrUpdateMeshes);
  }, [map, markers]);

  const buildOrUpdateMeshes = () => {
    const group = groupRef.current!;
    meshMap.current.forEach((mesh) => {
      group.remove(mesh);
      mesh.geometry.dispose();
      if (Array.isArray(mesh.material))
        mesh.material.forEach((mat) => mat.dispose());
      else mesh.material.dispose();
    });
    meshMap.current.clear();

    markers.forEach((m) => {
      const texture = textureCache.current.get(m.imageUrl) || null;
      const material = new THREE.MeshLambertMaterial({ map: texture });
      const cube = new THREE.Mesh(
        new RoundedBoxGeometry(60, 60, 60, 10, 5),
        material,
      );
      cube.name = m.id.toString();
      cube.rotation.set(Math.PI / 7, -Math.PI / 6, 0);
      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(30, 40, 16),
        new THREE.MeshLambertMaterial({
          color: 'red',
          transparent: true,
          opacity: 0.4,
          depthWrite: false,
        }),
      );
      cone.rotation.x = Math.PI;
      cone.position.set(0, -55, 0);
      cube.add(cone);
      group.add(cube);
      meshMap.current.set(m.id, cube);
    });

    updatePositions();
  };

  // 3) 메쉬 위치 업데이트
  const updatePositions = () => {
    if (!map) return;
    const proj = map.getProjection();
    if (!proj) return;
    const cp = proj.containerPointFromCoords(map.getCenter());
    meshMap.current.forEach((mesh, id) => {
      const m = markers.find((x) => x.id === id);
      if (!m) return;
      const pt = proj.containerPointFromCoords(
        new kakao.maps.LatLng(m.lat, m.lng),
      );
      mesh.position.set(pt.x - cp.x, cp.y - pt.y, 50);
    });
    rendererRef.current?.render(sceneRef.current!, cameraRef.current!);
  };

  // 4) Raycaster hover 감지 (해제는 300ms 지연)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.current.setFromCamera(mouse.current, cameraRef.current!);
      const hits = raycaster.current.intersectObjects(
        Array.from(meshMap.current.values()),
      );

      if (hits.length) {
        // 마커 위 진입: 지연 해제 타이머 취소
        if (hoverOutTimeout.current) clearTimeout(hoverOutTimeout.current);
        const id = Number(hits[0].object.name);
        lastHoverRef.current = id;
        setHoveredMarkerId(id);
      } else if (lastHoverRef.current != null) {
        // 마커 밖 이탈: 300ms 후 해제
        if (hoverOutTimeout.current) clearTimeout(hoverOutTimeout.current);
        hoverOutTimeout.current = window.setTimeout(() => {
          lastHoverRef.current = null;
          setHoveredMarkerId(null);
        }, 200);
      }
    };
    container.addEventListener('mousemove', handler);
    return () => container.removeEventListener('mousemove', handler);
  }, [container, markers, setHoveredMarkerId]);

  return null;
}
