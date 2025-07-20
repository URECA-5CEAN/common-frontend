import { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three-stdlib';
import type { MarkerProps } from '../KakaoMapContainer';

interface ThreeJsMarkerProps {
  markers: MarkerProps[];
  map: kakao.maps.Map;
  setHoveredMarkerId: (id: number | null) => void;
  container: HTMLDivElement; // 3D마커 부착할 컨테이너
}

export default function ThreeJsMarker({
  markers,
  map,
  setHoveredMarkerId,
  container,
}: ThreeJsMarkerProps) {
  // Raycaster와 마우스 좌표, Three.js 컴포넌트(렌더러, 카메라, 씬) 참조
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  // 텍스처 캐시 및 마커 ID ↔ Mesh 맵핑
  const textureCache = useRef<Map<string, THREE.Texture>>(new Map());
  const meshMap = useRef<Map<string, THREE.Mesh>>(new Map());

  // 호버 해제 지연을 위한 타이머 및 마지막 호버 ID
  const hoverOutTimeout = useRef<number | null>(null);
  const lastHoverRef = useRef<number | null>(null);

  // 씬/카메라/렌더러 초기화
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
      pointerEvents: 'none', // 마우스 이벤트는 캔버스가 아니라 지도에 전달
      zIndex: '10',
    });
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    // 조명
    scene.add(new THREE.AmbientLight(0xffffff, 1));
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(0, 0, 1000);
    scene.add(light);

    // 마커 Mesh들을 보관할 그룹
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

  // 텍스처 로드 및 메쉬 빌드 markers 배열 변경 시마다 실행
  useEffect(() => {
    if (!map) return;
    const loader = new THREE.TextureLoader();
    //모든 이미지 로딩 완료 대기
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

  // 3) diff 기반 메쉬 추가/제거
  const buildOrUpdateMeshes = useCallback(() => {
    const group = groupRef.current!;
    const newIds = new Set(markers.map((m) => m.id));

    // a) 제거할 메쉬
    meshMap.current.forEach((mesh, id) => {
      if (!newIds.has(id)) {
        group.remove(mesh);
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => mat.dispose());
        } else {
          mesh.material.dispose();
        }
        meshMap.current.delete(id);
      }
    });

    // b) 추가할 메쉬
    markers.forEach((m) => {
      if (meshMap.current.has(m.id)) return; // 이미 있으면 재사용
      const tex = textureCache.current.get(m.imageUrl)!;
      const material = new THREE.MeshLambertMaterial({ map: tex });
      const cube = new THREE.Mesh(
        new RoundedBoxGeometry(60, 60, 60, 10, 5),
        material,
      );
      cube.name = m.id.toString();
      cube.rotation.set(Math.PI / 7, -Math.PI / 6, 0);
      // Pin
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
  }, [markers]);

  // 카메라 프로젝션을 사용해 위도/경도 → 화면 픽셀 위치로 변환
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
      // 화면 중심 대비 오프셋으로 위치 설정
      mesh.position.set(pt.x - cp.x, cp.y - pt.y, 50);
    });
    rendererRef.current?.render(sceneRef.current!, cameraRef.current!);
  };

  // 마우스 무브 이벤트로 Raycaster 충돌 검사
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
        // 마커 밖 이탈: 200ms 후 해제
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
  // 해당 컴포넌트는 화면에 직접 출력하는 DOM이 없으므로 null 반환
  return null;
}
