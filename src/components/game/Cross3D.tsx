
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import * as THREE from 'three';

const Cross3D = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        0,
        0.1
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        state.clock.elapsedTime * 0.5,
        0.1
      );
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.8, 0.2, 0.2]} />
        <meshStandardMaterial attach="material" color="#0A84FF" />
        <Edges />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.8, 0.2, 0.2]} />
        <meshStandardMaterial attach="material" color="#0A84FF" />
        <Edges />
      </mesh>
    </group>
  );
};

export default Cross3D;
