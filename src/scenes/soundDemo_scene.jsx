import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

import { PositionalAudio } from '@react-three/drei';

export default function Sound() {
  const { camera } = useThree();
  const soundRef = useRef();

  useEffect(() => {
    const listener = new THREE.AudioListener();
    camera.add(listener);

    const sound = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();

    audioLoader.load('/sounds/music.mp3', (buffer) => {
      sound.setBuffer(buffer);
      sound.setLoop(true);
      sound.setVolume(0.5);
      sound.play();
    });

    soundRef.current = sound;

    return () => {
      sound.stop();
      camera.remove(listener);
    };
  }, [camera]);

  return null;
}

export function Speaker() {
  const sound = useRef();

  return (
    <mesh onClick={() => sound.current.play()} position={[0, -2, 0]}>
      <boxGeometry />
      <meshStandardMaterial color="orange" />

      <PositionalAudio ref={sound} url="/haha.mp3" distance={5} loop={false} />
    </mesh>
  );
}

export function ClickSound() {
  const sound = useRef();
  // onClick={() => sound.current.play()}
  return (
    <mesh onClick={() => sound.current.play()} position={[0, 0, 0]}>
      <boxGeometry />
      <meshStandardMaterial color="hotpink" />

      <PositionalAudio loop={false} ref={sound} url="/jaldiHatto.mp3" />
    </mesh>
  );
}

export function CarStartSound({ vehicleStartSound, setVehicleStartSound }) {
  const sound = useRef();
  //
  return (
    <mesh onClick={() => sound.current.play()} position={[0, 0, 0]}>
      {/* <boxGeometry />
      <meshStandardMaterial color="hotpink" /> */}

      <PositionalAudio
        // autoplay={true}
        loop={false}
        ref={sound}
        url="/carstart.mp3"
      />
    </mesh>
  );
}
