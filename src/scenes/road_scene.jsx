import { Canvas, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  useKeyboardControls,
  KeyboardControls,
} from '@react-three/drei';
import './App.css';
import { useRef, useEffect } from 'react';

function Cube() {
  const myMesh = useRef();
  const rotationSpeed = 0.1;

  const [subscribed, getKeys] = useKeyboardControls();

  useFrame(() => {
    const { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } = getKeys();

    if (ArrowLeft) {
      myMesh.current.rotation.y += rotationSpeed;
      myMesh.current.position.x += rotationSpeed;
    }
    if (ArrowRight) {
      myMesh.current.rotation.y -= rotationSpeed;
      myMesh.current.position.x -= rotationSpeed;
    }
    if (ArrowUp) {
      myMesh.current.rotation.x -= rotationSpeed;
    }
    if (ArrowDown) {
      myMesh.current.rotation.x += rotationSpeed;
    }
  });

  return (
    <mesh ref={myMesh}>
      <boxGeometry args={[2, 2, 2]} />
      <meshPhongMaterial color="red" />
    </mesh>
  );
}

function App() {
  return (
    <KeyboardControls
      map={[
        { name: 'ArrowLeft', keys: ['ArrowLeft'] },
        { name: 'ArrowRight', keys: ['ArrowRight'] },
        { name: 'ArrowUp', keys: ['ArrowUp'] },
        { name: 'ArrowDown', keys: ['ArrowDown'] },
      ]}
    >
      <div
        style={{
          width: '100vw',
          height: '100vh',
          backgroundImage: 'url(/road.jpg)',
          backgroundSize: '',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Canvas style={{ background: 'transparent' }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <Cube />
          <OrbitControls />
        </Canvas>
      </div>
    </KeyboardControls>
  );
}

export default App;
