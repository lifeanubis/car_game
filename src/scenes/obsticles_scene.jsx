import { useFrame } from '@react-three/fiber';
import { useSphere } from '@react-three/cannon';

import { PositionalAudio, useKeyboardControls } from '@react-three/drei';
// import './ App.css';
import { useRef, useEffect, useState } from 'react';

export function ObsticlesHaha({}) {
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
      const randomNumber = Math.floor(Math.random() * 11) - 5;
      // api.collisionResponse = true; // Enable collision response for the obst

      if (position[2] > 15) {
        api.position.set(randomNumber, -3, -15);
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
      <mesh ref={ref} castShadow receiveShadow>
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

  const [ref, api] = useSphere(() => ({
    mass: 0.1,
    args: [0.2],
    position: [5, -3, -15],
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
      const randomNumber = Math.floor(Math.random() * 11) - 5;
      // api.collisionResponse = true; // Enable collision response for the obst
      if (position[2] > 15) {
        api.position.set(randomNumber, -3, -15);
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
      <mesh ref={ref} castShadow receiveShadow>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshPhongMaterial color={'blue'} />
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

  const [ref, api] = useSphere(() => ({
    mass: 0.1,
    args: [0.4],
    position: [5, -2.5, -15],
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
      const randomNumber = Math.floor(Math.random() * 11) - 5;
      // api.collisionResponse = true; // Enable collision response for the obst
      if (position[2] > 15) {
        api.position.set(randomNumber, -2.5, -15);
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
      <mesh ref={ref} castShadow receiveShadow>
        <torusGeometry args={[1, 0.52, 32]} />
        <meshPhongMaterial color={'black'} />
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
