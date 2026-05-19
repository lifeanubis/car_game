import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useCallback, useEffect, useRef, useState } from 'react';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function TiltCube({ tilt }) {
  const cubeRef = useRef();

  useFrame(() => {
    if (!cubeRef.current) return;

    cubeRef.current.position.x += (tilt.x - cubeRef.current.position.x) * 0.12;
    cubeRef.current.position.z += (tilt.z - cubeRef.current.position.z) * 0.12;
    cubeRef.current.rotation.x += 0.02;
    cubeRef.current.rotation.y += 0.02;
  });

  return (
    <mesh ref={cubeRef} position={[0, 0.5, 0]} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#ff8a3d" roughness={0.45} metalness={0.15} />
    </mesh>
  );
}

function GroundPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[12, 12]} />
      <meshStandardMaterial color="#2f7d5a" roughness={0.8} />
    </mesh>
  );
}

function CameraRig() {
  const { camera } = useThree();

  useEffect(() => {
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return null;
}

const GyroMotionScene = () => {
  const [tilt, setTilt] = useState({ x: 0, z: 0 });
  const [gyroEnabled, setGyroEnabled] = useState(false);
  const [status, setStatus] = useState('Tap enable gyro on your phone.');
  const hasMotionData = useRef(false);

  const enableGyro = async () => {
    if (!window.isSecureContext) {
      setStatus('Motion sensors need HTTPS, or localhost on the same device.');
    }

    const canRequestOrientationPermission =
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function';
    const canRequestMotionPermission =
      typeof DeviceMotionEvent !== 'undefined' &&
      typeof DeviceMotionEvent.requestPermission === 'function';

    try {
      if (canRequestOrientationPermission) {
        const permissionState =
          await DeviceOrientationEvent.requestPermission();

        if (permissionState !== 'granted') {
          setStatus('Gyro permission was not granted.');
          return;
        }
      }

      if (canRequestMotionPermission) {
        const permissionState = await DeviceMotionEvent.requestPermission();

        if (permissionState !== 'granted') {
          setStatus('Motion permission was not granted.');
          return;
        }
      }

      hasMotionData.current = false;
      setGyroEnabled(true);
      setStatus('Listening for tilt data...');

      setTimeout(() => {
        if (!hasMotionData.current) {
          setStatus('No motion data received. Try HTTPS or another browser.');
        }
      }, 2500);
    } catch (error) {
      console.error(error);
      setStatus('Could not enable gyro permission.');
    }
  };

  const updateTilt = useCallback((x, z) => {
    if (x == null || z == null) return;

    hasMotionData.current = true;
    setStatus('Gyro active.');

    setTilt({
      x: clamp(x, -5, 5),
      z: clamp(z, -5, 5),
    });
  }, []);

  useEffect(() => {
    if (!gyroEnabled) return;

    const handleOrientation = (event) => {
      const orientationType = window.screen.orientation?.type ?? '';
      const leftRightTilt = orientationType.includes('landscape')
        ? event.beta
        : event.gamma;
      const forwardBackTilt = orientationType.includes('landscape')
        ? event.gamma
        : event.beta;

      if (leftRightTilt == null || forwardBackTilt == null) return;

      const direction = orientationType === 'landscape-secondary' ? -1 : 1;

      updateTilt(
        leftRightTilt * direction * 0.12,
        forwardBackTilt * 0.12,
      );
    };

    const handleMotion = (event) => {
      const acceleration = event.accelerationIncludingGravity;

      if (!acceleration) return;

      updateTilt(acceleration.x * 0.8, acceleration.y * 0.8);
    };

    window.addEventListener('deviceorientation', handleOrientation);
    window.addEventListener('devicemotion', handleMotion);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [gyroEnabled, updateTilt]);

  const resetCube = () => {
    setTilt({ x: 0, z: 0 });
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas shadows camera={{ position: [0, 8, 10], fov: 50 }}>
        <CameraRig />
        <color attach="background" args={['#151925']} />
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[4, 8, 5]}
          intensity={2}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <GroundPlane />
        <TiltCube tilt={tilt} />
      </Canvas>

      <div
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          flexWrap: 'wrap',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            padding: '10px 12px',
            borderRadius: 8,
            background: 'rgba(255,255,255,0.9)',
            color: '#111827',
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          {status}
        </div>
        <button
          type="button"
          onClick={gyroEnabled ? resetCube : enableGyro}
          style={{
            padding: '12px 18px',
            border: 0,
            borderRadius: 8,
            background: '#ffffff',
            color: '#111827',
            fontWeight: 700,
            cursor: 'pointer',
            pointerEvents: 'auto',
          }}
        >
          {gyroEnabled ? 'reset cube' : 'enable gyro'}
        </button>
      </div>
    </div>
  );
};

export default GyroMotionScene;
