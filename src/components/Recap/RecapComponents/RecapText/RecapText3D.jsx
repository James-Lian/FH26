import { Suspense } from "react";
import Moon from "../../../3dAssets/Moon";
import Satellite1 from "../../../3dAssets/Satellite1";
import Satellite2 from "../../../3dAssets/Satellite2";
import Astronaut from "../../../3dAssets/Astronaut";

function RecapText3D() {
  return (
    <>
      <Suspense fallback={null}>
        <Astronaut
          position={[-4, 4, 0]}
          lightOffset={[-2, -3, 2]}
          intensity={1}
          scale={0.0002}
        />
        {/* Satellites scattered around */}
        <Satellite1
          position={[-4, 1, 2]}
          lightOffset={[0.3, 0.4, -0.6]}
          scale={0.008}
          intensity={0.4}
        />

      </Suspense>
    </>
  );
}

export default RecapText3D;

