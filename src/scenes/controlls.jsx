import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const Controlls = () => {
  //   gsap.registerPlugin(useGSAP); // register the hook to avoid React version discrepancies

  const first = () => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.fromTo(
      '#photo',
      {},
      // some example properties.
      {
        // backgroundColor: 'blue', // background-color
        // fontSize: 12, // font-size
        // duration: 5,
        // ease: 'power3.out',
        // boxShadow: '0px 0px 20px 20px red', // animate complex strings
        // borderRadius: '50% 50%',
        // height: 'auto', // animate between auto and a px value 🪄
      },
    );
    // gsap.fromTo(
    //   '#photo',
    //   {
    //     rotate: '10',
    //   },
    //   {
    //     duration: 5,
    //     rotate: '-z`0',
    //     ease: 'back.inOut',
    //     repeat: -1,
    //     yoyo: true,
    //   },
    // );
  };
  useEffect(() => {
    first();
  }, []);
  return (
    <div className="controlls-contianer">
      <div className="steering-container">
        <img src="/wheel.png" alt="Controlls" width={100} height={100} />
      </div>
      <div id="photo" className="scroll-info">
        <li>score</li>
        <li>about ME</li>
        <li>portfolio </li>
        {/* <li>asd </li> */}
      </div>
    </div>
  );
};

export default Controlls;
