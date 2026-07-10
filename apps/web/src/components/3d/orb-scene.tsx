"use client";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Stars, Sphere } from "@react-three/drei";
import type { Mesh } from "three";

function GoldGlobe() {
  const ref = useRef<Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.08;
    ref.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.06) * 0.04;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={ref}>
        <sphereGeometry args={[2, 80, 80]} />
        <MeshDistortMaterial
          color="#4a3200"
          emissive="#c9a227"
          emissiveIntensity={0.35}
          metalness={0.95}
          roughness={0.05}
          distort={0.18}
          speed={1.2}
        />
      </mesh>

      {/* Inner glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.55, 0.015, 16, 120]} />
        <meshBasicMaterial color="#c9a227" transparent opacity={0.5} />
      </mesh>

      {/* Outer ring */}
      <mesh rotation={[Math.PI / 2.5, 0.3, 0]}>
        <torusGeometry args={[3.0, 0.008, 16, 120]} />
        <meshBasicMaterial color="#c9a227" transparent opacity={0.18} />
      </mesh>
    </Float>
  );
}

export function OrbScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.15} />
      <pointLight position={[6, 6, 6]} intensity={4} color="#c9a227" />
      <pointLight position={[-6, -4, -6]} intensity={1.5} color="#8b6914" />
      <pointLight position={[0, -8, 0]} intensity={0.8} color="#4a3200" />
      <Stars radius={30} depth={40} count={1200} factor={2.5} saturation={0.2} fade speed={0.3} />
      <GoldGlobe />
    </Canvas>
  );
}
