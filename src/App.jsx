import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  useKeyboardControls,
  KeyboardControls,
  useTexture,
} from '@react-three/drei';
import gsap from 'gsap';
import './App.css';
import { useRef, useEffect } from 'react';
import CarScene from './scenes/car_scene';
import ColissionScene from './scenes/colission_scene';

function RoadSegment({ initialZ, textureRoad, myMesh }) {
  const rotationSpeed = 0.1;
  const rotationSpeedR = 5;
  const rotationState = useRef({ y: 0 });

  const [subscribed, getKeys] = useKeyboardControls();

  useFrame(() => {
    const { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } = getKeys();

    if (myMesh) {
      myMesh.current.position.z += rotationSpeed;
      // myMesh.current.rotation.y = rotationSpeedR;

      if (myMesh.current.position.z > 30) {
        myMesh.current.position.z = -50; // Reset position to create a looping effect
      }
      if (ArrowLeft && rotationState.current.y > -0.01) {
        gsap.to(rotationState.current, {
          y: rotationState.current.y - rotationSpeed,
          duration: 0.5,
          overwrite: 'auto',
          onUpdate: () => {
            myMesh.current.rotation.y = rotationState.current.y;
          },
        });
      }
      if (ArrowRight && rotationState.current.y < 0.01) {
        gsap.to(rotationState.current, {
          y: rotationState.current.y + rotationSpeed,
          duration: 0.5,
          overwrite: 'auto',
          onUpdate: () => {
            myMesh.current.rotation.y = rotationState.current.y;
          },
        });
      }
      // if (ArrowUp) {
      //   myMesh.current.rotation.x -= rotationSpeed;
      // }
      // if (ArrowDown) {
      //   myMesh.current.rotation.x += rotationSpeed;
      // }
    }
  });

  return (
    <mesh
      ref={myMesh}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -5, initialZ]}
    >
      <planeGeometry args={[30, 50, 64, 64]} />
      <meshPhongMaterial
        map={textureRoad}
        displacementMap={textureRoad}
        displacementScale={0.2}
        side={2}
      />
    </mesh>
  );
}

function Roads() {
  const roadMeshOne = useRef();
  const roadMeshTwo = useRef();
  const roadMeshThree = useRef();

  const textureRoad = useTexture(
    '/TwoLane/TwoLaneSolidLineRoadPatches02_4K_BaseColor.png',
  );

  // Create 3 road segments stacked together
  return (
    <>
      <RoadSegment
        initialZ={0}
        textureRoad={textureRoad}
        myMesh={roadMeshOne}
      />
      <RoadSegment
        initialZ={-50}
        textureRoad={textureRoad}
        myMesh={roadMeshTwo}
      />
      {/* <RoadSegment initialZ={-50} textureRoad={textureRoad} /> */}
    </>
  );
}

function Wall({ wallMeshRef }) {
  const tiltSpeed = 0.1;
  const texture = useTexture('/roadu.jpg');
  const { camera } = useThree();
  const targetRotation = useRef({ z: 0, x: 0 });

  const [subscribed, getKeys] = useKeyboardControls();

  useFrame(() => {
    const { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } = getKeys();

    if (ArrowLeft && wallMeshRef.current.rotation.z < 0.4) {
      wallMeshRef.current.rotation.z += tiltSpeed;
      targetRotation.current.z = wallMeshRef.current.rotation.z;
    }
    if (ArrowRight && wallMeshRef.current.rotation.z > -0.4) {
      wallMeshRef.current.rotation.z -= tiltSpeed;
      targetRotation.current.z = wallMeshRef.current.rotation.z;
    }
    if (ArrowUp) {
      wallMeshRef.current.rotation.x -= tiltSpeed;
      targetRotation.current.x = wallMeshRef.current.rotation.x;
    }
    if (ArrowDown) {
      wallMeshRef.current.rotation.x += tiltSpeed;
      targetRotation.current.x = wallMeshRef.current.rotation.x;
    }

    // Smoothly interpolate camera rotation toward target
    camera.rotation.z += (targetRotation.current.z - camera.rotation.z) * 0.5;
    camera.rotation.y += (targetRotation.current.x - camera.rotation.x) * 0.5;
  });

  return (
    <mesh ref={wallMeshRef} position={[0, 0, -5]}>
      <planeGeometry args={[20, 6, 1, 1]} />
      <meshPhongMaterial map={texture} side={2} />
    </mesh>
  );
}

function App() {
  const wallMeshRef = useRef();

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
          backgroundImage: 'url(/roadFull.jpg)',
          backgroundSize: '',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Canvas style={{ background: 'transparent' }}>
          <ambientLight intensity={10} />
          <pointLight position={[0, -1, 0]} intensity={10} />
          {/* <Wall wallMeshRef={wallMeshRef} /> */}
          <CarScene />
          {/* <ColissionScene /> */}

          {/* <Roads /> */}
        </Canvas>
      </div>
    </KeyboardControls>
  );
}

export default App;
