import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../redux/hooks';
import { startGame, startAudio, handleGyro } from '../redux/features/gameSlice';
import carStartAudio from '../../public/carstart.mp3';
import carRunningAudio from '../../public/carRunning.mp3';

const StartScene = () => {
  const { isGameStarted } = useSelector((state) => state.game);
  const dispatch = useAppDispatch();
  const audioCarStart = useRef(new Audio(carStartAudio));
  const audioCarRunning = useRef(new Audio(carRunningAudio));
  const runningAudioTimeout = useRef();

  const [orientation, setOrientation] = useState(
    window.screen.orientation.type,
  );

  useEffect(() => {
    const handleOrientationChange = () =>
      setOrientation(window.screen.orientation.type);
    window.addEventListener('orientationchange', handleOrientationChange);
    return () =>
      window.removeEventListener('orientationchange', handleOrientationChange);
  }, []);

  const enableGyro = () => {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then((permissionState) => {
          if (permissionState === 'granted') {
            dispatch(handleGyro(true));
          }
        })
        .catch(console.error);
    } else {
      // For browsers that don't require permission
      dispatch(handleGyro(true));
    }
  };
  const playCarStartSound = () => {
    stopCarStartSound();

    audioCarStart.current.play();
    runningAudioTimeout.current = setTimeout(() => {
      audioCarRunning.current.loop = true;
      audioCarRunning.current.play();
    }, 2000);
  };

  const stopCarStartSound = () => {
    clearTimeout(runningAudioTimeout.current);

    audioCarStart.current.pause();
    audioCarStart.current.currentTime = 0;

    audioCarRunning.current.pause();
    audioCarRunning.current.currentTime = 0;
  };

  useEffect(() => {
    return () => {
      clearTimeout(runningAudioTimeout.current);
      audioCarStart.current.pause();
      audioCarStart.current.currentTime = 0;
      audioCarRunning.current.pause();
      audioCarRunning.current.currentTime = 0;
    };
  }, []);

  return (
    <div className={isGameStarted ? 'start-screen-off' : 'start-screen'}>
      <div className="start-screen-content">
        <button
          className="restart-btn"
          onClick={() => {
            dispatch(startAudio(true));
            playCarStartSound();
          }}
        >
          <h2>sound on {`(recommended)`}</h2>
        </button>
        {orientation === 'landscape-primary' ? (
          <>
            <button onClick={enableGyro} className="restart-btn">
              <h2>enable gyro</h2>
            </button>
          </>
        ) : (
          <>
            {/* <button onClick={enableGyro} className="restart-btn"> */}
            <h2> please rotate device </h2>
            {/* </button> */}
          </>
        )}
        <button
          className="restart-btn"
          onClick={() => {
            dispatch(startAudio(false));
            stopCarStartSound();
          }}
        >
          <h2>sound off</h2>
        </button>
        <button
          className="restart-btn"
          onClick={() => {
            dispatch(startGame());
          }}
        >
          <h2>start game</h2>
        </button>
      </div>
    </div>
  );
};

export default StartScene;
