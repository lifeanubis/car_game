import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppSelector } from '../redux/hooks';

const Controlls = () => {
  //   gsap.registerPlugin(useGSAP); // register the hook to avoid React version discrepancies
  const { lives } = useAppSelector((state) => state.game);
  // useEffect(() => {
  //   first();
  // }, []);
  return (
    <div>
      <div className="controlls-contianer">
        <div className="steering-container">
          <img src="/wheel.png" alt="Controlls" width={100} height={100} />
        </div>
        <div id="photo" className="scroll-info">
          <li>
            <a
              rel="noopener"
              href="https://github.com/lifeanubis"
              target="_blank"
            >
              github{' '}
            </a>
          </li>
          {/* <li>score</li> */}
          <li>
            <a
              rel="noopener"
              href="/Shreyansh_Sharma_Resume_2026.pdf"
              download={true}
            >
              resume &darr;
            </a>
          </li>
          <li>
            <a
              rel="noopener"
              href="https://my-world-3d.netlify.app/landing"
              target="_blank"
            >
              portfolio{' '}
            </a>
          </li>
          {/* <li>asd </li> */}
        </div>
      </div>
      <div className="game-info">
        <div>
          <h2>{lives}</h2>
        </div>
        <div className={lives <= 0 ? 'game-over' : 'game-on'}>
          <h2>game over</h2>
        </div>
        <button className={lives <= 0 ? 'restart-btn' : 'restart-btn-off'}>
          <h2>restart</h2>
        </button>
      </div>
    </div>
  );
};

export default Controlls;
