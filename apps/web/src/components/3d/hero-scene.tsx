"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

// ── Simplified land-mass check (lat -90→90, lon -180→180) ────────────────────
function isLand(lat: number, lon: number): boolean {
  let l = lon; while (l > 180) l -= 360; while (l < -180) l += 360;
  // North America
  if (lat>60&&lat<80&&l>-145&&l<-60) return true;
  if (lat>45&&lat<60&&l>-125&&l<-60) return true;
  if (lat>25&&lat<45&&l>-125&&l<-65) return true;
  if (lat>15&&lat<25&&l>-105&&l<-80) return true;
  if (lat>7&&lat<15&&l>-92&&l<-77) return true;
  // Greenland
  if (lat>60&&lat<84&&l>-55&&l<-15) return true;
  // South America
  if (lat>-5&&lat<12&&l>-82&&l<-60) return true;
  if (lat>-25&&lat<-5&&l>-80&&l<-34) return true;
  if (lat>-55&&lat<-25&&l>-76&&l<-48) return true;
  // Europe
  if (lat>36&&lat<48&&l>-9&&l<30) return true;
  if (lat>48&&lat<58&&l>-5&&l<25) return true;
  if (lat>55&&lat<65&&l>4&&l<30) return true;
  if (lat>58&&lat<71&&l>4&&l<32) return true;
  if (lat>50&&lat<59&&l>-8&&l<2) return true; // British Isles
  if (lat>63&&lat<67&&l>-24&&l<-13) return true; // Iceland
  // Africa
  if (lat>-5&&lat<15&&l>-17&&l<50) return true;
  if (lat>15&&lat<37&&l>-17&&l<42) return true;
  if (lat>-35&&lat<-5&&l>12&&l<50) return true;
  if (lat>-35&&lat<-18&&l>15&&l<35) return true;
  // Middle East / Arabian Peninsula
  if (lat>12&&lat<37&&l>35&&l<60) return true;
  // Central Asia
  if (lat>37&&lat<56&&l>50&&l<90) return true;
  // South Asia
  if (lat>5&&lat<37&&l>60&&l<100) return true;
  // Russia / Siberia
  if (lat>50&&lat<75&&l>25&&l<180) return true;
  if (lat>50&&lat<75&&l>-180&&l<-165) return true;
  // East/Southeast Asia
  if (lat>20&&lat<50&&l>100&&l<145) return true;
  if (lat>0&&lat<20&&l>100&&l<120) return true;
  // Japan
  if (lat>30&&lat<45&&l>130&&l<145) return true;
  // Australia
  if (lat>-38&&lat<-14&&l>115&&l<154) return true;
  // New Zealand (rough)
  if (lat>-47&&lat<-34&&l>166&&l<178) return true;
  return false;
}

// ── Atmosphere Fresnel shader ─────────────────────────────────────────────────
const ATMOS_VERT = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const ATMOS_FRAG = `
  varying vec3 vNormal;
  void main() {
    float i = pow(0.78 - dot(vNormal, vec3(0.0,0.0,1.0)), 4.2);
    gl_FragColor = vec4(0.18, 0.52, 1.0, 1.0) * i * 1.6;
  }
`;

// ── Globe ─────────────────────────────────────────────────────────────────────
function HoloGlobe() {
  const groupRef = useRef<THREE.Group>(null);
  const R = 2.08;

  // Land dots
  const landPositions = useMemo(() => {
    const pts: number[] = [];
    const step = 2.5;
    for (let lat = -85; lat <= 85; lat += step) {
      for (let lon = -180; lon < 180; lon += step) {
        if (!isLand(lat, lon)) continue;
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        const r = R + 0.008;
        pts.push(r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
      }
    }
    return new Float32Array(pts);
  }, []);

  // Ocean surface dots (sparse)
  const oceanPositions = useMemo(() => {
    const pts: number[] = [];
    const step = 5;
    for (let lat = -85; lat <= 85; lat += step) {
      for (let lon = -180; lon < 180; lon += step) {
        if (isLand(lat, lon)) continue;
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        const r = R + 0.004;
        pts.push(r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
      }
    }
    return new Float32Array(pts);
  }, []);

  // City lights
  const cityLights = useMemo(() => {
    const hubs = [
      [28.6,77.2],[51.5,-0.1],[48.9,2.3],[40.7,-74],[35.7,139.7],
      [-33.9,151.2],[19.1,72.9],[55.8,37.6],[-23.5,-46.6],[41,28.9],
      [37.8,-122.4],[52.5,13.4],[25.2,55.3],[1.3,103.8],[22.3,114.2],
      [31.2,121.5],[34.0,-118.2],[41.8,-87.6],[43.7,-79.4],[48.2,16.4],
      [59.9,30.3],[55.7,12.6],[60.2,24.9],[47.5,19.1],[50.1,8.7],
      [45.5,-73.6],[19.4,-99.1],[4.7,-74.1],[-34.6,-58.4],[-12.0,-77.0],
      [30.0,31.2],[24.7,46.7],[3.1,101.7],[-6.2,106.8],[14.6,121.0],
      [23.1,113.3],[30.6,114.3],[36.7,117.0],[39.9,116.4],[26.1,119.3],
    ];
    const arr: number[] = [];
    hubs.forEach(([la, lo]) => {
      for (let k = 0; k < 8; k++) {
        const jLat = la! + (Math.random()-0.5)*4;
        const jLon = lo! + (Math.random()-0.5)*4;
        const phi = (90-jLat)*(Math.PI/180);
        const theta = (jLon+180)*(Math.PI/180);
        const r = R + 0.022 + Math.random()*0.02;
        arr.push(r*Math.sin(phi)*Math.cos(theta), r*Math.cos(phi), r*Math.sin(phi)*Math.sin(theta));
      }
    });
    return new Float32Array(arr);
  }, []);

  // Atmosphere material (Fresnel)
  const atmosMat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: ATMOS_VERT,
    fragmentShader: ATMOS_FRAG,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
  }), []);

  useFrame(() => { if (groupRef.current) groupRef.current.rotation.y += 0.0006; });

  return (
    <group ref={groupRef}>
      {/* Ocean sphere */}
      <mesh>
        <sphereGeometry args={[R, 64, 64]} />
        <meshStandardMaterial color="#020c1e" emissive="#031240" emissiveIntensity={0.55} />
      </mesh>

      {/* Land dots */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[landPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#2d6a4f" size={0.028} transparent opacity={0.92} sizeAttenuation />
      </points>

      {/* Ocean shimmer dots */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[oceanPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#1a4a8a" size={0.012} transparent opacity={0.22} sizeAttenuation />
      </points>

      {/* City lights */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[cityLights, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#ffd47a" size={0.048} transparent opacity={0.95} sizeAttenuation />
      </points>

      {/* Atmosphere shell (Fresnel glow) */}
      <mesh scale={1.18}>
        <sphereGeometry args={[R, 48, 48]} />
        <primitive object={atmosMat} attach="material" />
      </mesh>

      {/* Inner glow ring (thicker halo) */}
      <mesh scale={1.08}>
        <sphereGeometry args={[R, 32, 32]} />
        <meshStandardMaterial
          color="#0055ff"
          emissive="#0055ff"
          emissiveIntensity={0.12}
          transparent
          opacity={0.07}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Equatorial ring */}
      <mesh rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[2.72, 0.01, 16, 200]} />
        <meshStandardMaterial color="#d4af7a" emissive="#d4af7a" emissiveIntensity={2.8} metalness={0.9} />
      </mesh>
    </group>
  );
}

// ── Lens ──────────────────────────────────────────────────────────────────────
function GlassLens() {
  const spinRef = useRef<THREE.Mesh>(null);
  useFrame((s) => { if (spinRef.current) spinRef.current.rotation.z = s.clock.getElapsedTime() * 0.025; });
  return (
    <group>
      <mesh><torusGeometry args={[3.05,0.2,32,220]} /><meshStandardMaterial color="#1e1e28" emissive="#d4af7a" emissiveIntensity={0.35} metalness={0.99} roughness={0.01} /></mesh>
      <mesh ref={spinRef}><torusGeometry args={[3.24,0.038,16,220]} /><meshStandardMaterial color="#d4af7a" emissive="#d4af7a" emissiveIntensity={1.8} metalness={0.9} roughness={0.1} transparent opacity={0.55} /></mesh>
      <mesh><torusGeometry args={[2.87,0.022,16,220]} /><meshStandardMaterial color="#d4af7a" emissive="#d4af7a" emissiveIntensity={3.0} metalness={0.95} roughness={0.05} /></mesh>
      <mesh><circleGeometry args={[2.86,128]} /><meshStandardMaterial color="#0810a0" emissive="#2040c0" emissiveIntensity={0.1} transparent opacity={0.08} side={THREE.DoubleSide} /></mesh>
      <mesh position={[-0.8,0.8,0.02]}><torusGeometry args={[1.2,0.015,8,80,Math.PI*0.6]} /><meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} transparent opacity={0.3} /></mesh>
      <mesh position={[2.15,-2.15,0]}><sphereGeometry args={[0.24,20,20]} /><meshStandardMaterial color="#1a1a28" emissive="#d4af7a" emissiveIntensity={1.0} metalness={0.99} roughness={0.01} /></mesh>
      <mesh position={[3.35,-3.35,-0.12]} rotation={[0,0,Math.PI/4]}><cylinderGeometry args={[0.1,0.145,3.3,20]} /><meshStandardMaterial color="#1a1a26" emissive="#d4af7a" emissiveIntensity={0.28} metalness={0.97} roughness={0.03} /></mesh>
      <mesh position={[4.45,-4.45,-0.22]} rotation={[0,0,Math.PI/4]}><cylinderGeometry args={[0.135,0.105,1.5,20]} /><meshStandardMaterial color="#0e0800" metalness={0.25} roughness={0.75} /></mesh>
      {([-0.45,0,0.45] as number[]).map((o,i) => (
        <mesh key={i} position={[4.45+o*0.72,-4.45-o*0.72,-0.22]} rotation={[0,0,Math.PI/4]}>
          <torusGeometry args={[0.14,0.024,12,36]} />
          <meshStandardMaterial color="#d4af7a" emissive="#d4af7a" emissiveIntensity={1.5} metalness={0.9} roughness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

// ── Orbiting documents ────────────────────────────────────────────────────────
function FloatingDoc({ x, y, z, phase, colorIndex }: { x:number;y:number;z:number;phase:number;colorIndex:number }) {
  const ref = useRef<THREE.Group>(null);
  const palette = ["#3b82f6","#7c3aed","#d4af7a","#10b981","#f43f5e"];
  const col = palette[colorIndex % palette.length] ?? "#3b82f6";
  useFrame((s) => {
    if (!ref.current) return;
    const t = s.clock.getElapsedTime();
    ref.current.position.y = y + Math.sin(t*0.28+phase)*0.22;
    ref.current.rotation.y = Math.sin(t*0.14+phase)*0.15;
  });
  return (
    <group ref={ref} position={[x,y,z]} rotation={[0.1,0,0.08]}>
      <mesh><planeGeometry args={[0.85,1.12]} /><meshStandardMaterial color="#07081a" emissive={col} emissiveIntensity={0.14} transparent opacity={0.72} side={THREE.DoubleSide} /></mesh>
      {[0.38,0.24,0.10,-0.04,-0.18,-0.32].map((ly,li) => (
        <mesh key={li} position={[0,ly,0.004]}>
          <planeGeometry args={[0.58-(li%3)*0.08,li===0?0.06:0.018]} />
          <meshStandardMaterial color={col} emissive={col} emissiveIntensity={li===0?1.2:0.5} transparent opacity={li===0?0.85:0.28} />
        </mesh>
      ))}
    </group>
  );
}

function OrbitingDocs() {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => { if (ref.current) ref.current.rotation.y += 0.0004; });
  const docs: [number,number,number,number][] = [[5.2,1.5,0.8,0],[-5.0,2.5,-0.5,1.2],[1.8,-5.5,1.0,2.5],[-2.5,5.2,-0.8,3.8],[5.8,-2.2,0.3,5.2]];
  return <group ref={ref}>{docs.map(([x,y,z,p],i) => <FloatingDoc key={i} x={x} y={y} z={z} phase={p} colorIndex={i} />)}</group>;
}

// ── Justice scales ────────────────────────────────────────────────────────────
function JusticeScales() {
  const ref = useRef<THREE.Group>(null);
  const lpRef = useRef<THREE.Mesh>(null);
  const rpRef = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    const t = s.clock.getElapsedTime();
    if (!ref.current) return;
    ref.current.position.y = -5.2 + Math.sin(t*0.22)*0.18;
    ref.current.rotation.y += 0.001;
    const sw = Math.sin(t*0.38)*0.14;
    if (lpRef.current) lpRef.current.position.y = -0.9+sw;
    if (rpRef.current) rpRef.current.position.y = -0.9-sw;
  });
  const gm = { color:"#d4af7a",emissive:"#d4af7a",emissiveIntensity:1.4,metalness:0.96,roughness:0.04 } as const;
  return (
    <group ref={ref} position={[-6.5,-5.2,-1.2]} scale={0.85}>
      <mesh position={[0,1.2,0]}><sphereGeometry args={[0.09,16,16]} /><meshStandardMaterial {...gm} emissiveIntensity={2.0} /></mesh>
      <mesh><cylinderGeometry args={[0.022,0.022,2.4,10]} /><meshStandardMaterial {...gm} /></mesh>
      <mesh position={[0,0.75,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[0.016,0.016,2.0,10]} /><meshStandardMaterial {...gm} /></mesh>
      <mesh position={[-1.0,-0.05,0]}><cylinderGeometry args={[0.01,0.01,0.9,8]} /><meshStandardMaterial {...gm} emissiveIntensity={0.7} /></mesh>
      <mesh position={[1.0,-0.05,0]}><cylinderGeometry args={[0.01,0.01,0.9,8]} /><meshStandardMaterial {...gm} emissiveIntensity={0.7} /></mesh>
      <mesh ref={lpRef} position={[-1.0,-0.9,0]}><cylinderGeometry args={[0.34,0.34,0.035,40]} /><meshStandardMaterial {...gm} emissiveIntensity={1.8} /></mesh>
      <mesh ref={rpRef} position={[1.0,-0.9,0]}><cylinderGeometry args={[0.34,0.34,0.035,40]} /><meshStandardMaterial {...gm} emissiveIntensity={1.8} /></mesh>
      <mesh position={[0,-1.2,0]}><cylinderGeometry args={[0.2,0.25,0.1,32]} /><meshStandardMaterial {...gm} /></mesh>
    </group>
  );
}

// ── Background particles ──────────────────────────────────────────────────────
function Particles() {
  const count = 1800;
  const pos = useMemo(() => {
    const arr = new Float32Array(count*3);
    for (let i=0;i<count;i++) {
      const r=7+Math.random()*16, t=Math.random()*Math.PI*2, p=Math.acos(2*Math.random()-1);
      arr[i*3]=r*Math.sin(p)*Math.cos(t); arr[i*3+1]=r*Math.sin(p)*Math.sin(t); arr[i*3+2]=r*Math.cos(p);
    }
    return arr;
  }, []);
  const ref = useRef<THREE.Points>(null);
  useFrame((s) => { if (ref.current) ref.current.rotation.y = s.clock.getElapsedTime()*0.016; });
  return <points ref={ref}><bufferGeometry><bufferAttribute attach="attributes-position" args={[pos,3]} /></bufferGeometry><pointsMaterial color="#d4af7a" size={0.02} transparent opacity={0.3} sizeAttenuation /></points>;
}

// ── Scene root (mouse parallax) ───────────────────────────────────────────────
function SceneRoot() {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, pointer.x*0.06, 0.022);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, pointer.y*-0.04, 0.022);
  });
  return <group ref={groupRef}><HoloGlobe /><GlassLens /><OrbitingDocs /><JusticeScales /><Particles /></group>;
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position:[0,0,13], fov:44 }}
      gl={{ antialias:true, alpha:true, powerPreference:"high-performance", toneMapping:THREE.ACESFilmicToneMapping, toneMappingExposure:1.3 }}
      dpr={[1,1.5]}
    >
      <ambientLight intensity={0.05} />
      <pointLight position={[0,8,8]}    intensity={22} color="#d4af7a" />
      <pointLight position={[-8,-5,6]}  intensity={9}  color="#3b82f6" />
      <pointLight position={[8,-3,4]}   intensity={6}  color="#7c3aed" />
      <pointLight position={[0,-12,6]}  intensity={7}  color="#d4af7a" />
      <pointLight position={[-4,4,6]}   intensity={10} color="#4488ff" />
      <Stars radius={90} depth={90} count={3500} factor={5} saturation={0} fade speed={0.08} />
      <SceneRoot />
    </Canvas>
  );
}
