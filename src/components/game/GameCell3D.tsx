
import { Canvas } from '@react-three/fiber';
import Cross3D from './Cross3D';
import Circle3D from './Circle3D';

interface GameCell3DProps {
  symbol: 'X' | 'O' | null;
}

const GameCell3D = ({ symbol }: GameCell3DProps) => {
  if (!symbol) return null;

  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas camera={{ position: [0, 0, 2.5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        {symbol === 'X' ? <Cross3D /> : <Circle3D />}
      </Canvas>
    </div>
  );
};

export default GameCell3D;
