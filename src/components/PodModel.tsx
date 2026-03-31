import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

export default function PodModel({ state, onNavigate }: { state: any, onNavigate?: (screen: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  // Map state values to 3D properties
  const seatRotation = -((state.seatAngle - 90) * Math.PI) / 180;
  const deskY = 0.8 + ((state.deskHeight - 60) / 30) * 0.6;
  const deskRotation = (state.deskAngle * Math.PI) / 180;
  const lightIntensity = state.lightBrightness / 100;

  const getLightColor = () => {
    switch (state.activeEnvironment) {
      case 'warm-wood': return '#f9ba82';
      case 'fresh-mint': return '#4ade80';
      case 'deep-star': return '#60a5fa';
      case 'morning-aurora': return '#f472b6';
      default: return '#ffffff';
    }
  };

  return (
    <Canvas camera={{ position: [4, 2, 5], fov: 45 }} className="w-full h-full z-10">
      <ambientLight intensity={lightIntensity * 0.5} />
      <pointLight 
        position={[0, 3, 0]} 
        intensity={lightIntensity * 2} 
        color={getLightColor()} 
      />
      <spotLight position={[0, 5, 0]} angle={0.3} penumbra={1} intensity={1} castShadow />

      <Float speed={2} rotationIntensity={0.05} floatIntensity={0.1}>
        <group position={[0, -1, 0]}>
          {/* Outer Shell - Glass Dome */}
          <mesh 
            position={[0, 1.2, 0]}
            onClick={(e) => { e.stopPropagation(); onNavigate?.('door'); }}
            onPointerOver={(e) => { e.stopPropagation(); setHovered('door'); }}
            onPointerOut={(e) => { e.stopPropagation(); setHovered(null); }}
          >
            <sphereGeometry args={[2.2, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
            <meshPhysicalMaterial 
              color={hovered === 'door' ? "#e0f2fe" : "#ffffff"} 
              emissive={hovered === 'door' ? "#0284c7" : "#000000"}
              emissiveIntensity={0.2}
              transparent 
              opacity={0.15 + (state.privacyLevel / 100) * 0.8} 
              roughness={0.1 + (state.privacyLevel / 100) * 0.9} 
              transmission={0.9 - (state.privacyLevel / 100) * 0.9} 
              thickness={0.5} 
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Base Ring */}
          <mesh position={[0, -0.1, 0]}>
            <cylinderGeometry args={[2.2, 2.4, 0.4, 64]} />
            <meshStandardMaterial color="#18181b" roughness={0.8} metalness={0.5} />
          </mesh>

          {/* Inner Floor */}
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[2.1, 2.1, 0.1, 64]} />
            <meshStandardMaterial color="#27272a" roughness={0.9} />
          </mesh>

          {/* Seat Base */}
          <group
            onClick={(e) => { e.stopPropagation(); onNavigate?.('seat'); }}
            onPointerOver={(e) => { e.stopPropagation(); setHovered('seat'); }}
            onPointerOut={(e) => { e.stopPropagation(); setHovered(null); }}
          >
            <RoundedBox args={[1.2, 0.3, 1.2]} position={[0, 0.4, -0.3]} radius={0.1} smoothness={4}>
              <meshStandardMaterial 
                color="#3f3f46" 
                roughness={0.7} 
                emissive={hovered === 'seat' ? "#ef4444" : "#000000"}
                emissiveIntensity={0.2}
              />
            </RoundedBox>

            {/* Seat Backrest (Animated based on seatAngle) */}
            <group position={[0, 0.55, -0.8]} rotation={[seatRotation, 0, 0]}>
              <RoundedBox args={[1.2, 1.8, 0.2]} position={[0, 0.9, 0]} radius={0.05} smoothness={4}>
                <meshStandardMaterial 
                  color="#3f3f46" 
                  roughness={0.7} 
                  emissive={hovered === 'seat' ? "#ef4444" : "#000000"}
                  emissiveIntensity={0.2}
                />
              </RoundedBox>
              {/* Headrest */}
              <RoundedBox args={[0.8, 0.4, 0.25]} position={[0, 1.8, 0.05]} radius={0.1} smoothness={4}>
                <meshStandardMaterial 
                  color="#27272a" 
                  roughness={0.6} 
                  emissive={hovered === 'seat' ? "#ef4444" : "#000000"}
                  emissiveIntensity={0.2}
                />
              </RoundedBox>
              {/* Glowing Accent */}
              <mesh position={[0, 0.9, 0.11]}>
                <boxGeometry args={[1.2, 0.02, 0.02]} />
                <meshBasicMaterial color="#ef4444" />
              </mesh>
            </group>
          </group>

          {/* Desk (Animated based on deskHeight and deskAngle) */}
          <group 
            position={[0, deskY, 0.8]}
            onClick={(e) => { e.stopPropagation(); onNavigate?.('desk'); }}
            onPointerOver={(e) => { e.stopPropagation(); setHovered('desk'); }}
            onPointerOut={(e) => { e.stopPropagation(); setHovered(null); }}
          >
            <group rotation={[deskRotation, 0, 0]}>
              <RoundedBox args={[1.8, 0.08, 1]} position={[0, 0, 0]} radius={0.02} smoothness={4}>
                <meshStandardMaterial 
                  color={state.deskMaterial === 'walnut' ? '#8B5A2B' : '#18181b'} 
                  roughness={0.4} 
                  metalness={0.2} 
                  emissive={hovered === 'desk' ? "#f59e0b" : "#000000"}
                  emissiveIntensity={0.2}
                />
              </RoundedBox>
              {/* Screen / Hologram emitter on desk */}
              <mesh position={[0, 0.05, -0.3]}>
                <boxGeometry args={[1.4, 0.02, 0.4]} />
                <meshStandardMaterial color="#000000" roughness={0.2} metalness={0.8} />
              </mesh>
            </group>
            {/* Desk Pillar */}
            <mesh position={[0, -0.4, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.8, 16]} />
              <meshStandardMaterial color="#52525b" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        </group>
      </Float>

      <ContactShadows position={[0, -1.5, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
      <Environment preset="city" />
      <OrbitControls 
        enableZoom={true} 
        enablePan={false} 
        minPolarAngle={Math.PI / 4} 
        maxPolarAngle={Math.PI / 2 + 0.1} 
        minDistance={3}
        maxDistance={8}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
}
