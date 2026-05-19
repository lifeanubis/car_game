import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Physics, useSphere } from '@react-three/cannon';

import {
  OrbitControls,
  useKeyboardControls,
  KeyboardControls,
  useTexture,
  useGLTF,
  PositionalAudio,
  CameraShake,
  Loader,
} from '@react-three/drei';
import gsap from 'gsap';
// import './ App.css';
import { useRef, useEffect, useState } from 'react';

import {
  ObsticlesBouncing,
  ObsticlesHaha,
  ObsticlesTruck,
} from './obsticles_scene';
import { useDispatch, useSelector } from 'react-redux';
import Controlls from './controlls';
import sadAudio from '../../public/sad.mp3';
import carRunningAudio from '../../public/carRunning.mp3';

// import * as THREE from 'three';

function Vehicle({ vehicleRotation = 0 }) {
  const { scene, nodes, materials } = useGLTF('/rubicon/scene.gltf');
  const { camera } = useThree();

  const vehicleXPosition = vehicleRotation * 50 + 0.15;

  camera.position.set(vehicleXPosition, -2.62, 6);

  return (
    <>
      <primitive
        object={scene}
        position={[vehicleXPosition, -3.05, 5.8]}
        scale={[40, 40, 40]}
        rotation={[0, Math.PI, vehicleRotation]}
      />
      {/* <PositionalAudio
        loop={false}
        ref={sound}
        url="/carstart.mp3"
        setVolume={() => 0.9}
        distance={50}
      /> */}
    </>
  );
}

// obsticles

function VehicleOuter({ vehicleRotation }) {
  const vehicleXPosition = vehicleRotation * 50 + 0.15;

  const [ref, api] = useSphere(() => ({
    mass: 100,
    args: [2],
    position: [vehicleXPosition, -3, 5],
    linearDamping: 0.5,
    angularDamping: 0.5,
    restitution: 0.8,
  }));

  useFrame(() => {
    api.position.set(vehicleXPosition, -3, 6);
  });

  return (
    <mesh
      ref={ref}
      // visible={true}
    >
      <sphereGeometry args={[1, 32, 32]} />
      <meshPhongMaterial
      // wireframe
      // color={'green'}
      />
    </mesh>
  );
}

// obsticles

function RoadSegment({
  initialZ,
  textureRoad,
  myMesh,
  setVehicleRotation,
  speedUp,
  setSpeedUp,
}) {
  const rotationFactor = 0.1;
  const vehicleSpeed = 1;
  const rotationState = useRef({ y: 0 });
  const prevKeysRef = useRef({ ArrowLeft: false, ArrowRight: false });

  const [subscribed, getKeys] = useKeyboardControls();

  useFrame(() => {
    // Update camera position to follow vehicle

    const { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } = getKeys();
    if (myMesh) {
      myMesh.current.position.z += vehicleSpeed;
      // myMesh.current.rotation.y = rotationSpeedR;

      if (myMesh.current.position.z > 30) {
        myMesh.current.position.z = -50; // Reset position to create a looping effect
      }
      if (ArrowLeft && rotationState.current.y > -0.05) {
        gsap.to(rotationState.current, {
          y: rotationState.current.y - rotationFactor,
          duration: 0.2,
          overwrite: 'auto',
          onUpdate: () => {
            myMesh.current.rotation.y = rotationState.current.y;
            setVehicleRotation(rotationState.current.y);
          },
        });
      }
      if (ArrowRight && rotationState.current.y < 0.05) {
        gsap.to(rotationState.current, {
          y: rotationState.current.y + rotationFactor,
          duration: 0.2,
          overwrite: 'auto',
          onUpdate: () => {
            myMesh.current.rotation.y = rotationState.current.y;
            setVehicleRotation(rotationState.current.y);
          },
        });
      }

      // Reset tilt when arrow keys are released
      if (
        (prevKeysRef.current.ArrowLeft || prevKeysRef.current.ArrowRight) &&
        !ArrowLeft &&
        !ArrowRight
      ) {
        gsap.to(rotationState.current, {
          y: 0,
          duration: 0.2,
          overwrite: 'auto',
          onUpdate: () => {
            myMesh.current.rotation.y = rotationState.current.y;
            setVehicleRotation(rotationState.current.y);
          },
        });
      }

      prevKeysRef.current.ArrowLeft = ArrowLeft;
      prevKeysRef.current.ArrowRight = ArrowRight;

      if (ArrowUp) {
        myMesh.current.position.z += 7.0;
      }
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

function Roads({ setVehicleRotation, vehicleRotation }) {
  const roadMeshOne = useRef();
  const roadMeshTwo = useRef();

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
        setVehicleRotation={setVehicleRotation}
        vehicleRotation={vehicleRotation}
      />
      <RoadSegment
        initialZ={-50}
        textureRoad={textureRoad}
        myMesh={roadMeshTwo}
        setVehicleRotation={setVehicleRotation}
        vehicleRotation={vehicleRotation}
      />
      {/* <RoadSegment initialZ={-50} textureRoad={textureRoad} /> */}
    </>
  );
}

function CarScene() {
  const [vehicleRotation, setVehicleRotation] = useState(0);

  const [vehicleStartSound, setVehicleStartSound] = useState(false);
  const [speedUp, setSpeedUp] = useState(false);

  const { isGameStarted, audio, lives, gyro } = useSelector(
    (state) => state.game,
  );
  const dispatch = useDispatch();

  const sadAudioPlay = useRef(new Audio(sadAudio));
  const audioCarRunning = useRef(new Audio(carRunningAudio));

  useEffect(() => {
    if (lives > 0 && audio) {
      audioCarRunning.current.loop = true;
      audioCarRunning.current.play();
    } else if (lives <= 0) {
      audioCarRunning.current.pause();
      audioCarRunning.current.currentTime = 0;
      sadAudioPlay.current.play();
    }
  }, [audio, lives]);

  useEffect(() => {
    const handleOrientation = (event) => {
      const { gamma } = event; // Gamma represents left-to-right tilt
      const rotationFactor = 0.05; // Adjust sensitivity
      setVehicleRotation(gamma * rotationFactor);
    };

    if (gyro) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [gyro]);

  return (
    <>
      <KeyboardControls
        map={[
          { name: 'ArrowLeft', keys: ['ArrowLeft'] },
          { name: 'ArrowRight', keys: ['ArrowRight'] },
          { name: 'ArrowUp', keys: ['ArrowUp'] },
          { name: 'ArrowDown', keys: ['ArrowDown'] },
        ]}
      >
        <Physics gravity={[0, 0, 0]}>
          {lives > 0 && (
            <>
              <ObsticlesHaha />
              <ObsticlesTruck />
              <ObsticlesBouncing />
            </>
          )}
          <Vehicle
            vehicleStartSound={vehicleStartSound}
            setVehicleStartSound={setVehicleStartSound}
            vehicleRotation={vehicleRotation}
          />
          <VehicleOuter vehicleRotation={vehicleRotation} />
          <Roads
            setVehicleRotation={setVehicleRotation}
            vehicleRotation={vehicleRotation}
          />
        </Physics>
      </KeyboardControls>
    </>
  );
}

export default CarScene;
