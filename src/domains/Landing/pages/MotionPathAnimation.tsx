import React, { useEffect, useRef, useCallback } from 'react';
import dolphinShip from '@/assets/image/dolphin-ship.svg';

// GSAP types (basic ones we need)
interface GSAPInstance {
  registerPlugin: (...plugins: unknown[]) => void;
  set: (target: unknown, vars: object) => void;
  to: (target: unknown, vars: object) => void;
  utils: {
    toArray: (target: unknown) => unknown[];
  };
}

interface ScrollTriggerInstance {
  getAll: () => Array<{ kill: () => void }>;
}

interface MotionPathPluginInstance {
  cacheRawPathMeasurements: (
    rawPath: number[][],
    precision: number,
  ) => number[][];
  getRawPath: (target: unknown) => number[][];
  getPositionOnPath: (
    rawPath: number[][],
    progress: number,
  ) => { x: number; y: number; [key: string]: number };
}

declare global {
  interface Window {
    gsap: GSAPInstance;
    ScrollTrigger: ScrollTriggerInstance;
    MotionPathPlugin: MotionPathPluginInstance;
  }
}

const MotionPathAnimation: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null); //전체 svg
  const motionDivRef = useRef<HTMLDivElement>(null); //움직이는 요소
  const motionPathRef = useRef<SVGPathElement>(null);
  const gsapLoadedRef = useRef(false);
  const [screenSize, setScreenSize] = React.useState({ width: 0, height: 0 });
  const [scaledPath, setScaledPath] = React.useState('');
  const [checkpointStates, setCheckpointStates] = React.useState([
    false,
    false,
    false,
    false,
    false,
  ]); // 5개 체크포인트 상태

  // 체크포인트 위치 (progress 기준)
  const checkpointPositions = React.useMemo(
    () => [
      0.12, // 지도 섹션 앞 부분 - y 좌표가 처음 떨어지는 지점
      0.34, // 혜택 탐험 섹션 옆 커브
      0.55, // 게이미피케이션 섹션 옆 커브
      0.79, // 제휴처 섹션 옆 커브
      0.9, // 네비게이션 섹션 커브 전
    ],
    [],
  );

  // path 상의 실제 위치 계산 함수
  const getPathPositionAtProgress = React.useCallback((progress: number) => {
    if (
      !motionPathRef.current ||
      typeof window === 'undefined' ||
      !window.MotionPathPlugin
    ) {
      return { x: 0, y: 0 };
    }

    try {
      const MotionPathPlugin = window.MotionPathPlugin;
      const rawPath = MotionPathPlugin.getRawPath(motionPathRef.current);
      if (!rawPath || rawPath.length === 0) return { x: 0, y: 0 };

      return MotionPathPlugin.getPositionOnPath(rawPath, progress);
    } catch (error) {
      console.warn('Path position calculation failed:', error);
      return { x: 0, y: 0 };
    }
  }, []);

  // 원본 path 데이터 (고정값) - 중앙에서 시작하여 코너를 돌면서 연결
  const originalPath =
    'M434 40.5C434 60.5 434 79.23 434 100C434 130 400 160 350 180C300 200 150 220 120 280C90 340 100 400 180 430C260 460 320 446.95 320.372 446.95C523.808 443.88 770.705 529.72 770.705 688.4C770.705 823.34 634.5 866.91 454.273 898.98C274.047 931.06 70.8909 969.08 70.8909 1135.19C70.8909 1325.2 360.017 1323.79 420.346 1323.79C479.38 1323.79 805.99 1371.05 805.99 1513.8C805.99 1679.21 771.35 1742.97 350.455 1789.94C200 1820 150 1900 250 1950';

  // 큰 화면용 path (좌표를 직접 확장) - 중앙에서 시작하여 코너를 돌면서 연결
  const largeScreenPath =
    'M725 40.5C725 100.5 725 145.5 725 180C725 230 668 280 583 320C500 360 250 390 200 490C150 590 166 700 300 750C434 800 534.9 776.1 534.9 776.1C873.5 772.1 1285.9 920.0 1285.9 1200.3C1285.9 1430.4 1058.7 1515.0 758.8 1585.7C458.9 1656.4 118.4 1740.4 118.4 2030.0C118.4 2380.8 601.6 2380.0 702.4 2380.0C800.1 2380.0 1346.7 2470.4 1346.7 2730.0C1346.7 3030.3 1288.6 3180.9 585.6 3270.9C334 3335 250 3510 418 3620';

  // 원본 viewBox 크기
  const originalViewBox = { width: 869, height: 2200 };

  // 화면 크기에 따른 path 선택 및 스케일링 함수
  const getPathForScreen = React.useCallback(
    (screenWidth: number) => {
      if (screenWidth < 768) {
        // 모바일: 원본 path를 축소
        const scale = Math.min(screenWidth / originalViewBox.width, 1);
        return originalPath.replace(/[\d.]+/g, (match) => {
          const num = parseFloat(match);
          return (num * scale).toString();
        });
      } else if (screenWidth >= 2000) {
        // 큰 화면: 별도의 큰 화면용 path 사용
        return largeScreenPath;
      } else {
        // 일반 데스크탑: 원본 path 그대로 사용
        return originalPath;
      }
    },
    [originalViewBox.width],
  );

  // 화면 크기 감지 및 path 업데이트
  React.useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setScreenSize({ width, height });
      setScaledPath(getPathForScreen(width));
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);

    return () => window.removeEventListener('resize', updateScreenSize);
  }, [getPathForScreen]);

  const pathEase = (
    path: string,
    config: {
      axis?: string;
      precision?: number;
      smooth?: boolean | number;
    } = {},
  ) => {
    const gsap = window.gsap;
    const MotionPathPlugin = window.MotionPathPlugin;

    if (!gsap || !MotionPathPlugin) return (p: number) => p;

    const axis = config.axis || 'y';
    const precision = config.precision || 1;
    const rawPath = MotionPathPlugin.cacheRawPathMeasurements(
      MotionPathPlugin.getRawPath(gsap.utils.toArray(path)[0]),
      Math.round(precision * 12),
    );
    const useX = axis === 'x';
    const start = rawPath[0][useX ? 0 : 1];
    const end =
      rawPath[rawPath.length - 1][
        rawPath[rawPath.length - 1].length - (useX ? 2 : 1)
      ];
    const range = end - start;
    const l = Math.round(precision * 200);
    const inc = 1 / l;
    const positions = [0];
    const a = [0];
    let minIndex = 0;
    const smooth: number[] = [0];
    const minChange = (1 / l) * 0.6;
    const smoothRange =
      config.smooth === true ? 7 : Math.round(config.smooth as number) || 0;
    const fullSmoothRange = smoothRange * 2;

    const getClosest = (p: number) => {
      while (positions[minIndex] <= p && minIndex < l) {
        minIndex++;
      }
      a.push(
        ((p - positions[minIndex - 1]) /
          (positions[minIndex] - positions[minIndex - 1])) *
          inc +
          minIndex * inc,
      );
      if (
        smoothRange &&
        a.length > smoothRange &&
        a[a.length - 1] - a[a.length - 2] < minChange
      ) {
        smooth.push(a.length - smoothRange);
      }
    };

    for (let i = 1; i < l; i++) {
      positions[i] =
        (MotionPathPlugin.getPositionOnPath(rawPath, i / l)[axis] - start) /
        range;
    }
    positions[l] = 1;

    for (let i = 0; i < l; i++) {
      getClosest(i / l);
    }
    a.push(1);

    if (smoothRange) {
      smooth.push(l - fullSmoothRange + 1);
      smooth.forEach((index) => {
        const startVal = a[index];
        const j = Math.min(index + fullSmoothRange, l);
        const increment = (a[j] - startVal) / (j - index);
        let c = 1;
        for (let i = index + 1; i < j; i++) {
          a[i] = startVal + increment * c++;
        }
      });
    }

    const finalLength = a.length - 1;
    return (p: number) => {
      const i = p * finalLength;
      const s = a[Math.floor(i)];
      return i ? s + (a[Math.ceil(i)] - s) * (i % 1) : 0;
    };
  };

  const initializeAnimation = useCallback(() => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const MotionPathPlugin = window.MotionPathPlugin;

    if (!gsap || !ScrollTrigger || !MotionPathPlugin) return;

    gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);

    if (svgRef.current && motionDivRef.current && motionPathRef.current) {
      gsap.set(svgRef.current, { opacity: 1 });
      gsap.set(motionDivRef.current, { scale: 0.7, autoAlpha: 1 });

      let prevDirection = 0;

      // 경로 애니메이션 설정
      gsap.to(motionDivRef.current, {
        scrollTrigger: {
          trigger: motionPathRef.current,
          start: 'top center',
          end: () =>
            '+=' + (motionPathRef.current?.getBoundingClientRect().height || 0),
          scrub: 0.5,
          onUpdate: (self: { direction: number; progress: number }) => {
            if (prevDirection !== self.direction) {
              prevDirection = self.direction;
            }

            // 체크포인트 상태 업데이트
            const newCheckpointStates = checkpointPositions.map(
              (position) => self.progress >= position,
            );
            setCheckpointStates(newCheckpointStates);

            // path 끝에 가까워지면 고래 이미지를 점점 투명하게 만들기
            if (self.progress > 0.9) {
              const opacity = Math.max(0, (1 - self.progress) * 10);
              gsap.set(motionDivRef.current, { opacity });
            } else {
              gsap.set(motionDivRef.current, { opacity: 1 });
            }
          },
        },
        ease: pathEase('#motionPath'),
        immediateRender: true,
        motionPath: {
          path: '#motionPath',
          align: '#motionPath',
          alignOrigin: [0.5, 0.5],
        },
      });
    }
  }, [checkpointPositions]);

  const loadGSAP = useCallback(() => {
    if (gsapLoadedRef.current) {
      initializeAnimation();
      return;
    }

    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    Promise.all([
      loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js',
      ),
      loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/MotionPathPlugin.min.js',
      ),
      loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js',
      ),
    ])
      .then(() => {
        gsapLoadedRef.current = true;
        // Give a small delay to ensure all plugins are registered
        setTimeout(initializeAnimation, 100);
      })
      .catch((error) => {
        console.error('Failed to load GSAP:', error);
      });
  }, [initializeAnimation]);

  useEffect(() => {
    loadGSAP();

    return () => {
      // Cleanup ScrollTrigger instances
      if (window.ScrollTrigger) {
        window.ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      }
    };
  }, [loadGSAP]);

  // scaledPath가 변경될 때마다 애니메이션 다시 초기화
  useEffect(() => {
    if (scaledPath && gsapLoadedRef.current) {
      // 기존 애니메이션 정리
      if (window.ScrollTrigger) {
        window.ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      }

      // 새로운 path로 애니메이션 다시 초기화
      setTimeout(initializeAnimation, 100);
    }
  }, [scaledPath, initializeAnimation]);

  return (
    <div
      style={{
        margin: 0,
        // background: 'linear-gradient(180deg, #4DD2EB 0%, #2C6385 100%)',
      }}
      className="absolute hidden 2xl:block pt-150 w-1000 h-1200 left-1/2 -translate-x-1/2"
    >
      <svg
        ref={svgRef}
        id="linesvg"
        style={{
          opacity: 0,
          overflow: 'hidden',
        }}
        className="w-full h-full object-fill"
        // className={screenSize.width > 1800 ? 'block' : 'hidden'}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox={`0 0 ${
          screenSize.width >= 2000
            ? 1800 // 큰 화면용 고정 viewBox 너비 (더 크게)
            : originalViewBox.width
        } ${
          screenSize.width >= 2000
            ? 3800 // 큰 화면용 고정 viewBox 높이 (더 크게)
            : originalViewBox.height
        }`}
        transform={`${screenSize.width >= 2000 ? 'translate(200, 0)' : ''}`}
        xmlSpace="preserve"
        preserveAspectRatio="xMidYMax meet"
      >
        <style>
          {`
            .st0 {
              fill: none;
              stroke: white;
              stroke-width: ${screenSize.width >= 2000 ? 20 : 10};
              stroke-opacity: 0.2;
              stroke-linecap: round;
              stroke-linejoin: round;
              stroke-miterlimit: 10;
            }
          `}
        </style>

        {/* 이동 경로 - 배경으로 먼저 배치 */}
        <path
          ref={motionPathRef}
          id="motionPath"
          className="st0"
          d={scaledPath}
        />

        {/* 체크포인트 아이콘들 - GSAP가 로드된 후에만 표시 */}
        {gsapLoadedRef.current &&
          checkpointPositions.map((_, index) => {
            const isCompleted = checkpointStates[index];

            // 각 체크포인트의 실제 path 위치 계산
            const getCheckpointCoords = () => {
              const progress = checkpointPositions[index];
              const pathPosition = getPathPositionAtProgress(progress);

              // GSAP가 아직 로드되지 않았거나 path가 준비되지 않은 경우 대체 좌표 사용
              if (pathPosition.x === 0 && pathPosition.y === 0) {
                if (screenSize.width >= 2000) {
                  // 큰 화면용 대체 좌표 - largeScreenPath 기준 (중앙 시작점 반영)
                  const fallbackCoords = [
                    { x: 583, y: 320 }, // 12% - 첫 번째 코너 지점
                    { x: 300, y: 750 }, // 35% - 두 번째 코너 지점
                    { x: 1286, y: 1200 }, // 55%
                    { x: 759, y: 1586 }, // 75%
                    { x: 586, y: 3271 }, // 90%
                  ];
                  return fallbackCoords[index] || { x: 0, y: 0 };
                } else {
                  // 일반 화면용 대체 좌표 - originalPath 기준 (중앙 시작점 반영)
                  const fallbackCoords = [
                    { x: 350, y: 180 }, // 12% - 첫 번째 코너 지점
                    { x: 180, y: 430 }, // 35% - 두 번째 코너 지점
                    { x: 771, y: 688 }, // 55%
                    { x: 454, y: 899 }, // 75%
                    { x: 350, y: 1790 }, // 90%
                  ];
                  return fallbackCoords[index] || { x: 0, y: 0 };
                }
              }

              return pathPosition;
            };

            const coords = getCheckpointCoords();

            return (
              <g key={index}>
                {/* 체크 배경 원 */}
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r={screenSize.width >= 2000 ? 20 : 15}
                  fill={isCompleted ? '#158c9f' : 'white'}
                  opacity={1}
                />
                {/* 체크 마크 */}
                <path
                  d={`M ${coords.x - (screenSize.width >= 2000 ? 6 : 4)} ${coords.y} 
                      L ${coords.x - (screenSize.width >= 2000 ? 1 : 0.5)} ${coords.y + (screenSize.width >= 2000 ? 3 : 2)} 
                      L ${coords.x + (screenSize.width >= 2000 ? 6 : 4)} ${coords.y - (screenSize.width >= 2000 ? 3 : 2)}`}
                  stroke={isCompleted ? 'white' : '#6B7280'}
                  strokeWidth={screenSize.width >= 2000 ? 3 : 2}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={1}
                />
              </g>
            );
          })}

        {/* 이미지 실제로 화면에 나타나는 부분 - path 위에 배치 */}
        <foreignObject x="0" y="0" width="100%" height="100%" className="">
          <div
            ref={motionDivRef}
            id="motionSVG"
            style={{
              width: screenSize.width >= 2000 ? '180px' : '130px',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <div
              id="tractor"
              // className="hidden md:flex"
              style={{
                width: screenSize.width >= 2000 ? '120px' : '80px',
                height: screenSize.width >= 2000 ? '120px' : '80px',
                borderRadius: '50%',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px',
              }}
            >
              <img src={dolphinShip} alt="돌고래" />
            </div>
          </div>
        </foreignObject>
      </svg>
    </div>
  );
};

export default MotionPathAnimation;
