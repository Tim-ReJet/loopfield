"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useIntensity } from "@/lib/store";

function NebulaPoints({ density }: { density: number }) {
  const ref = useRef<THREE.Points>(null);
  const { positions, colors } = useMemo(() => {
    const count = density;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 18;
      positions[i3 + 1] = (Math.random() - 0.5) * 10;
      positions[i3 + 2] = (Math.random() - 0.5) * 12;
      const t = Math.random();
      colors[i3] = t > 0.5 ? 0.37 : 1.0;
      colors[i3 + 1] = t > 0.5 ? 0.78 : 0.61;
      colors[i3 + 2] = t > 0.5 ? 0.85 : 0.48;
    }
    return { positions, colors };
  }, [density]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.elapsedTime * 0.02;
    ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.05) * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function ArcLinks({ count }: { count: number }) {
  const group = useRef<THREE.Group>(null);
  const curves = useMemo(() => {
    return Array.from({ length: count }, () => {
      const a = new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 6,
      );
      const b = new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 6,
      );
      const mid = a.clone().lerp(b, 0.5).add(new THREE.Vector3(0, 1.2, 0));
      return new THREE.QuadraticBezierCurve3(a, mid, b);
    });
  }, [count]);

  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.y = clock.elapsedTime * 0.015;
  });

  return (
    <group ref={group}>
      {curves.map((curve, i) => (
        <mesh key={i}>
          <tubeGeometry args={[curve, 32, 0.008, 6, false]} />
          <meshBasicMaterial
            color={i % 2 ? "#5ec8d8" : "#ff9b7a"}
            transparent
            opacity={0.35}
          />
        </mesh>
      ))}
    </group>
  );
}

export function ShaderHero({ className }: { className?: string }) {
  const intensity = useIntensity((s) => s.intensity);
  if (intensity === "reduced") {
    return (
      <div
        className={className}
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, #1a3040 0%, #07090f 55%, #050608 100%)",
        }}
      />
    );
  }
  const density = intensity === "calm" ? 800 : 2200;
  const arcs = intensity === "calm" ? 6 : 16;

  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, intensity === "full" ? 2 : 1.25]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#07090f"]} />
        <fog attach="fog" args={["#07090f", 6, 16]} />
        <NebulaPoints density={density} />
        <ArcLinks count={arcs} />
      </Canvas>
    </div>
  );
}
