import { Suspense } from "react";
import Moon from "../../../3dAssets/Moon";
import Satellite1 from "../../../3dAssets/Satellite1";
import Satellite2 from "../../../3dAssets/Satellite2";
import Astronaut from "../../../3dAssets/Astronaut";
import Planet2 from "../../../3dAssets/Planet2";

function RecapProjects3D() {
  return (
    <>
      <Suspense fallback={null}>
        {/* Left side: Scattered objects */}
        {/* Moons scattered on left */}
        <Moon
          position={[-3, 2, -2]}
          lightOffset={[0.5, -0.3, 0.5]}
          scale={0.08}
          intensity={0.3}
        />

        {/* Astronaut on left */}
        <Astronaut
          position={[-4, 4, 0]}
          lightOffset={[-2, -3, 2]}
          intensity={1}
          scale={0.0002}
        />
        {/* Right side: Large Red Planet */}
        <Planet2
          position={[12, -12, -20]}
          scale={0.15}
        />
      </Suspense>
    </>
  );
}

export default RecapProjects3D;

