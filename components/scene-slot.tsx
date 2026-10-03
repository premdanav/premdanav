'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useEngaged, useInView, useMediaQuery, useWebGL } from './three/scene-utils';

// Three.js loads only when a scene is about to be seen, never in first-load JS.
const SCENES = {
  orbit: dynamic(() => import('./three/orbit-scene'), { ssr: false }),
  topology: dynamic(() => import('./three/topology-scene'), { ssr: false }),
  contact: dynamic(() => import('./three/contact-scene'), { ssr: false }),
};

interface SceneSlotProps {
  scene: keyof typeof SCENES;
  /** Must include a position (relative or absolute) and a size. */
  className?: string;
  /** Server-rendered stand-in: shown before the scene loads, and kept if WebGL is unavailable. */
  fallback?: ReactNode;
}

export function SceneSlot({ scene, className = '', fallback }: SceneSlotProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { seen, visible } = useInView(ref);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const touch = useMediaQuery('(pointer: coarse)');
  const webgl = useWebGL();
  const engaged = useEngaged();
  const [ready, setReady] = useState(false);

  // A scene mounts once the visitor has engaged with the page and the slot nears the
  // viewport, then stays mounted (unmounting tears down drei's HTML labels out of
  // order); off screen it simply stops rendering. The canvas fades in over the fallback.
  const showScene = seen && webgl && engaged;

  useEffect(() => {
    const id = window.setTimeout(() => setReady(showScene), showScene ? 350 : 0);
    return () => window.clearTimeout(id);
  }, [showScene]);

  // Once the canvas has faded in, drop the fallback so it stops costing frames.
  const [fallbackGone, setFallbackGone] = useState(false);
  useEffect(() => {
    if (!ready) return;
    const id = window.setTimeout(() => setFallbackGone(true), 900);
    return () => window.clearTimeout(id);
  }, [ready]);

  const Scene = SCENES[scene];

  return (
    <div ref={ref} className={className}>
      {fallback && !fallbackGone && (
        <div className={`absolute inset-0 transition-opacity duration-700 ${showScene && ready ? 'opacity-0' : 'opacity-100'}`}>
          {fallback}
        </div>
      )}
      {showScene && (
        <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`}>
          <Scene active={visible} reduced={reduced} touch={touch} />
        </div>
      )}
    </div>
  );
}
