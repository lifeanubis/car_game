import { useFrame } from '@react-three/fiber';
import { useSphere } from '@react-three/cannon';

import {
  CameraShake,
  PositionalAudio,
  useKeyboardControls,
  useTexture,
} from '@react-three/drei';
// import './ App.css';
import { useRef, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { loseLife, startAudio } from '../redux/features/gameSlice';

export function ObsticlesHaha({}) {
  const sound = useRef();
  const lastHitTime = useRef(0);
  const { isGameStarted, audio, lives } = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();

  // useEffect(() => {
  //   console.log(lives, 'libes');
  //   console.log(audio, 'libes');
  // }, [lives]);

  const [ref, api] = useSphere(() => ({
    mass: 0.1,
    args: [0.2],
    position: [0, -3, -30],
    linearDamping: 0.01,
    angularDamping: 0.01,
    onCollide: () => {
      const now = Date.now();
      dispatch(loseLife());

      if (now - lastHitTime.current < 500 || lives <= 0) {
        dispatch(startAudio(false));
        return;
      }

      lastHitTime.current = now;
      if (lives <= 0) {
        if (sound.current) {
          sound.current.stop?.(); // Explicitly stop the sound
          sound.current.isPlaying = false; // Ensure the playing state is reset
        }
        return;
      }

      if (audio) {
        sound.current?.play();
      }
    },
  }));

  useEffect(() => {
    const unsubscribe = api.position.subscribe((position) => {
      const randomNumber = Math.floor(Math.random() * 11) - 5;
      // api.collisionResponse = true; // Enable collision response for the obst

      if (position[2] > 15) {
        api.position.set(randomNumber, -3, -30);
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
      <mesh ref={ref}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshPhongMaterial color={'blue'} />
      </mesh>
      <PositionalAudio ref={sound} url="/haha.mp3" loop={false} distance={50} />
    </>
  );
}

export function ObsticlesTruck({}) {
  const sound = useRef();
  const lastHitTime = useRef(0);
  const { isGameStarted, audio, lives } = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();

  const [ref, api] = useSphere(() => ({
    mass: 0.1,
    args: [0.2],
    position: [0, -3, -15],
    rotation: [0.5, 0, 0],

    linearDamping: 0.01,
    angularDamping: 0.01,
    onCollide: () => {
      const now = Date.now();
      dispatch(loseLife());

      if (now - lastHitTime.current < 500 || lives <= 0) {
        dispatch(startAudio(false));

        return;
      }

      lastHitTime.current = now;
      if (lives <= 0) {
        if (sound.current) {
          sound.current.stop?.(); // Explicitly stop the sound
          sound.current.isPlaying = false; // Ensure the playing state is reset
        }
        return;
      }

      if (audio) {
        sound.current?.play();
      }
    },
  }));

  useEffect(() => {
    const unsubscribe = api.position.subscribe((position) => {
      const randomNumber = Math.floor(Math.random() * 11) - 5;
      // api.collisionResponse = true; // Enable collision response for the obst
      if (position[2] > 15) {
        api.position.set(randomNumber, -3, -30);
      }
    });
    return unsubscribe;
  }, [api]);

  useEffect(() => {
    const unsubscriber = api.rotation.subscribe((rotation) => {
      api.rotation.set((rotation[0] += 0.1), rotation[1], (rotation[2] += 0.1));
    });
    return unsubscriber;
  }, [api]);

  useFrame(() => {
    // Apply constant forward velocity
    api.velocity.set(0, 0, 15);
  });

  return (
    <>
      <mesh ref={ref}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          // map={textureRoad}
          // displacementMap={textureRoad}
          displacementScale={0.2}
          side={2}
          color={'red'}
          metalness={0.7}
        />
      </mesh>
      <PositionalAudio
        ref={sound}
        url="/truckHorn.mp3"
        loop={false}
        distance={50}
      />
    </>
  );
}

export function ObsticlesBouncing({}) {
  const sound = useRef();
  const lastHitTime = useRef(0);
  const bounceAmplitude = 2;
  const bounceSpeed = 2.5;
  const [subscribed, getKeys] = useKeyboardControls();
  const { isGameStarted, audio, lives } = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();

  const [ref, api] = useSphere(() => ({
    mass: 0.1,
    args: [0.4],
    position: [5, -2.5, -30],
    linearDamping: 0.01,
    angularDamping: 0.01,
    onCollide: () => {
      const now = Date.now();
      dispatch(loseLife());

      if (now - lastHitTime.current < 500 || lives <= 0) {
        return;
      }
      lastHitTime.current = now;
      if (lives <= 0) {
        if (sound.current) {
          sound.current.stop?.(); // Explicitly stop the sound
          sound.current.isPlaying = false; // Ensure the playing state is reset
        }
        return;
      }

      if (audio) {
        sound.current?.play();
      }
    },
  }));

  useEffect(() => {
    const unsubscribe = api.position.subscribe((position) => {
      const randomNumber = Math.floor(Math.random() * 11) - 5;
      // api.collisionResponse = true; // Enable collision response for the obst
      if (position[2] > 15) {
        api.position.set(randomNumber, -2.5, -30);
      }
    });
    return unsubscribe;
  }, [api]);

  useFrame(({ clock }) => {
    // Apply constant forward velocity
    const { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } = getKeys();

    const yVelocity =
      Math.sin(clock.getElapsedTime() * bounceSpeed) * bounceAmplitude;
    const xVelocity = Math.sin(clock.getElapsedTime()) * 2.2; // Add some horizontal movement

    if (ArrowUp) {
      api.velocity.set(xVelocity, yVelocity, 12);
    } else api.velocity.set(xVelocity, yVelocity, 3);
  });

  return (
    <>
      <mesh ref={ref}>
        <torusGeometry args={[2, 0.52, 32]} />
        <meshPhongMaterial color={'black'} />
      </mesh>
      <PositionalAudio
        ref={sound}
        url="/jaldiHatto.mp3"
        loop={false}
        distance={50}
      />
    </>
  );
}
