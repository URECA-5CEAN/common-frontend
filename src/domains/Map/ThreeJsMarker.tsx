// src/components/ThreeJsMarker.tsx
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three-stdlib';
import type { MarkerProps } from './KakaoMapContainer';

interface ThreeJsMarkerProps {
  markers: MarkerProps[];
  map: kakao.maps.Map;
  hoveredMarkerId?: number | null;
  setHoveredMarkerId?: (id: number | null) => void;
  container?: HTMLDivElement; // MapPage에서 넘겨받은 ref
}

export default function ThreeJsMarker({
  markers,
  map,
  hoveredMarkerId,
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
  const overlayRef = useRef<kakao.maps.CustomOverlay | null>(null);

  // 1) 씬/카메라/렌더러 초기화
  useEffect(() => {
    if (!container || !map) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.OrthographicCamera(
      -width / 2,
      width / 2,
      height / 2,
      -height / 2,
      1,
      2000,
    );
    camera.position.set(0, 0, 1000);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.pointerEvents = 'none'; // 지도의 이벤트 통과
    renderer.domElement.style.zIndex = '10';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Light + Group
    scene.add(new THREE.AmbientLight(0xffffff, 1));
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(0, 0, 1000);
    scene.add(light);

    const group = new THREE.Group();
    scene.add(group);
    groupRef.current = group;

    // 리사이즈 & idle 시 위치 업데이트
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.left = -w / 2;
      camera.right = w / 2;
      camera.top = h / 2;
      camera.bottom = -h / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
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

  // 2) 마커 Mesh 생성/업데이트
  const buildOrUpdateMeshes = () => {
    const group = groupRef.current!;
    meshMap.current.forEach((m) => {
      group.remove(m);
      m.geometry.dispose();
      Array.isArray(m.material)
        ? m.material.forEach((x) => x.dispose())
        : m.material.dispose();
    });
    meshMap.current.clear();

    markers.forEach((m) => {
      const tex = textureCache.current.get(m.imageUrl) || null;
      const mat = new THREE.MeshLambertMaterial({
        map: tex,
        color: tex ? undefined : 0x888888,
      });
      const cube = new THREE.Mesh(
        new RoundedBoxGeometry(60, 60, 60, 10, 5),
        mat,
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

  // 3) 좌표 → 화면 위치 변환하여 mesh position 업데이트
  const updatePositions = () => {
    if (!map) return;
    const proj = map.getProjection();
    if (!proj) return;
    const center = map.getCenter();
    const cp = proj.containerPointFromCoords(center);

    meshMap.current.forEach((mesh, id) => {
      const mk = markers.find((x) => x.id === id)!;
      if (!mk) return;
      const p = proj.containerPointFromCoords(
        new kakao.maps.LatLng(mk.lat, mk.lng),
      );
      mesh.position.set(p.x - cp.x, cp.y - p.y, 50);
    });

    rendererRef.current?.render(sceneRef.current!, cameraRef.current!);
  };

  // 4) 텍스처 로드 & 메쉬 빌드
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

  // 5) hover 상태 변화 시 CustomOverlay 생성/삭제
  useEffect(() => {
    // 기존 오버레이 삭제
    overlayRef.current?.setMap(null);
    overlayRef.current = null;

    if (hoveredMarkerId != null) {
      // markers 배열에서 id가 일치하는 마커를 찾되, 없으면 그냥 빠져나오기
      const mk = markers.find((x) => x.id === hoveredMarkerId);
      if (!mk) return; // mk가 undefined면 그냥 종료

      const ov = new kakao.maps.CustomOverlay({
        map,
        position: new kakao.maps.LatLng(mk.lat, mk.lng),
        content: `
          <div style="
            background:white;
            padding:6px 10px;
            border-radius:8px;
            box-shadow:0 2px 8px rgba(0,0,0,0.3);
            font-size:22px;
            white-space:nowrap;
            
          ">
            📍 3D마커 ID: ${mk.id}
          </div>`,
        yAnchor: 2.2,
      });
      overlayRef.current = ov;
    }
  }, [hoveredMarkerId, markers, map]);

  const last3DHoverRef = useRef<number | null>(null);

  // 6) 부모 container에만 mousemove 이벤트 등록 (지도의 드래그 보존)
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.current.setFromCamera(mouse.current, cameraRef.current!);
      const hits = raycaster.current.intersectObjects(
        Array.from(meshMap.current.values()),
      );

      if (hits.length) {
        // 3D 마커 위 호버 감지
        const id = Number(hits[0].object.name);
        last3DHoverRef.current = id;
        setHoveredMarkerId(id);
      } else {
        // 3D에서는 호버하지 않을 때만 해제
        if (last3DHoverRef.current !== null) {
          last3DHoverRef.current = null;
          setHoveredMarkerId(null);
        }
        // (2D 마커 위에 있을 때는 last3DHoverRef.current===null 이므로 아무 것도 안 함)
      }
    };

    container.addEventListener('mousemove', onMouseMove);
    return () => {
      container.removeEventListener('mousemove', onMouseMove);
    };
  }, [container, markers]);

  return null;
}
