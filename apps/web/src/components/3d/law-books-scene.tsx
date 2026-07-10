"use client";
import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

// ─── Materials ─────────────────────────────────────────────────────────────────
function GoldMat({ glow = 1.6 }: { glow?: number }) {
  return (
    <meshStandardMaterial color="#c8920a" emissive="#d4a832"
      emissiveIntensity={glow} metalness={0.97} roughness={0.03} />
  );
}
function DarkMat({ color = "#1a0e08", glow = 0 }: { color?: string; glow?: number }) {
  return (
    <meshStandardMaterial color={color} emissive={color}
      emissiveIntensity={glow} metalness={0.35} roughness={0.62} />
  );
}

// ─── Chain ─────────────────────────────────────────────────────────────────────
function Chain({ length, x }: { length: number; x: number }) {
  const rings = Math.round(length / 0.13);
  return (
    <group position={[x, 0, 0]}>
      {Array.from({ length: rings }, (_, i) => (
        <mesh key={i} position={[0, -(i * length) / rings, 0]}
          rotation={[Math.PI / 2, (i % 2) * (Math.PI / 2), 0]}>
          <torusGeometry args={[0.032, 0.011, 8, 14]} />
          <GoldMat glow={0.9} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Scale pan ─────────────────────────────────────────────────────────────────
function Pan() {
  return (
    <group>
      {/* Rim */}
      <mesh>
        <torusGeometry args={[0.5, 0.038, 16, 64]} />
        <GoldMat glow={3.2} />
      </mesh>
      {/* Bowl floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.038, 0]}>
        <circleGeometry args={[0.49, 64]} />
        <meshStandardMaterial color="#c8920a" emissive="#d4a832"
          emissiveIntensity={0.28} metalness={0.9} roughness={0.18}
          transparent opacity={0.4} />
      </mesh>
      {/* 3 suspension wires */}
      {[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.46, 0.36, Math.sin(a) * 0.46]}>
            <cylinderGeometry args={[0.007, 0.007, 0.76, 6]} />
            <GoldMat glow={0.65} />
          </mesh>
        );
      })}
    </group>
  );
}

// ─── The full balance scales ───────────────────────────────────────────────────
function JusticeScales() {
  const beamRef  = useRef<THREE.Group>(null);
  const leftRef  = useRef<THREE.Group>(null);
  const rightRef = useRef<THREE.Group>(null);

  const BH = 1.55;  // half-beam length
  const CL = 1.35;  // chain length

  useFrame((s) => {
    const t   = s.clock.getElapsedTime();
    const tilt = Math.sin(t * 0.32) * 0.14; // slow, weighty swing

    if (beamRef.current)  beamRef.current.rotation.z = tilt;
    if (leftRef.current)  {
      leftRef.current.position.x = -BH * Math.cos(tilt);
      leftRef.current.position.y =  BH * Math.sin(tilt);
    }
    if (rightRef.current) {
      rightRef.current.position.x =  BH * Math.cos(tilt);
      rightRef.current.position.y = -BH * Math.sin(tilt);
    }
  });

  return (
    <group position={[0.2, 0.8, 0]}>
      {/* ── Pedestal ── */}
      <mesh position={[0, -4.55, 0]}>
        <cylinderGeometry args={[0.55, 0.72, 0.28, 32]} />
        <GoldMat glow={0.55} />
      </mesh>
      <mesh position={[0, -4.24, 0]}>
        <cylinderGeometry args={[0.28, 0.55, 0.32, 32]} />
        <GoldMat glow={0.7} />
      </mesh>
      {/* ── Pole ── */}
      <mesh position={[0, -1.9, 0]}>
        <cylinderGeometry args={[0.048, 0.064, 4.6, 18]} />
        <GoldMat glow={1.1} />
      </mesh>
      {/* ── Crown cap ── */}
      <mesh position={[0, 0.42, 0]}>
        <sphereGeometry args={[0.13, 24, 24]} />
        <GoldMat glow={4.2} />
      </mesh>
      {/* ── Beam (animated) ── */}
      <group ref={beamRef}>
        <mesh>
          <boxGeometry args={[BH * 2 + 0.16, 0.055, 0.055]} />
          <GoldMat glow={1.8} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * (BH + 0.06), 0, 0]}>
            <sphereGeometry args={[0.065, 16, 16]} />
            <GoldMat glow={2.8} />
          </mesh>
        ))}
      </group>
      {/* ── Left arm ── */}
      <group ref={leftRef} position={[-BH, 0, 0]}>
        <Chain length={CL} x={0} />
        <group position={[0, -CL - 0.38, 0]}><Pan /></group>
      </group>
      {/* ── Right arm ── */}
      <group ref={rightRef} position={[BH, 0, 0]}>
        <Chain length={CL} x={0} />
        <group position={[0, -CL - 0.38, 0]}><Pan /></group>
      </group>
    </group>
  );
}

// ─── Judge's gavel ─────────────────────────────────────────────────────────────
function Gavel() {
  const ref = useRef<THREE.Group>(null);

  useFrame((s) => {
    if (!ref.current) return;
    // Slow gentle bob
    ref.current.position.y = -2.8 + Math.sin(s.clock.getElapsedTime() * 0.3) * 0.06;
  });

  return (
    <group ref={ref} position={[3.0, -2.8, 0.6]} rotation={[0.15, -0.35, -0.55]}>
      {/* Handle */}
      <mesh>
        <cylinderGeometry args={[0.055, 0.075, 3.2, 14]} />
        <meshStandardMaterial color="#5c2e0a" emissive="#8a4818"
          emissiveIntensity={0.22} metalness={0.25} roughness={0.7} />
      </mesh>
      {/* Gavel head */}
      <mesh position={[0, 1.52, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.24, 0.24, 0.88, 16]} />
        <meshStandardMaterial color="#3e1e06" emissive="#6a3010"
          emissiveIntensity={0.25} metalness={0.3} roughness={0.6} />
      </mesh>
      {/* Metal band on head */}
      <mesh position={[0, 1.52, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.252, 0.252, 0.12, 16]} />
        <GoldMat glow={0.85} />
      </mesh>
    </group>
  );
}

// ─── Gavel block ───────────────────────────────────────────────────────────────
function GavelBlock() {
  return (
    <group position={[3.0, -3.55, 0.4]}>
      <mesh>
        <boxGeometry args={[1.1, 0.25, 0.7]} />
        <meshStandardMaterial color="#4a2208" emissive="#6a3010"
          emissiveIntensity={0.15} metalness={0.2} roughness={0.72} />
      </mesh>
      {/* Top face trim */}
      <mesh position={[0, 0.128, 0]}>
        <boxGeometry args={[1.08, 0.01, 0.68]} />
        <GoldMat glow={0.45} />
      </mesh>
    </group>
  );
}

// ─── Floating legal document ───────────────────────────────────────────────────
function FloatingDoc() {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!ref.current) return;
    const t = s.clock.getElapsedTime();
    ref.current.position.y = -0.6 + Math.sin(t * 0.28 + 1) * 0.22;
    ref.current.rotation.y = -0.3 + Math.sin(t * 0.14) * 0.1;
    ref.current.rotation.z = 0.05 + Math.sin(t * 0.22) * 0.03;
  });
  return (
    <group ref={ref} position={[-2.8, -0.6, 0.3]}>
      {/* Parchment */}
      <mesh>
        <planeGeometry args={[1.25, 1.65]} />
        <meshStandardMaterial color="#f0e8d2" emissive="#e0c870"
          emissiveIntensity={0.05} roughness={0.92} side={THREE.DoubleSide} />
      </mesh>
      {/* Header gold rule */}
      <mesh position={[0, 0.68, 0.002]}>
        <planeGeometry args={[1.0, 0.055]} />
        <meshStandardMaterial color="#d4af7a" emissive="#d4af7a"
          emissiveIntensity={1.6} transparent opacity={0.82} />
      </mesh>
      {/* Title bar */}
      <mesh position={[0, 0.57, 0.002]}>
        <planeGeometry args={[0.7, 0.034]} />
        <meshStandardMaterial color="#d4af7a" emissive="#d4af7a"
          emissiveIntensity={0.8} transparent opacity={0.55} />
      </mesh>
      {/* Text lines */}
      {Array.from({ length: 18 }, (_, i) => (
        <mesh key={i} position={[i % 2 ? 0.02 : -0.02, 0.42 - i * 0.076, 0.002]}>
          <planeGeometry args={[0.85 - (i % 5) * 0.06, 0.013]} />
          <meshStandardMaterial color="#7a6a48" transparent opacity={0.3} />
        </mesh>
      ))}
      {/* Wax seal */}
      <mesh position={[0.35, -0.64, 0.005]}>
        <circleGeometry args={[0.105, 32]} />
        <meshStandardMaterial color="#8b1a1a" emissive="#cc2020"
          emissiveIntensity={0.7} roughness={0.6} />
      </mesh>
      <mesh position={[0.35, -0.64, 0.007]}>
        <ringGeometry args={[0.075, 0.105, 32]} />
        <meshStandardMaterial color="#d4af7a" emissive="#d4af7a"
          emissiveIntensity={1.2} transparent opacity={0.75} />
      </mesh>
    </group>
  );
}

// ─── Gold particles ────────────────────────────────────────────────────────────
function GoldParticles() {
  const COUNT = 320;
  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, []);
  const ref = useRef<THREE.Points>(null);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.y = s.clock.getElapsedTime() * 0.005;
    const pos = ref.current.geometry.attributes["position"]!.array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3 + 1]! += 0.004;
      if ((pos[i * 3 + 1] ?? 0) > 9) pos[i * 3 + 1] = -9;
    }
    ref.current.geometry.attributes["position"]!.needsUpdate = true;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#d4af7a" size={0.032} transparent opacity={0.42} sizeAttenuation />
    </points>
  );
}

// ─── God-ray shafts ────────────────────────────────────────────────────────────
function VolumetricLight() {
  const a = useRef<THREE.Mesh>(null);
  const b = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    const t = s.clock.getElapsedTime();
    if (a.current) (a.current.material as THREE.MeshBasicMaterial).opacity = 0.028 + Math.sin(t * 0.22) * 0.009;
    if (b.current) (b.current.material as THREE.MeshBasicMaterial).opacity = 0.013 + Math.sin(t * 0.3 + 1.2) * 0.005;
  });
  return (
    <group position={[0.5, 13, -3]}>
      <mesh ref={a} rotation={[Math.PI, 0.1, 0]}>
        <coneGeometry args={[6.5, 22, 32, 1, true]} />
        <meshBasicMaterial color="#d4a028" transparent opacity={0.028} side={THREE.BackSide} depthWrite={false} />
      </mesh>
      <mesh ref={b} rotation={[Math.PI, 0, 0]} scale={[0.38, 1, 0.38]}>
        <coneGeometry args={[6.5, 22, 32, 1, true]} />
        <meshBasicMaterial color="#ffe090" transparent opacity={0.013} side={THREE.BackSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

// ─── Cinematic camera drift ────────────────────────────────────────────────────
function CinematicCamera() {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(0.3, 0.2, 0), []);
  useEffect(() => { camera.lookAt(target); }, [camera, target]);
  useFrame((s) => {
    const t = s.clock.getElapsedTime();
    camera.position.x = 0.3 + Math.sin(t * 0.07) * 0.13;
    camera.position.y = -0.5 + Math.sin(t * 0.11) * 0.07;
    camera.lookAt(target);
  });
  return null;
}

// ─── Scene root + mouse parallax ──────────────────────────────────────────────
function SceneRoot() {
  const ref = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, pointer.x * 0.04, 0.02);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, pointer.y * -0.03, 0.02);
  });
  return (
    <group ref={ref}>
      <VolumetricLight />
      <JusticeScales />
      <Gavel />
      <GavelBlock />
      <FloatingDoc />
      <GoldParticles />
    </group>
  );
}

// ─── Canvas ────────────────────────────────────────────────────────────────────
export function LawBooksScene() {
  return (
    <Canvas
      camera={{ position: [0.3, -0.5, 11], fov: 42 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.8,
      }}
      dpr={[1, 1.75]}
    >
      <ambientLight intensity={0.03} color="#0a0812" />

      {/* Primary key — golden, from high above-front */}
      <pointLight position={[0.5, 14, 9]}   intensity={700}  color="#f0d870" distance={30} decay={2} />
      {/* Close front fill — illuminates pans and face */}
      <pointLight position={[0.5, 3, 9]}    intensity={320}  color="#e8c850" distance={16} decay={2} />
      {/* Warm floor bounce */}
      <pointLight position={[0, -6, 5]}     intensity={160}  color="#c87820" distance={14} decay={2} />
      {/* Cool blue rim — left */}
      <pointLight position={[-8, 4, 2]}     intensity={220}  color="#2244bb" distance={22} decay={2} />
      {/* Purple accent — right-back */}
      <pointLight position={[6, 1, -3]}     intensity={110}  color="#6b1aaa" distance={15} decay={2} />
      {/* Tight spot on scale pans */}
      <spotLight position={[1, 12, 9]}      intensity={600}  color="#fff8d0"
        angle={0.24} penumbra={0.65} distance={24} decay={2} />
      {/* Gavel area light */}
      <pointLight position={[3.5, -2, 4]}   intensity={180}  color="#d4a030" distance={10} decay={2} />

      <fog attach="fog" args={["#04020e", 14, 36]} />
      <Stars radius={90} depth={70} count={2200} factor={4} saturation={0} fade speed={0.04} />

      <CinematicCamera />
      <SceneRoot />

      <EffectComposer>
        <Bloom intensity={2.2} luminanceThreshold={0.14} luminanceSmoothing={0.9} mipmapBlur />
        <Vignette eskil={false} offset={0.24} darkness={0.8} />
      </EffectComposer>
    </Canvas>
  );
}
