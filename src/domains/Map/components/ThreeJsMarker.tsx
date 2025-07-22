import { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three-stdlib';
import type { MarkerProps } from '../KakaoMapContainer';
import type { StoreInfo } from '../api/store';

interface ThreeJsMarkerProps {
  markers: MarkerProps[];
  map: kakao.maps.Map; // map 인스턴스
  stores: StoreInfo[]; // 매장정보 click 시 detail 창 열리기 위해
  setHoveredMarkerId: (id: string | null) => void; //hover Id 저장
  container: HTMLDivElement; // 3D 캔버스 삽입할 컨테이너 div
  openDetail: (store: StoreInfo) => void; // detail창 open
}

export default function ThreeJsMarker({
  markers,
  map,
  stores,
  setHoveredMarkerId,
  container,
  openDetail,
}: ThreeJsMarkerProps) {
  // Raycaster 및 마우스 좌표
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  // Three.js 렌더러, 카메라, 씬, 그룹 참조
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  // Texture 캐시 및 매쉬 매핑
  const textureCache = useRef<Map<string, THREE.Texture>>(new Map());
  const meshMap = useRef<Map<string, THREE.Mesh>>(new Map());
  //hover Time지연(오버레이 벗어날 경우 바로 없어징 방지)
  const hoverOutTimeout = useRef<number | null>(null);
  //마지막 hoverId
  const lastHoverRef = useRef<string | null>(null);
  // 이미지 브라우저 캐시 방지를 위한 timestamp(3D마커 생성 시 cors오류 방지)
  const imageTimestamp = useRef(Date.now()).current;

  // 메쉬 생성/삭제 로직
  const buildOrUpdateMeshes = useCallback(() => {
    const group = groupRef.current!;
    const newIds = new Set(markers.map((m) => m.id));

    // 기존 메쉬 중 제거할 것처리
    meshMap.current.forEach((mesh, id) => {
      if (!newIds.has(id)) {
        group.remove(mesh);
        mesh.geometry.dispose(); // dispose :  GPU 버퍼를 해제,메모리 누수를 방지
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => mat.dispose());
        } else {
          mesh.material.dispose();
        }
        meshMap.current.delete(id);
      }
    });

    // 새로 추가할 markers 처리
    markers.forEach((m) => {
      if (meshMap.current.has(m.id)) return;
      // 3d마커 생성 중 cors 문제 해결 (캐싱 방지)
      const url = /^data:image/.test(m.imageUrl)
        ? m.imageUrl
        : `${m.imageUrl}?ts=${imageTimestamp}`;
      const tex = textureCache.current.get(url)!;

      const cube = new THREE.Mesh(
        new RoundedBoxGeometry(40, 40, 40, 10, 5),
        new THREE.MeshPhongMaterial({
          color: '#f8f8f8',
          shininess: 10,
          depthTest: false,
          transparent: true,
        }),
      );
      cube.rotation.set(Math.PI / 7, -Math.PI / 6, 0);
      cube.name = m.id;
      // 2) 플레이트 (Plane) — 텍스처 온전하게 보이게
      const plateSize = 30; // 면보다 약간 작게
      const plateGeo = new THREE.PlaneGeometry(plateSize, plateSize);
      const plateMat = new THREE.MeshPhongMaterial({
        map: tex,
        shininess: 50,
        specular: 0xaaaaaa,
        transparent: true,
        depthTest: false,
      });
      const plate = new THREE.Mesh(plateGeo, plateMat);

      // 큐브 앞면 중앙(플레이트가 큐브 반면보다 살짝 앞에 있게)
      plate.position.set(0, 0, 20.5);
      cube.add(plate);

      const rightPlate = new THREE.Mesh(plateGeo, plateMat.clone());
      // X축 양(+) 방향으로 회전: Plane 기본은 XY평면 → X 면에 붙이려면 YZ평면으로 회전
      rightPlate.rotation.set(0, Math.PI / 2, 0);
      // X축 양 방향, 큐브 반폭(half-width=20)보다 살짝 바깥
      rightPlate.position.set(20.5, 0, 0);
      cube.add(rightPlate);

      //핀(cone) 생성
      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(25, 40, 20),
        new THREE.MeshLambertMaterial({
          color: 'red',
          transparent: true,
          opacity: 0.4,
          depthWrite: false,
        }),
      );
      plate.name = m.id;
      rightPlate.name = m.id;
      cone.name = m.id;
      cone.rotation.x = Math.PI;
      cone.position.set(0, -35, 0);

      // 그룹에 추가 및 맵핑 저장
      cube.add(cone);
      group.add(cube);
      group.position.set(0, 40, 0);
      meshMap.current.set(m.id, cube);
    });

    updatePositions();
  }, [markers, imageTimestamp]);

  // Texture 로드 후 buildOrUpdateMeshes 호출
  useEffect(() => {
    if (!map) return;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    // 모든 마커 텍스처를 비동기로 로드
    Promise.all(
      markers.map(
        (m) =>
          new Promise<void>((res) => {
            const url = /^data:image/.test(m.imageUrl)
              ? m.imageUrl
              : `${m.imageUrl}?ts=${imageTimestamp}`;
            if (textureCache.current.has(url)) return res();
            loader.load(url, (tex) => {
              textureCache.current.set(url, tex);
              res();
            });
          }),
      ),
    ).then(buildOrUpdateMeshes);
  }, [map, markers, imageTimestamp, buildOrUpdateMeshes]);

  // Scene, Camera, Renderer 초기화 및 지도 리사이즈 이벤트로 캔버스 재조정
  useEffect(() => {
    if (!container || !map) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
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
      pointerEvents: 'none', //none을 하여 지도 드래그/휠 유지 auto하면 드래그 및 줌인 불가
      zIndex: '2',
    });
    container.insertBefore(renderer.domElement, container.firstChild);
    rendererRef.current = renderer;

    // 조명
    scene.add(new THREE.AmbientLight(0xffffff, 1));
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(0, 0, 1000);
    scene.add(light);

    const group = new THREE.Group();
    scene.add(group);
    groupRef.current = group;

    // 리사이즈 핸들러
    const handleResize = () => {
      const W = container.clientWidth;
      const H = container.clientHeight;
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

      if (renderer.domElement.parentNode === container)
        container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [container, map]);

  // 3D 메쉬 위치를 지도 좌표에 맞춰 업데이트
  const updatePositions = () => {
    if (!map) return;
    const proj = map.getProjection();
    if (!proj) return;
    const centerPt = proj.containerPointFromCoords(map.getCenter()); //화면 픽셀 좌표로 변환
    meshMap.current.forEach((mesh, id) => {
      const m = markers.find((x) => x.id === id);
      if (!m) return;
      const pt = proj.containerPointFromCoords(
        new kakao.maps.LatLng(m.lat, m.lng),
      );
      mesh.position.set(pt.x - centerPt.x, centerPt.y - pt.y, 50); // 화면 픽셀 좌표(pt)로 변환 z축을 50으로 고정해 카메라 앞쪽에 배치
    });
    rendererRef.current?.render(sceneRef.current!, cameraRef.current!); // 렌더링 갱신
  };

  // mousemove 이벤트로 3D 마커 hover 처리
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      //마우스 위치 게산
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      //Raycaster 초기화
      raycaster.current.setFromCamera(mouse.current, cameraRef.current!);

      //화면 내 모든 마커와 충돌 검사
      const hits = raycaster.current.intersectObjects(
        Array.from(meshMap.current.values()),
      );
      if (hits.length) {
        // hover시 바로 hover ID 갱신
        if (hoverOutTimeout.current) clearTimeout(hoverOutTimeout.current);
        const id = hits[0].object.name;
        lastHoverRef.current = id;
        setHoveredMarkerId(id);
      } else if (lastHoverRef.current) {
        // 충돌 없으면 200ms 지연 후 hover 해제
        if (hoverOutTimeout.current) clearTimeout(hoverOutTimeout.current);
        hoverOutTimeout.current = window.setTimeout(() => {
          lastHoverRef.current = null;
          setHoveredMarkerId(null);
        }, 200);
      }
    };
    container.addEventListener('mousemove', handleMove);
    return () => container.removeEventListener('mousemove', handleMove);
  }, [container, markers, setHoveredMarkerId]);

  // click 이벤트로 3D 메쉬 클릭 감지 후 상세보기 호출
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.current.setFromCamera(mouse.current, cameraRef.current!);
      const hits = raycaster.current.intersectObjects(
        Array.from(meshMap.current.values()),
      );
      if (hits.length) {
        const hitId = hits[0].object.name;
        const store = stores.find((s) => s.id === hitId);
        if (store) openDetail(store);
      }
    };
    container.addEventListener('click', handleClick);
    return () => container.removeEventListener('click', handleClick);
  }, [container, stores, openDetail]);

  return null;
}
