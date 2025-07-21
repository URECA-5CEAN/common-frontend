import React, { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three-stdlib';
import { RepeatWrapping } from 'three';
import type { MarkerProps } from '../KakaoMapContainer';
import type { StoreInfo } from '../api/store';

interface ThreeJsMarkerProps {
  markers: MarkerProps[];
  map: kakao.maps.Map;
  stores: StoreInfo[];
  setHoveredMarkerId: (id: string | null) => void;
  container: HTMLDivElement;
  openDetail: (store: StoreInfo) => void;
}

export default function ThreeJsMarker({
  markers,
  map,
  stores,
  setHoveredMarkerId,
  container,
  openDetail,
}: ThreeJsMarkerProps) {
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const textureCache = useRef<Map<string, THREE.Texture>>(new Map());
  const meshMap = useRef<Map<string, THREE.Mesh>>(new Map());
  const hoverOutTimeout = useRef<number | null>(null);
  const lastHoverRef = useRef<string | null>(null);
  const imageTimestamp = useRef(Date.now()).current;

  // Build or update meshes when markers change
  const buildOrUpdateMeshes = useCallback(() => {
    const group = groupRef.current!;
    const newIds = new Set(markers.map((m) => m.id));

    // Remove old meshes
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

    // Add new meshes
    markers.forEach((m) => {
      if (meshMap.current.has(m.id)) return;
      const url = /^data:image/.test(m.imageUrl)
        ? m.imageUrl
        : `${m.imageUrl}?ts=${imageTimestamp}`;
      const tex = textureCache.current.get(url)!;
      tex.wrapS = RepeatWrapping;
      tex.wrapT = RepeatWrapping;

      const material = new THREE.MeshLambertMaterial({
        map: tex,
        depthTest: false,
      });
      const cube = new THREE.Mesh(
        new RoundedBoxGeometry(40, 40, 40, 10, 5),
        material,
      );
      cube.name = m.id;
      cube.rotation.set(Math.PI / 7, -Math.PI / 6, 0);

      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(25, 40, 20),
        new THREE.MeshLambertMaterial({
          color: 'red',
          transparent: true,
          opacity: 0.4,
          depthWrite: false,
        }),
      );
      cone.rotation.x = Math.PI;
      cone.position.set(0, -35, 0);
      cube.add(cone);
      group.add(cube);
      meshMap.current.set(m.id, cube);
    });

    updatePositions();
  }, [markers, imageTimestamp]);

  // Load textures
  useEffect(() => {
    if (!map) return;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
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

  // Initialize scene, camera, renderer
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
      pointerEvents: 'none',
      zIndex: '2',
    });
    container.insertBefore(renderer.domElement, container.firstChild);
    rendererRef.current = renderer;

    scene.add(new THREE.AmbientLight(0xffffff, 1));
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(0, 0, 1000);
    scene.add(light);

    const group = new THREE.Group();
    scene.add(group);
    groupRef.current = group;

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

  // Update mesh positions
  const updatePositions = () => {
    if (!map) return;
    const proj = map.getProjection();
    if (!proj) return;
    const centerPt = proj.containerPointFromCoords(map.getCenter());
    meshMap.current.forEach((mesh, id) => {
      const m = markers.find((x) => x.id === id);
      if (!m) return;
      const pt = proj.containerPointFromCoords(
        new kakao.maps.LatLng(m.lat, m.lng),
      );
      mesh.position.set(pt.x - centerPt.x, centerPt.y - pt.y, 50);
    });
    rendererRef.current?.render(sceneRef.current!, cameraRef.current!);
  };

  // Raycaster hover
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.current.setFromCamera(mouse.current, cameraRef.current!);
      const hits = raycaster.current.intersectObjects(
        Array.from(meshMap.current.values()),
      );
      if (hits.length) {
        if (hoverOutTimeout.current) clearTimeout(hoverOutTimeout.current);
        const id = hits[0].object.name;
        lastHoverRef.current = id;
        setHoveredMarkerId(id);
      } else if (lastHoverRef.current) {
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

  // Raycaster click
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
