'use client';

import { Html, OrbitControls, Sparkles } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { skillTiers, type SkillTierId } from '@/content';

/**
 * The hero scene: the stack as three orbits around a core, drawn like an atom. Daily
 * skills orbit closest in, familiar ones furthest out. Each ring is tilted to a
 * different angle so the system reads as 3D.
 */
const RINGS: Record<SkillTierId, { radius: number; tilt: [number, number, number]; speed: number; color: string }> = {
  daily: { radius: 2.1, tilt: [0.95, 0, 0], speed: 0.16, color: '#6ee7b7' },
  proven: { radius: 3.3, tilt: [0.95, 0, 1.05], speed: -0.1, color: '#62e0ff' },
  familiar: { radius: 4.4, tilt: [0.95, 0, -1.05], speed: 0.07, color: '#a78bfa' },
};

const worldPos = new THREE.Vector3();

function SkillOrb({ name, color, position }: { name: string; color: string; position: [number, number, number] }) {
  const mesh = useRef<THREE.Mesh>(null);
  const label = useRef<HTMLSpanElement>(null);

  // Labels on the far side of the system fade almost out, so only the front half reads.
  useFrame(() => {
    if (!mesh.current || !label.current) return;
    mesh.current.getWorldPosition(worldPos);
    const t = THREE.MathUtils.clamp((worldPos.z + 0.8) / 2.6, 0, 1);
    label.current.style.opacity = String(0.06 + t * 0.94);
  });

  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry args={[0.12, 20, 20]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} toneMapped={false} />
      <Html center style={{ pointerEvents: 'none' }} zIndexRange={[10, 0]}>
        <span
          ref={label}
          className="block translate-y-4 rounded-full border border-white/10 bg-void/80 px-2.5 py-0.5 text-xs whitespace-nowrap text-ink"
        >
          {name}
        </span>
      </Html>
    </mesh>
  );
}

function Ring({ tier, reduced }: { tier: (typeof skillTiers)[number]; reduced: boolean }) {
  const ring = RINGS[tier.id];
  const spin = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (spin.current && !reduced) spin.current.rotation.z += delta * ring.speed;
  });

  const orbs = useMemo(
    () =>
      tier.skills.map((skill, i) => {
        const a = (i / tier.skills.length) * Math.PI * 2;
        return {
          name: skill.name,
          position: [Math.cos(a) * ring.radius, Math.sin(a) * ring.radius, 0] as [number, number, number],
        };
      }),
    [tier, ring.radius],
  );

  return (
    <group rotation={[0, 0, ring.tilt[2]]}>
      <group rotation={[ring.tilt[0], 0, 0]}>
        <mesh>
          <torusGeometry args={[ring.radius, 0.01, 8, 180]} />
          <meshBasicMaterial color={ring.color} transparent opacity={0.45} toneMapped={false} />
        </mesh>
        <group ref={spin}>
          {orbs.map((orb) => (
            <SkillOrb key={orb.name} name={orb.name} color={ring.color} position={orb.position} />
          ))}
        </group>
      </group>
    </group>
  );
}

function Core({ reduced }: { reduced: boolean }) {
  const shell = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (shell.current && !reduced) {
      shell.current.rotation.y += delta * 0.3;
      shell.current.rotation.x += delta * 0.1;
    }
  });
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#6ee7b7" emissive="#6ee7b7" emissiveIntensity={2.2} toneMapped={false} />
      </mesh>
      <mesh ref={shell}>
        <icosahedronGeometry args={[0.9, 1]} />
        <meshBasicMaterial color="#62e0ff" wireframe transparent opacity={0.35} />
      </mesh>
      <Html center style={{ pointerEvents: 'none' }}>
        <span className="block translate-y-14 font-mono text-xs text-mint">runtime</span>
      </Html>
    </group>
  );
}

function Rig({ reduced }: { reduced: boolean }) {
  const { size } = useThree();
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (group.current && !reduced) group.current.rotation.y += delta * 0.12;
  });
  // In the hero the headline sits over the canvas's left edge, so on wide screens the
  // system is scaled down a touch and nudged right to keep the labels clear of it.
  const wide = size.width >= 1024;
  const scale = size.width < 640 ? 0.62 : wide ? 0.78 : 0.76;
  return (
    <group ref={group} scale={scale} position={[wide ? 1.5 : 0, 0, 0]}>
      <Core reduced={reduced} />
      {skillTiers.map((tier) => (
        <Ring key={tier.id} tier={tier} reduced={reduced} />
      ))}
    </group>
  );
}

export default function OrbitScene({ active, reduced, touch }: { active: boolean; reduced: boolean; touch: boolean }) {
  return (
    <Canvas frameloop={active ? 'always' : 'never'} dpr={[1, touch ? 1.5 : 2]} camera={{ position: [0, 0, 12], fov: 45 }} aria-hidden="true">
      <color attach="background" args={['#040507']} />
      <ambientLight intensity={0.4} />
      <Rig reduced={reduced} />
      <Sparkles count={60} scale={[12, 8, 8]} size={1.8} speed={reduced ? 0 : 0.3} color="#a78bfa" opacity={0.5} />
      <OrbitControls enablePan={false} enableZoom={false} enableRotate={!touch} enableDamping />
      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur intensity={1.1} luminanceThreshold={0.9} luminanceSmoothing={0.2} />
      </EffectComposer>
    </Canvas>
  );
}
