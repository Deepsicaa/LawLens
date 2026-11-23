"use client";

import { Canvas } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { Component, useState, type ReactNode } from "react";

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  override render() {
    if (this.state.failed) return <div className="static-scales">⚖</div>;
    return this.props.children;
  }
}

function Book({ y, color, angle }: { y: number; color: string; angle: number }) {
  return (
    <group position={[0, y, 0]} rotation={[0, angle, 0]}>
      <RoundedBox args={[2.48, 0.29, 1.53]} radius={0.04}>
        <meshStandardMaterial color="#fff9e9" />
      </RoundedBox>
      {[-0.19, 0.19].map((h) => (
        <RoundedBox key={h} args={[2.64, 0.1, 1.65]} radius={0.04} position={[0, h, 0]}>
          <meshStandardMaterial color={color} />
        </RoundedBox>
      ))}
      <RoundedBox args={[0.12, 0.44, 1.65]} radius={0.045} position={[-1.25, 0, 0]}>
        <meshStandardMaterial color={color} />
      </RoundedBox>
    </group>
  );
}

function Rod({
  x,
  y,
  length,
  radius,
  angle = 0,
}: {
  x: number;
  y: number;
  length: number;
  radius: number;
  angle?: number;
}) {
  return (
    <mesh position={[x, y, 0]} rotation={[0, 0, angle]}>
      <cylinderGeometry args={[radius, radius, length, 20]} />
      <meshStandardMaterial color="#ecc873" />
    </mesh>
  );
}

export function ClarityScene() {
  const [angle, setAngle] = useState(0.2);
  return (
    <div className="clarity-art">
      <div className="orbit" aria-hidden="true" />
      <div className="clay-stage" aria-hidden="true">
        <SceneBoundary>
          <Canvas
            frameloop="demand"
            dpr={[1, 1.5]}
            camera={{ position: [4.1, 3.1, 7.8], fov: 34 }}
            onCreated={({ camera }) => camera.lookAt(0, 0.45, 0)}
            fallback={<span>📚 ⚖️</span>}
          >
            <ambientLight intensity={2} />
            <directionalLight position={[-3, 7, 5]} intensity={3} />
            <directionalLight position={[5, 2, 0]} intensity={1.2} />
            <group rotation={[0, angle, 0]}>
              <mesh position={[0, -1.13, 0]}>
                <cylinderGeometry args={[2.15, 2.18, 0.23, 72]} />
                <meshStandardMaterial color="#d6cddd" />
              </mesh>
              <Book y={-0.75} color="#efa78d" angle={-0.13} />
              <Book y={-0.28} color="#b8a0d6" angle={0.12} />
              <Book y={0.19} color="#b5c5a3" angle={-0.04} />
              <group position={[0.35, 0.42, 0]}>
                <Rod x={0} y={0.66} length={1.35} radius={0.055} />
                <Rod x={0} y={1.27} length={1.48} radius={0.048} angle={Math.PI / 2} />
                <mesh position={[0, 1.44, 0]}>
                  <sphereGeometry args={[0.14, 24, 16]} />
                  <meshStandardMaterial color="#f1d17b" />
                </mesh>
                {[-0.61, 0.61].map((x) => (
                  <group key={x}>
                    <Rod x={x - 0.09} y={0.97} length={0.62} radius={0.013} angle={-0.18} />
                    <Rod x={x + 0.09} y={0.97} length={0.62} radius={0.013} angle={0.18} />
                    <mesh position={[x, 0.65, 0]}>
                      <cylinderGeometry args={[0.29, 0.14, 0.11, 32]} />
                      <meshStandardMaterial color="#e6ba60" />
                    </mesh>
                  </group>
                ))}
              </group>
              <group position={[-1.4, 0.84, 0.1]} rotation={[0, -0.17, -0.2]}>
                <mesh>
                  <torusGeometry args={[0.39, 0.083, 18, 48]} />
                  <meshStandardMaterial color="#aa86cc" />
                </mesh>
                <mesh position={[0, -0.63, 0]}>
                  <capsuleGeometry args={[0.075, 0.43, 8, 16]} />
                  <meshStandardMaterial color="#906ab5" />
                </mesh>
              </group>
              <mesh position={[0.96, -0.73, 1.04]}>
                <sphereGeometry args={[0.3, 28, 24]} />
                <meshStandardMaterial color="#f6d58c" />
              </mesh>
            </group>
          </Canvas>
        </SceneBoundary>
      </div>
      <span className="art-note note-top">⚖　 A fair bit of perspective.</span>
      <span className="art-note note-low">✓　 Real sources. Clearer thinking.</span>
      <button className="spin-scene" onClick={() => setAngle((v) => v + Math.PI / 5)}>
        ↻　Give it a spin
      </button>
    </div>
  );
}
