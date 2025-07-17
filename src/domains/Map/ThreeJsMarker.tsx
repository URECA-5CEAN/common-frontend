import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three-stdlib';
import type { MarkerProps } from './KakaoMapContainer';

interface ThreeJsMarkerProps {
  markers: MarkerProps[];
  map: kakao.maps.Map;
}

export default function ThreeJsMarker({ markers, map }: ThreeJsMarkerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const textureCacheRef = useRef<Map<string, THREE.Texture>>(new Map());
  const markerMeshesRef = useRef<THREE.Mesh[]>([]);

  const renderScene = () => {
    if (rendererRef.current && cameraRef.current && sceneRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  };

  const updatePositions = () => {
    if (!map || !cameraRef.current || !groupRef.current) return;

    const projection = map.getProjection();
    if (!projection) return;

    const center = map.getCenter();
    const centerPoint = projection.containerPointFromCoords(center);
    const cx = centerPoint.x;
    const cy = centerPoint.y;

    markers.forEach((marker, index) => {
      const point = projection.containerPointFromCoords(
        new window.kakao.maps.LatLng(marker.lat, marker.lng),
      );
      const x = point.x - cx;
      const y = cy - point.y;

      const mesh = markerMeshesRef.current[index];
      if (mesh) {
        mesh.position.set(x, y, 50);
      }
    });

    renderScene();
  };

  const updateMarkers = () => {
    const group = groupRef.current;
    if (!group) return;

    // 기존 메쉬 제거
    markerMeshesRef.current.forEach((mesh) => {
      group.remove(mesh);
      mesh.geometry.dispose();
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((m) => m.dispose());
      } else {
        mesh.material.dispose();
      }
    });
    markerMeshesRef.current = [];

    // 새로운 마커 생성
    markers.forEach((marker) => {
      const texture = textureCacheRef.current.get(marker.imageUrl);
      const material = new THREE.MeshLambertMaterial({
        map: texture,
        color: texture ? undefined : 0xdddddd,
      });

      const cube = new THREE.Mesh(
        new RoundedBoxGeometry(60, 60, 60, 10, 5),
        material,
      );
      cube.rotation.x = THREE.MathUtils.degToRad(25);
      cube.rotation.y = THREE.MathUtils.degToRad(-30);

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
      markerMeshesRef.current.push(cube);
    });

    updatePositions();
  };

  const buildScene = () => {
    const container = containerRef.current;
    if (!container || !map) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

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
    camera.position.set(0, 0, 1000);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.pointerEvents = 'none';
    renderer.domElement.style.zIndex = '10';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    scene.add(new THREE.AmbientLight(0xffffff, 1));
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(0, 0, 1000);
    scene.add(light);

    const group = new THREE.Group();
    scene.add(group);
    groupRef.current = group;
  };

  // 최초 1회: 씬 및 렌더러 구성 + 텍스처 로딩
  useEffect(() => {
    if (!map) return;

    const loader = new THREE.TextureLoader();
    const promises = markers.map((marker) => {
      return new Promise<void>((resolve) => {
        if (textureCacheRef.current.has(marker.imageUrl)) {
          resolve();
        } else {
          loader.load(marker.imageUrl, (texture) => {
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.minFilter = THREE.LinearMipMapLinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.anisotropy =
              rendererRef.current?.capabilities.getMaxAnisotropy() ?? 1;
            texture.needsUpdate = true;
            textureCacheRef.current.set(marker.imageUrl, texture);
            resolve();
          });
        }
      });
    });

    Promise.all(promises).then(() => {
      buildScene();
      updateMarkers();
    });
  }, [map]);

  // markers 변경 시 마커만 갱신
  useEffect(() => {
    if (!map || !groupRef.current) return;
    updateMarkers();
  }, [markers]);

  // resize + idle 이벤트 처리
  useEffect(() => {
    if (!map) return;

    const handleResize = () => {
      const container = containerRef.current;
      const camera = cameraRef.current;
      const renderer = rendererRef.current;
      if (!container || !camera || !renderer) return;

      const width = container.clientWidth;
      const height = container.clientHeight;

      camera.left = -width / 2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = -height / 2;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      updatePositions();
    };

    window.addEventListener('resize', handleResize);
    window.kakao.maps.event.addListener(map, 'idle', updatePositions);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.kakao.maps.event.removeListener(map, 'idle', updatePositions);
    };
  }, [map]);

  // 언마운트 시 리소스 정리
  useEffect(() => {
    return () => {
      rendererRef.current?.dispose();
      markerMeshesRef.current.forEach((mesh) => {
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else {
          mesh.material.dispose();
        }
      });
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    />
  );
}
