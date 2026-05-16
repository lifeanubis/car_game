import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  useKeyboardControls,
  KeyboardControls,
  useTexture,
  Stars,
  Clouds,
  Cloud,
  Sparkles,
  CameraShake,
  Loader,
} from '@react-three/drei';
import gsap from 'gsap';
import './App.css';
import { useRef, useEffect, useState, Suspense } from 'react';
import CarScene from './scenes/car_scene';
import StartScene from './scenes/start_scene';

import ColissionScene from './scenes/colission_scene';
import Controlls from './scenes/controlls';
import { useSelector } from 'react-redux';
import { useAppDispatch } from './redux/hooks';
// import { Lilita_One } from ""

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
  const { isGameStarted, lives, score, audio } = useSelector(
    (state) => state.game,
  );

  const [backImage, setBackImage] = useState(true);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setBackImage((currentBackImage) => !currentBackImage);
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  const dispatch = useAppDispatch();

  return (
    <KeyboardControls
      map={[
        { name: 'ArrowLeft', keys: ['ArrowLeft'] },
        { name: 'ArrowRight', keys: ['ArrowRight'] },
        { name: 'ArrowUp', keys: ['ArrowUp'] },
        { name: 'ArrowDown', keys: ['ArrowDown'] },
      ]}
    >
      {isGameStarted && (
        <div
          style={{
            zIndex: 10,
          }}
        >
          <Controlls />
        </div>
      )}
      {!isGameStarted && (
        <div>
          <StartScene />
        </div>
      )}
      {isGameStarted && (
        <div
          style={{
            position: 'relative',
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'url(/roadFull.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              opacity: backImage ? 1 : 0,
              transition: 'opacity 1.2s ease-in-out',
              pointerEvents: 'none',
            }}
          />
          <Canvas
            style={{
              position: 'relative',
              zIndex: 1,
              background: 'transparent',
            }}
          >
            <Stars depth={5} />
            <Sparkles
              scale={[20, 2, 5]}
              color={'#70e5ff'}
              position={[0, 1, 0]}
              size={5}
              speed={0.2}
            />
            <Cloud
              color={'purple'}
              count={1}
              fade={50}
              volume={5}
              opacity={0.3}
            />
            <ambientLight intensity={10} />
            <pointLight position={[0, -1, 0]} intensity={10} />
            <CarScene />
          </Canvas>
        </div>
      )}
    </KeyboardControls>
  );
}

export default App;
