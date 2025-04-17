
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Torus } from '@react-three/drei';
import * as THREE from 'three';

const Circle3D = () => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = THREE.MathUtils.lerp(
        ref.current.rotation.x,
        Math.PI / 2,
        0.1
      );
      ref.current.rotation.y = THREE.MathUtils.lerp(
        ref.current.rotation.y,
        state.clock.elapsedTime * 0.5,
        0.1
      );
    }
  });

  return (
    <Torus
      ref={ref}
      args={[0.3, 0.1, 16, 32]}
      position={[0, 0, 0]}
    >
      <meshStandardMaterial color="#FF453A" />
    </Torus>
  );
};

export default Circle3D;
