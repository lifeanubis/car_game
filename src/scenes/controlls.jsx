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
    <div className="controlls-contianer">
      <div className="steering-container">
        <img src="/wheel.png" alt="Controlls" width={100} height={100} />
        <div>
          <h1>{lives}</h1>
        </div>
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
  );
};

export default Controlls;
