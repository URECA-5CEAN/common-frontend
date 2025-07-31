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
  const svgRef = useRef<SVGSVGElement>(null);
  const motionDivRef = useRef<HTMLDivElement>(null);
  const motionPathRef = useRef<SVGPathElement>(null);
  const gsapLoadedRef = useRef(false);

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
          onUpdate: (self: { direction: number }) => {
            if (prevDirection !== self.direction) {
              prevDirection = self.direction;
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
  }, []);

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

  return (
    <div
      style={{ margin: 0, minHeight: '400vh' }}
      className="absolute w-full top-[100dvh] bg-[#4DD2EB]"
    >
      <svg
        ref={svgRef}
        id="linesvg"
        style={{ opacity: 0 }}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 869 3000"
        xmlSpace="preserve"
        preserveAspectRatio="xMidYMax meet"
      >
        <style>
          {`
            .st0 {
              fill: none;
              stroke: white;
              stroke-width: 8;
              stroke-opacity: 0.2;
              stroke-linecap: round;
              stroke-linejoin: round;
              stroke-miterlimit: 10;
            }
          `}
        </style>

        {/* 이동 경로 */}
        <path
          ref={motionPathRef}
          id="motionPath"
          className="st0"
          d="M1 40.5C39.3102 41.24 57.2261 79.23 66.1411 141.36C72.8614 188.19 79.0336 450.58 320.372 446.95C523.808 443.88 770.705 529.72 770.705 688.4C770.705 823.34 634.5 866.91 454.273 898.98C274.047 931.06 70.8909 969.08 70.8909 1135.19C70.8909 1325.2 360.017 1323.79 420.346 1323.79C479.38 1323.79 805.99 1371.05 805.99 1513.8C805.99 1679.21 771.35 1742.97 350.455 1789.94C148.02 1812.53 35.7964 1934.97 76.9979 2022.11C163.256 2147.18 238.493 2170.37 350 2175"
        />
        {/* 이미지 실제로 화면에 나타나는 부분 */}
        <foreignObject x="0" y="0" width="100%" height="100%">
          <div
            ref={motionDivRef}
            id="motionSVG"
            style={{
              width: '130px',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <div
              id="tractor"
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                display: 'flex',
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
