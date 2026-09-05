'use client';

import { Canvas } from '@react-three/fiber';
import { Stars, Cloud, Float } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { useScrollStore } from '@/store';

function ParticleField({ count = 15000 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const scrollY = useScrollStore((state) => state.scrollY);
  const scrollVelocity = useScrollStore((state) => state.scrollVelocity);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const color1 = new THREE.Color('#d4af37');
    const color2 = new THREE.Color('#14b8a6');
    const color3 = new THREE.Color('#1e3a5f');

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 100;
      positions[i3 + 1] = (Math.random() - 0.5) * 100;
      positions[i3 + 2] = (Math.random() - 0.5) * 100;

      const mixedColor = color1
        .clone()
        .lerp(color2, Math.random())
        .lerp(color3, Math.random());

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;

      sizes[i] = Math.random() * 0.5;
    }

    return { positions, colors, sizes };
  }, [count]);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          array={particles.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particles.sizes.length}
          array={particles.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

function FloatingGeometry() {
  const meshRef = useRef<THREE.Mesh>(null);
  const scrollY = useScrollStore((state) => state.scrollY);

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={[15, 10, -20]}>
        <icosahedronGeometry args={[2, 0]} />
        <meshStandardMaterial
          color="#d4af37"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>
    </Float>
  );
}

function NebulaClouds() {
  return (
    <group position={[0, 0, -50]}>
      <Cloud
        opacity={0.3}
        speed={0.4}
        width={50}
        height={30}
        depth={10}
        segments={20}
        color="#1e3a5f"
      />
      <Cloud
        opacity={0.2}
        speed={0.3}
        width={40}
        height={25}
        depth={8}
        segments={20}
        color="#14b8a6"
        position={[-20, 10, 5]}
      />
    </group>
  );
}

export default function HeroScene() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 30], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#d4af37" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#14b8a6" />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ParticleField count={8000} />
        <FloatingGeometry />
        <NebulaClouds />
      </Canvas>
    </div>
  );
}
