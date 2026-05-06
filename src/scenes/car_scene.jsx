import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Physics, useSphere } from '@react-three/cannon';

import {
  OrbitControls,
  useKeyboardControls,
  KeyboardControls,
  useTexture,
  useGLTF,
  PositionalAudio,
} from '@react-three/drei';
import gsap from 'gsap';
// import './ App.css';
import { useRef, useEffect, useState } from 'react';
import { sub } from 'three/tsl';
import { CarStartSound, ClickSound, Speaker } from './soundDemo_scene';
import {
  ObsticlesBouncing,
  ObsticlesHaha,
  ObsticlesTruck,
} from './obsticles_scene';
import { useDispatch, useSelector } from 'react-redux';
import Controlls from './controlls';

// import * as THREE from 'three';

function Vehicle({ vehicleRotation = 0 }) {
  const { scene } = useGLTF('/rubicon/scene.gltf');
  const { camera } = useThree();

  const sound = useRef();
  const vehicleXPosition = vehicleRotation * 50 + 0.15;

  camera.position.set(vehicleXPosition, -2.62, 6);

  // function CarStartSound({ vehicleStartSound, setVehicleStartSound }) {
  //   //
  //   return (
  //     <mesh position={[0, 0, 0]}>
  //       {/* <boxGeometry />
  //     <meshStandardMaterial color="hotpink" /> */}
  //     </mesh>
  //   );
  // }
  return (
    <>
      <primitive
        onClick={() => sound.current.play()}
        object={scene}
        position={[vehicleXPosition, -3.05, 5.8]}
        scale={[40, 40, 40]}
        rotation={[0, Math.PI, vehicleRotation]}
      />
      <PositionalAudio
        loop={false}
        ref={sound}
        url="/carstart.mp3"
        setVolume={() => 0.9}
        distance={50}
      />
    </>
  );
}

// obsticles

function Obsticles({}) {
  const sound = useRef();
  const lastHitTime = useRef(0);

  const [ref, api] = useSphere(() => ({
    mass: 0.1,
    args: [0.2],
    position: [0, -3, -15],
    linearDamping: 0.01,
    angularDamping: 0.01,
    onCollide: () => {
      const now = Date.now();

      if (now - lastHitTime.current < 500) {
        return;
      }

      lastHitTime.current = now;
      sound.current?.play();
    },
  }));

  useEffect(() => {
    const unsubscribe = api.position.subscribe((position) => {
      // api.collisionResponse = true; // Enable collision response for the obst
      if (position[2] > 15) {
        api.position.set(0, -3, -15);
      }
    });
    return unsubscribe;
  }, [api]);

  useFrame(() => {
    // Apply constant forward velocity
    api.velocity.set(0, 0, 15);
  });

  return (
    <>
      <mesh
        ref={ref}
        // castShadow receiveShadow
      >
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshPhongMaterial color={'blue'} />
      </mesh>
      <PositionalAudio ref={sound} url="/haha.mp3" loop={false} distance={50} />
    </>
  );
}

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
  const vehicleSpeed = 0.1;
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

  const { isGameStarted } = useSelector((state) => state.game);
  const dispatch = useDispatch();

  console.log(isGameStarted);

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
        {/* <ClickSound />
      <Speaker /> */}
        <CarStartSound
          vehicleStartSound={vehicleStartSound}
          setVehicleStartSound={setVehicleStartSound}
        />
        <Physics gravity={[0, 0, 0]}>
          <ambientLight intensity={1.5} />
          {/* <ObsticlesHaha />
        <ObsticlesTruck />
        <ObsticlesBouncing /> */}

          <directionalLight position={[5, 10, 5]} intensity={1.5} />
          <pointLight position={[0, 5, 10]} intensity={1} />
          {/* <Vehicle
          vehicleStartSound={vehicleStartSound}
          setVehicleStartSound={setVehicleStartSound}
          vehicleRotation={vehicleRotation}
        /> */}
          <VehicleOuter vehicleRotation={vehicleRotation} />

          {/* <OrbitControls /> */}

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
