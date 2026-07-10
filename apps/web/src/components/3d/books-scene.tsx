"use client";
import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

type MatProps = {
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
  metalness?: number;
  roughness?: number;
  transparent?: boolean;
  opacity?: number;
};

const GOLD: MatProps = { color: "#c9a227", emissive: "#c9a227", emissiveIntensity: 1.0, metalness: 0.9, roughness: 0.1 };

type BookDef = {
  title: string;
  color: string;
  y: number;
  tilt: number;
};

const BOOKS: BookDef[] = [
  { title: "CONSTITUTION",   color: "#1a0d02", y: 1.05,  tilt:  0.03 },
  { title: "LABOUR LAW",     color: "#0f0a02", y: 0.28,  tilt: -0.02 },
  { title: "CRIMINAL LAW",   color: "#180900", y: -0.49, tilt:  0.04 },
  { title: "CONSUMER RIGHTS",color: "#0a0f02", y: -1.26, tilt: -0.03 },
];

function Book({ def, index }: { def: BookDef; index: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!ref.current) return;
    ref.current.position.y = def.y + Math.sin(t * 0.3 + index * 0.8) * 0.018;
  });

  return (
    <group ref={ref} position={[0, def.y, index * 0.015]} rotation={[def.tilt, 0, 0]}>
      {/* Book body */}
      <mesh>
        <boxGeometry args={[2.8, 0.75, 0.55]} />
        <meshStandardMaterial color={def.color} emissive="#c9a227" emissiveIntensity={0.03} metalness={0.12} roughness={0.9} />
      </mesh>
      {/* Top face gold edge */}
      <mesh position={[0, 0.378, 0]}>
        <boxGeometry args={[2.8, 0.005, 0.55]} />
        <meshStandardMaterial {...GOLD} emissiveIntensity={1.2} metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Spine (left) */}
      <mesh position={[-1.405, 0, 0]}>
        <boxGeometry args={[0.01, 0.75, 0.55]} />
        <meshStandardMaterial {...GOLD} emissiveIntensity={2.0} metalness={0.95} roughness={0.05} />
      </mesh>
      {/* Front cover face */}
      <mesh position={[0, 0, 0.278]}>
        <planeGeometry args={[2.78, 0.73]} />
        <meshStandardMaterial color={def.color} emissive="#c9a227" emissiveIntensity={0.06} metalness={0.05} roughness={0.95} />
      </mesh>
      {/* Title text bar */}
      <mesh position={[0.3, 0.12, 0.281]}>
        <planeGeometry args={[2.0, 0.045]} />
        <meshStandardMaterial color="#c9a227" emissive="#c9a227" emissiveIntensity={1.5} transparent opacity={0.75} />
      </mesh>
      <mesh position={[0.3, 0.03, 0.281]}>
        <planeGeometry args={[1.4, 0.025]} />
        <meshStandardMaterial color="#c9a227" emissive="#c9a227" emissiveIntensity={0.8} transparent opacity={0.3} />
      </mesh>
      {/* Decorative edge lines on cover */}
      <mesh position={[0, 0, 0.281]}>
        <planeGeometry args={[2.62, 0.008]} />
        <meshStandardMaterial color="#c9a227" emissive="#c9a227" emissiveIntensity={0.6} transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

function Gavel() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!ref.current) return;
    ref.current.rotation.z = -0.5 + Math.sin(t * 0.4) * 0.06;
    ref.current.position.y = -2.0 + Math.sin(t * 0.4) * 0.04;
  });

  const woodMat: MatProps = {
    color: "#2a1200",
    emissive: "#c9a227",
    emissiveIntensity: 0.05,
    metalness: 0.1,
    roughness: 0.85,
  };
  const headMat: MatProps = {
    ...GOLD,
    emissiveIntensity: 1.4,
    metalness: 0.9,
    roughness: 0.1,
  };

  return (
    <group ref={ref} position={[1.6, -2.0, 0.6]} rotation={[0, 0.4, -0.5]}>
      {/* Gavel head */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.7, 20]} />
        <meshStandardMaterial {...headMat} />
      </mesh>
      {/* Head gold bands */}
      {[-0.32, 0.32].map((z, i) => (
        <mesh key={i} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.22, 0.025, 12, 48]} />
          <meshStandardMaterial {...headMat} emissiveIntensity={0.45} />
        </mesh>
      ))}
      {/* Handle */}
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[0.065, 0.08, 1.8, 16]} />
        <meshStandardMaterial {...woodMat} />
      </mesh>
      {/* Handle gold ring */}
      <mesh position={[0, -0.35, 0]}>
        <torusGeometry args={[0.072, 0.018, 12, 36]} />
        <meshStandardMaterial {...headMat} emissiveIntensity={0.35} />
      </mesh>
    </group>
  );
}

function BooksScene() {
  const outerRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame(() => {
    if (!outerRef.current) return;
    outerRef.current.rotation.y = THREE.MathUtils.lerp(outerRef.current.rotation.y, pointer.x * 0.15, 0.04);
    outerRef.current.rotation.x = THREE.MathUtils.lerp(outerRef.current.rotation.x, pointer.y * -0.08, 0.04);
  });

  return (
    <group ref={outerRef} position={[0.3, 0.2, 0]}>
      {BOOKS.map((def, i) => (
        <Book key={def.title} def={def} index={i} />
      ))}
      <Gavel />

      {/* Glow beneath books */}
      <mesh position={[0, -1.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2.2, 2.2, 0.02, 64]} />
        <meshStandardMaterial {...GOLD} emissiveIntensity={0.12} metalness={0.9} roughness={0.1} transparent opacity={0.5} />
      </mesh>
      <mesh position={[0, -1.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.0, 0.04, 16, 128]} />
        <meshStandardMaterial color="#c9a227" emissive="#c9a227" emissiveIntensity={1.2} transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

export function BooksScene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 6.5], fov: 38 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      dpr={[1, 1.5]}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.15} />
      <pointLight position={[5, 6, 6]}   intensity={12}  color="#c9a227" />
      <pointLight position={[-5, -3, 4]} intensity={4}   color="#5040ff" />
      <pointLight position={[0, -8, 5]}  intensity={4}   color="#c9a227" />
      <pointLight position={[0, 4, 4]}   intensity={3}   color="#ffffff" />

      <BooksScene />
    </Canvas>
  );
}
