'use client';

import { Float, OrbitControls, RoundedBox, Sparkles } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

/** A message queue feeding glowing messages into an envelope. */

function Envelope({ reduced }: { reduced: boolean }) {
  const flap = useRef<THREE.Group>(null);

  const flapShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-1.2, 0);
    s.lineTo(1.2, 0);
    s.lineTo(0, -0.9);
    s.closePath();
    return s;
  }, []);

  const outline = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(2.4, 1.6, 0.12)), []);

  useFrame(({ clock }) => {
    if (flap.current && !reduced) {
      flap.current.rotation.x = -0.15 - (Math.sin(clock.elapsedTime * 0.9) * 0.5 + 0.5) * 1.1;
    }
  });

  return (
    <Float speed={reduced ? 0 : 1.5} rotationIntensity={0.35} floatIntensity={0.6}>
      <group rotation={[0.1, -0.35, 0]}>
        <RoundedBox args={[2.4, 1.6, 0.12]} radius={0.04} smoothness={3}>
          <meshStandardMaterial color="#151a26" metalness={0.7} roughness={0.3} />
        </RoundedBox>
        <lineSegments geometry={outline}>
          <lineBasicMaterial color="#62e0ff" toneMapped={false} />
        </lineSegments>
        {/* Light spilling out of the opening. */}
        <mesh position={[0, 0.55, 0.07]}>
          <planeGeometry args={[2.1, 0.35]} />
          <meshStandardMaterial color="#62e0ff" emissive="#62e0ff" emissiveIntensity={2.5} toneMapped={false} />
        </mesh>
        <group ref={flap} position={[0, 0.8, 0.07]} rotation={[-0.4, 0, 0]}>
          <mesh>
            <shapeGeometry args={[flapShape]} />
            <meshStandardMaterial color="#1b2232" metalness={0.6} roughness={0.35} side={THREE.DoubleSide} />
          </mesh>
        </group>
        {/* The V fold on the front. */}
        <mesh position={[-0.6, -0.3, 0.07]} rotation={[0, 0, Math.atan2(0.75, 1.2)]}>
          <boxGeometry args={[1.42, 0.02, 0.01]} />
          <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={2.5} toneMapped={false} />
        </mesh>
        <mesh position={[0.6, -0.3, 0.07]} rotation={[0, 0, -Math.atan2(0.75, 1.2)]}>
          <boxGeometry args={[1.42, 0.02, 0.01]} />
          <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={2.5} toneMapped={false} />
        </mesh>
      </group>
    </Float>
  );
}

function MessageStream({ reduced }: { reduced: boolean }) {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-5.5, -1.8, -1),
        new THREE.Vector3(-3.5, -0.4, 0.5),
        new THREE.Vector3(-1.8, 0.9, 0.4),
        new THREE.Vector3(0, 0.6, 0.2),
      ]),
    [],
  );
  const group = useRef<THREE.Group>(null);
  const COUNT = 6;

  useFrame(({ clock }) => {
    group.current?.children.forEach((child, i) => {
      const t = reduced ? i / COUNT : (clock.elapsedTime * 0.18 + i / COUNT) % 1;
      child.position.copy(curve.getPoint(t));
      child.scale.setScalar(t > 0.9 ? (1 - t) * 10 : 1);
    });
  });

  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 64, 0.16, 16, false]} />
        <meshStandardMaterial color="#9fd8ff" transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>
      <mesh>
        <tubeGeometry args={[curve, 64, 0.012, 6, false]} />
        <meshBasicMaterial color="#62e0ff" transparent opacity={0.5} toneMapped={false} />
      </mesh>
      <group ref={group}>
        {Array.from({ length: COUNT }, (_, i) => (
          <mesh key={i}>
            <capsuleGeometry args={[0.07, 0.14, 6, 12]} />
            <meshStandardMaterial color="#62e0ff" emissive="#62e0ff" emissiveIntensity={4} toneMapped={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default function ContactScene({ active, reduced, touch }: { active: boolean; reduced: boolean; touch: boolean }) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, touch ? 1.5 : 2]}
      camera={{ position: [0, 0.4, 6.5], fov: 45 }}
      aria-hidden="true"
    >
      <color attach="background" args={['#07080c']} />
      <ambientLight intensity={0.4} color="#3a3f7a" />
      <spotLight position={[3, 5, 5]} angle={0.5} penumbra={0.8} intensity={80} color="#62e0ff" />
      <spotLight position={[-5, 3, 3]} angle={0.6} penumbra={1} intensity={60} color="#a78bfa" />
      <group position={[0.6, 0, 0]}>
        <Envelope reduced={reduced} />
        <MessageStream reduced={reduced} />
      </group>
      <Sparkles count={50} scale={[10, 6, 6]} size={1.8} speed={reduced ? 0 : 0.3} color="#62e0ff" opacity={0.5} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate={!touch}
        enableDamping
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.8}
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
      />
      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur intensity={1.1} luminanceThreshold={0.9} luminanceSmoothing={0.2} />
      </EffectComposer>
    </Canvas>
  );
}
