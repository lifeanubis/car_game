import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  useKeyboardControls,
  KeyboardControls,
  useTexture,
  useGLTF,
} from '@react-three/drei';
import { Physics, useSphere } from '@react-three/cannon';
import gsap from 'gsap';
// import './ App.css';
import { useRef, useEffect, useState } from 'react';

function Vehicle({ vehicleRotation }) {
  const { scene } = useGLTF('/rubicon/scene.gltf');

  return (
    <primitive
      object={scene}
      position={[vehicleRotation * 20 + 0.15, -3.05, 5.8]}
      scale={[40, 40, 40]}
      rotation={[0, Math.PI, vehicleRotation]}
    />
  );
}

// obsticles

function Obsticles({}) {
  const [ref, api] = useSphere(() => ({
    mass: 10,
    args: [2],
    position: [5, -1.5, -10],
    linearDamping: 0.1,
    angularDamping: 0.1,
  }));

  useEffect(() => {
    const unsubscribe = api.position.subscribe((position) => {
      console.log('Obsticles (Blue) Position:', position);
      if (position[0] < -10) {
        // Reset position to the right side of the scene
        api.position.set(5, -1.5, -10);
        // api.velocity.set(0, 0, 0); // Reset velocity
      }
    });
    return unsubscribe;
  }, [api]);

  useFrame(() => {
    // Apply velocity to move obstacle towards the right
    api.velocity.set(-5, 0, 0);
    api.rotation.set(-10, 0, 0);
    api.angularVelocity.set(50, 0, 10); // Add some rotation to the obstacle
  });

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <sphereGeometry args={[1, 32, 32]} />
      <meshPhongMaterial wireframe color={'blue'} />
    </mesh>
  );
}

function ObsticlesTwo({}) {
  const [ref, api] = useSphere(() => ({
    mass: 1,
    args: [1],
    position: [-5, -3, -10],
    linearDamping: 0.1,
    angularDamping: 0.1,
  }));

  useEffect(() => {
    // const unsubscribe = api.position.subscribe((position) => {
    //   console.log('ObsticlesTwo (Red) Position:', position);
    // });
    // return unsubscribe;
  }, [api]);

  useFrame(() => {
    // Apply velocity to move obstacle towards the left
    api.velocity.set(1, 0, 0);
  });

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <sphereGeometry args={[2, 32, 32]} />
      <meshPhongMaterial wireframe color={'red'} />
    </mesh>
  );
}

// obsticles

function CarScene() {
  const wallMeshRef = useRef();
  const [vehicleRotation, setVehicleRotation] = useState(0);

  return (
    <KeyboardControls
      map={[
        { name: 'ArrowLeft', keys: ['ArrowLeft'] },
        { name: 'ArrowRight', keys: ['ArrowRight'] },
        { name: 'ArrowUp', keys: ['ArrowUp'] },
        { name: 'ArrowDown', keys: ['ArrowDown'] },
      ]}
    >
      <Physics gravity={[0, 0, 0]}>
        <ambientLight intensity={1.5} />
        <Obsticles />
        <ObsticlesTwo />
        <OrbitControls />
        {/* <Vehicle vehicleRotation={vehicleRotation} /> */}
      </Physics>
    </KeyboardControls>
  );
}

export default CarScene;
//
