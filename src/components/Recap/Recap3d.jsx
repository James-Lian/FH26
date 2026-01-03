import { Suspense } from "react";
import { useThree } from "@react-three/fiber";
import { useHorizontalScroll } from "../../hooks/useHorizontalScroll";
import PlanetRecap3D from "./RecapComponents/PlanetRecap3D";
import RecapText3D from "./RecapComponents/RecapText/RecapText3D";
import RecapProjects3D from "./RecapComponents/RecapProjects/RecapProjects3D";

function Recap3D() {
  const { horizontalOffset } = useHorizontalScroll(false);
  const { viewport } = useThree();
  const screenWidth = viewport.width * 1.5;
  
  // Scale PlanetRecap3D smaller on small screens (viewport.width < 8 is roughly < 768px)
  const planetScale = viewport.width < 8 ? 0.7 : 1;

  return (
    <>
      <group position={[horizontalOffset, -16, 0]}>
        <Suspense fallback={null}>
          <RecapText3D />
        </Suspense>
      </group>
      <group position={[horizontalOffset - screenWidth, -16, 0]} scale={planetScale}>
        <Suspense fallback={null}>
          <PlanetRecap3D />
        </Suspense>
      </group>
      <group position={[horizontalOffset + screenWidth, -16, 0]}>
        <Suspense fallback={null}>
          <RecapProjects3D />
        </Suspense>
      </group>
    </>
  );
}

export default Recap3D;
