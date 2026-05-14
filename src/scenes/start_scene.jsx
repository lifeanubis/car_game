import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAppDispatch } from '../redux/hooks';
import { startGame, addScore, startAudio } from '../redux/features/gameSlice';
import { CarStartSound } from './soundDemo_scene';
import carStartAudio from '../../public/carstart.mp3';
import carRunningAudio from '../../public/carRunning.mp3';

const StartScene = () => {
  const [sound, setSound] = useState(false);
  const { isGameStarted, score, audio } = useSelector((state) => state.game);

  const soundHandle = () => {
    return (
      <CarStartSound
      // vehicleStartSound={vehicleStartSound}
      // setVehicleStartSound={setVehicleStartSound}
      />
    );
  };

  const playCarStartSound = () => {
    const audioCarStart = new Audio(carStartAudio);
    const audioCarRunning = new Audio(carRunningAudio);

    audioCarStart.play();
    setTimeout(() => {
      audioCarRunning.play();
      audioCarRunning.loop = true;
    }, 2000);
  };

  useEffect(() => {
    soundHandle();
    // console.log(audio, 'audio');
  }, [audio]);

  const dispatch = useAppDispatch();
  const sounda = useRef();

  return (
    <div className="start-screen">
      <div className="start-screen-content">
        <div
          onClick={() => {
            dispatch(startAudio(true));
            soundHandle();
            playCarStartSound();
          }}
        >
          {' '}
          sound on {`(recommended)`}
        </div>
        <div onClick={() => dispatch(startAudio(false))}>sound off</div>
        <div
          onClick={() => {
            dispatch(startGame());
          }}
        >
          start game
        </div>
      </div>
    </div>
  );
};

export default StartScene;
