import Planet from "../3dAssets/Planet";
import { Suspense } from "react";
import Moon from "../3dAssets/Moon";
import Sun from "../3dAssets/Sun";
import Astronaut from "../3dAssets/Astronaut";
import ISS from "../3dAssets/ISS";

function HeroSection() {
  return (
    <>
      <Suspense fallback={null}>
        <Astronaut position={[-3, 1.3, 1]} scale={0.0002} />
        <Planet position={[0, 0, -1]} scale={0.24} />
        <Moon
          position={[3, 1, 1]}
          lightOffset={[-0.8, 0.2, 0.2]}
          scale={0.07}
          intensity={0.2}
        />
        <Moon
          position={[-4.5, -3, -1]}
          lightOffset={[0.5, 1.4, 0.6]}
          scale={0.07}
          intensity={0.1}
        />
        <Sun
          position={[-2.1, 0.9, 3]}
          lightOffset={[0.5, -0.2, 0.1]}
          scale={0.2}
        />

        <ISS
          position={[5, 0, 0]}
          lightOffset={[-0.6, 0.4, 1.4]}
          scale={0.08}
          intensity={0.5}
        />
      </Suspense>
    </>
  );
}

export default HeroSection;
