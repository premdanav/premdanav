'use client';

import { Float, Html, OrbitControls, RoundedBox, Sparkles } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import * as THREE from 'three';
import { calls, nodes, type NodeId, type ServiceNode } from '@/content';
import { scrollToSection } from './scene-utils';

/** Scene layout: roughly left-to-right in request order, with depth for parallax. */
const LAYOUT: Record<NodeId, [number, number, number]> = {
  gateway: [-4.3, 0.1, 0.5],
  auth: [-2.1, 1.25, -1.9],
  core: [-1.0, -0.15, 1.7],
  ai: [1.5, 1.3, -1.4],
  runtime: [0.3, -1.35, -0.4],
  datastore: [4.0, 0.35, 0.1],
  queue: [2.5, -0.55, 2.6],
};

const COLOR: Record<NodeId, string> = {
  gateway: '#62e0ff',
  auth: '#fbbf24',
  core: '#52aeff',
  ai: '#a78bfa',
  runtime: '#6ee7b7',
  datastore: '#fd5c79',
  queue: '#62e0ff',
};

const DARK = { color: '#151a26', metalness: 0.75, roughness: 0.32 } as const;

function Glow({ color, intensity = 3 }: { color: string; intensity?: number }) {
  return <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity} toneMapped={false} />;
}

/* ------------------------------------------------------------- node models */

function Gateway({ color }: { color: string }) {
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.72, 0.8, 0.36, 6]} />
        <meshStandardMaterial {...DARK} />
      </mesh>
      <mesh position={[0, 0.19, 0]} rotation={[Math.PI / 2, 0, Math.PI / 6]}>
        <torusGeometry args={[0.66, 0.025, 8, 6]} />
        <Glow color={color} />
      </mesh>
      <mesh position={[0, 0.24, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.06, 6]} />
        <Glow color={color} intensity={4} />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <octahedronGeometry args={[0.2, 0]} />
        <Glow color={color} intensity={5} />
      </mesh>
    </group>
  );
}

function Lock({ color }: { color: string }) {
  return (
    <group position={[0, -0.1, 0]}>
      <RoundedBox args={[0.95, 0.72, 0.36]} radius={0.08} smoothness={3}>
        <meshStandardMaterial {...DARK} />
      </RoundedBox>
      <mesh position={[0, 0.36, 0]}>
        <torusGeometry args={[0.3, 0.065, 12, 32, Math.PI]} />
        <meshStandardMaterial color="#9aa7bd" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.05, 0.185]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.02, 24]} />
        <Glow color={color} intensity={5} />
      </mesh>
      <mesh position={[0, -0.1, 0.185]}>
        <boxGeometry args={[0.06, 0.2, 0.02]} />
        <Glow color={color} intensity={5} />
      </mesh>
    </group>
  );
}

function ServerRack({ color }: { color: string }) {
  const leds = useRef<THREE.MeshStandardMaterial[]>([]);

  useFrame(({ clock }) => {
    leds.current.forEach((m, i) => {
      m.emissiveIntensity = 2 + Math.max(0, Math.sin(clock.elapsedTime * 3 + i * 1.7)) * 4;
    });
  });

  return (
    <group>
      <RoundedBox args={[0.85, 1.35, 0.62]} radius={0.06} smoothness={3}>
        <meshStandardMaterial {...DARK} />
      </RoundedBox>
      {[0.42, 0.14, -0.14, -0.42].map((y, i) => (
        <group key={y} position={[0, y, 0.315]}>
          <mesh position={[-0.08, 0, 0]}>
            <boxGeometry args={[0.52, 0.035, 0.01]} />
            <Glow color={color} intensity={2.4} />
          </mesh>
          <mesh position={[0.3, 0, 0]}>
            <sphereGeometry args={[0.03, 12, 12]} />
            <meshStandardMaterial
              ref={(m) => {
                if (m) leds.current[i] = m;
              }}
              color="#6ee7b7"
              emissive="#6ee7b7"
              emissiveIntensity={3}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function AiCore({ color }: { color: string }) {
  const shell = useRef<THREE.Mesh>(null);
  const orbit = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (shell.current) {
      shell.current.rotation.y += delta * 0.4;
      shell.current.rotation.x += delta * 0.15;
    }
    if (orbit.current) orbit.current.rotation.z += delta * 1.2;
  });

  return (
    <group>
      <mesh ref={shell}>
        <icosahedronGeometry args={[0.68, 1]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.55} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.32, 32, 32]} />
        <Glow color={color} intensity={3.5} />
      </mesh>
      <group ref={orbit} rotation={[Math.PI / 3, 0, 0]}>
        {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((a) => (
          <mesh key={a} position={[Math.cos(a) * 0.95, Math.sin(a) * 0.95, 0]}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <Glow color="#62e0ff" intensity={5} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Container({ color }: { color: string }) {
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(1.4, 0.62, 0.62)), []);
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.4, 0.62, 0.62]} />
        <meshStandardMaterial {...DARK} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={color} toneMapped={false} />
      </lineSegments>
      {Array.from({ length: 9 }, (_, i) => -0.56 + i * 0.14).map((x) => (
        <mesh key={x} position={[x, 0, 0.32]}>
          <boxGeometry args={[0.05, 0.5, 0.02]} />
          <meshStandardMaterial color="#1f2738" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function Database({ color }: { color: string }) {
  return (
    <group position={[0, -0.35, 0]}>
      {[0, 0.36, 0.72].map((y) => (
        <group key={y} position={[0, y, 0]}>
          <mesh>
            <cylinderGeometry args={[0.5, 0.5, 0.28, 40]} />
            <meshStandardMaterial {...DARK} />
          </mesh>
          <mesh position={[0, 0.14, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.5, 0.018, 8, 48]} />
            <Glow color={color} intensity={3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Queue({ color }: { color: string }) {
  const capsules = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    capsules.current?.children.forEach((child, i) => {
      child.position.x = ((clock.elapsedTime * 0.35 + i * 0.25) % 1) * 1.6 - 0.8;
    });
  });

  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.24, 0.24, 1.8, 32, 1, true]} />
        <meshStandardMaterial color="#9fd8ff" transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh>
      {[-0.9, 0.9].map((x) => (
        <mesh key={x} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.25, 0.02, 8, 32]} />
          <Glow color={color} intensity={3} />
        </mesh>
      ))}
      <group ref={capsules}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.09, 0.16, 6, 12]} />
            <Glow color={color} intensity={3.5} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

const MODELS: Record<NodeId, (props: { color: string }) => ReactNode> = {
  gateway: Gateway,
  auth: Lock,
  core: ServerRack,
  ai: AiCore,
  runtime: Container,
  datastore: Database,
  queue: Queue,
};

/* ------------------------------------------------------------ node wrapper */

function ServiceObject({ node, reduced }: { node: ServiceNode; reduced: boolean }) {
  const [hovered, setHovered] = useState(false);
  const group = useRef<THREE.Group>(null);
  const target = useMemo(() => new THREE.Vector3(), []);
  const narrow = useThree((s) => s.size.width < 640);
  const color = COLOR[node.id];
  const Model = MODELS[node.id];

  useFrame((_, delta) => {
    if (!group.current) return;
    target.setScalar(hovered ? 1.15 : 1);
    group.current.scale.lerp(target, Math.min(1, delta * 8));
  });

  return (
    <group position={LAYOUT[node.id]}>
      <Float speed={reduced ? 0 : 1.6} rotationIntensity={0.25} floatIntensity={0.5} floatingRange={[-0.08, 0.08]}>
        <group ref={group}>
          <Model color={color} />
          {/* Invisible hit area, larger than the model, so the node is easy to click. */}
          <mesh
            onPointerOver={(e) => {
              e.stopPropagation();
              setHovered(true);
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              setHovered(false);
              document.body.style.cursor = '';
            }}
            onClick={(e) => {
              e.stopPropagation();
              scrollToSection(node.section);
            }}
          >
            <sphereGeometry args={[0.95, 16, 16]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        </group>
        <Html position={[0, 1.15, 0]} center distanceFactor={narrow ? 6.5 : 10} zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
          <div
            className={`flex flex-col items-center gap-1 whitespace-nowrap transition-all duration-300 ${
              hovered ? 'scale-110' : ''
            }`}
          >
            <span
              className="rounded-full border bg-void/75 px-3 py-1 font-mono text-[13px] text-ink backdrop-blur"
              style={{ borderColor: hovered ? color : 'rgb(255 255 255 / 0.12)' }}
            >
              {node.service}
            </span>
            <span className={`text-[12px] text-mist transition-opacity ${hovered ? 'opacity-100' : 'opacity-0'}`}>
              {node.label} →
            </span>
          </div>
        </Html>
      </Float>
      <mesh position={[0, -1.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.7, 0.76, 48]} />
        <meshBasicMaterial color={color} transparent opacity={hovered ? 0.9 : 0.35} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ---------------------------------------------------------- edges, packets */

function useCurves() {
  return useMemo(
    () =>
      calls.map((call) => {
        const a = new THREE.Vector3(...LAYOUT[call.from]);
        const b = new THREE.Vector3(...LAYOUT[call.to]);
        const mid = a.clone().add(b).multiplyScalar(0.5);
        mid.y += 0.35 + a.distanceTo(b) * 0.12;
        return { call, curve: new THREE.QuadraticBezierCurve3(a, mid, b) };
      }),
    [],
  );
}

function Edges() {
  const curves = useCurves();
  return (
    <group>
      {curves.map(({ call, curve }) => (
        <mesh key={`${call.from}-${call.to}`}>
          <tubeGeometry args={[curve, 48, call.mode === 'hosts' ? 0.008 : 0.014, 6, false]} />
          <meshBasicMaterial
            color={call.mode === 'hosts' ? '#6ee7b7' : COLOR[call.from]}
            transparent
            opacity={call.mode === 'hosts' ? 0.18 : 0.35}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

const PACKETS_PER_EDGE = 2;

/** Stable 0–1 noise per index, so packets don't bunch up and renders stay pure. */
function jitter(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function Packets({ reduced }: { reduced: boolean }) {
  const curves = useCurves();
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const count = curves.length * PACKETS_PER_EDGE;

  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        offset: (i % PACKETS_PER_EDGE) / PACKETS_PER_EDGE + jitter(i) * 0.2,
        speed: curves[Math.floor(i / PACKETS_PER_EDGE)].call.mode === 'async' ? 0.12 : 0.22 + jitter(i + 99) * 0.08,
      })),
    [count, curves],
  );

  useFrame(({ clock }) => {
    const m = mesh.current;
    if (!m) return;
    for (let i = 0; i < count; i++) {
      const { curve, call } = curves[Math.floor(i / PACKETS_PER_EDGE)];
      const t = reduced ? seeds[i].offset % 1 : (clock.elapsedTime * seeds[i].speed + seeds[i].offset) % 1;
      dummy.position.copy(curve.getPoint(t));
      dummy.scale.setScalar(call.mode === 'hosts' ? 0.6 : 1);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });

  // HDR colours (> 1) so the bloom pass picks the packets up.
  useLayoutEffect(() => {
    const m = mesh.current;
    if (!m) return;
    for (let i = 0; i < count; i++) {
      const { call } = curves[Math.floor(i / PACKETS_PER_EDGE)];
      m.setColorAt(i, new THREE.Color(call.mode === 'hosts' ? '#6ee7b7' : COLOR[call.from]).multiplyScalar(4));
    }
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [count, curves]);

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.06, 12, 12]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}

/* ------------------------------------------------------------------- stage */

function Stage({ reduced }: { reduced: boolean }) {
  const { size } = useThree();
  const scale = size.width < 640 ? 0.6 : size.width < 1024 ? 0.78 : 1;

  return (
    <group scale={scale} position={[0, size.width < 640 ? 0.4 : 0, 0]}>
      {nodes.map((node) => (
        <ServiceObject key={node.id} node={node} reduced={reduced} />
      ))}
      <Edges />
      <Packets reduced={reduced} />
      <gridHelper args={[18, 36, '#1d2b3d', '#10161f']} position={[0, -2.2, 0]} />
    </group>
  );
}

export default function TopologyScene({ active, reduced, touch }: { active: boolean; reduced: boolean; touch: boolean }) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, touch ? 1.5 : 2]}
      camera={{ position: [0, 2.4, 10], fov: 42 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      aria-hidden="true"
    >
      <color attach="background" args={['#040507']} />
      <fog attach="fog" args={['#040507', 11, 22]} />
      <ambientLight intensity={0.35} color="#3a3f7a" />
      <spotLight position={[4, 8, 6]} angle={0.5} penumbra={0.8} intensity={140} color="#62e0ff" />
      <spotLight position={[-6, 6, 4]} angle={0.6} penumbra={1} intensity={120} color="#a78bfa" />
      <pointLight position={[0, -1, 3]} intensity={12} color="#52aeff" />

      <Stage reduced={reduced} />
      <Sparkles count={70} scale={[16, 7, 10]} size={2.2} speed={reduced ? 0 : 0.35} color="#62e0ff" opacity={0.55} />
      <Sparkles count={40} scale={[16, 7, 10]} size={1.6} speed={reduced ? 0 : 0.25} color="#a78bfa" opacity={0.45} />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate={!touch}
        enableDamping
        autoRotate={!reduced}
        autoRotateSpeed={0.45}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.05}
      />

      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur intensity={1.15} luminanceThreshold={0.9} luminanceSmoothing={0.2} />
      </EffectComposer>
    </Canvas>
  );
}
