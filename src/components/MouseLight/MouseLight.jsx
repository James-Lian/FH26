import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function MouseLight() {
  const lightRef = useRef();
  const targetRef = useRef();

  useFrame(({ mouse, viewport }) => {
    // Convert mouse [-1..1] to world coordinates
    const x = (mouse.x * viewport.width) / 2;
    const y = (mouse.y * viewport.height) / 2;

    // Light could be fixed or follow mouse — here it's fixed
    lightRef.current.position.set(0, 0, 5);

    // Target follows mouse but is deeper in Z
    targetRef.current.position.set(x * 2.1, y * 2.1, -5);

    // Make sure spotlight uses this target
    lightRef.current.target = targetRef.current;
  });

  return (
    <>
      <spotLight
        ref={lightRef}
        color={0xffffff}
        intensity={4}
        distance={0}
        angle={Math.PI / 16}
        penumbra={1}
        decay={0.3}
      />
      {/* Spotlight target — must be in the scene */}
      <object3D ref={targetRef} />
    </>
  );
}
