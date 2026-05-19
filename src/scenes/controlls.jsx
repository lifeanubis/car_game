import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { startAudio, startGame } from '../redux/features/gameSlice';

const Controlls = () => {
  //   gsap.registerPlugin(useGSAP); // register the hook to avoid React version discrepancies
  const { lives, audio } = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();

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
        <button
          onClick={() => {
            window.location.reload();
          }}
          className={lives <= 0 ? 'restart-btn' : 'restart-btn-off'}
        >
          <h2>restart</h2>
        </button>
      </div>
    </div>
  );
};

export default Controlls;
