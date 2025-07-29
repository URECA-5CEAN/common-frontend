import React, { useEffect, useRef } from 'react';
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

  const initializeAnimation = () => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const MotionPathPlugin = window.MotionPathPlugin;

    if (!gsap || !ScrollTrigger || !MotionPathPlugin) return;

    gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);

    if (svgRef.current && motionDivRef.current && motionPathRef.current) {
      gsap.set(svgRef.current, { opacity: 1 });
      gsap.set(motionDivRef.current, { scale: 0.7, autoAlpha: 1 });

      let prevDirection = 0;

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
  };

  const loadGSAP = () => {
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
  };

  useEffect(() => {
    loadGSAP();

    return () => {
      // Cleanup ScrollTrigger instances
      if (window.ScrollTrigger) {
        window.ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      }
    };
  }, []);

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
        viewBox="0 0 869 4000"
        xmlSpace="preserve"
        preserveAspectRatio="xMidYMax meet"
      >
        <style>
          {`
            .st0 {
              fill: none;
              stroke: red;
              stroke-width: 10;
              stroke-linecap: round;
              stroke-linejoin: round;
              stroke-miterlimit: 10;
            }
          `}
        </style>

        <path
          ref={motionPathRef}
          id="motionPath"
          className="st0"
          d="M1 54C39.3102 54.9861 57.2261 105.638 66.1411 188.474C72.8614 250.918 79.0336 600.772 320.372 595.931C523.808 591.85 770.705 706.299 770.705 917.862C770.705 1097.79 634.5 1155.88 454.273 1198.64C274.047 1241.41 70.8909 1292.11 70.8909 1513.58C70.8909 1766.93 360.017 1765.05 420.346 1765.05C479.38 1765.05 805.99 1828.07 805.99 2018.4C805.99 2238.94 771.35 2323.96 350.455 2386.59C148.02 2416.71 35.7964 2579.96 76.9979 2696.15C163.256 2862.91 238.493 2893.82 467.392 2948.42"
          stroke="white"
          strokeOpacity="0.2"
          strokeWidth="6"
        />

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
