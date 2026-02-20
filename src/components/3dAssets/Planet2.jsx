import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { SkeletonUtils } from "three-stdlib";
import * as THREE from "three";

export default function Planet2({ position = [0, 0, 0], scale = 1, ...props }) {
  const { scene } = useGLTF("/models/Planet2.glb");

  // Clone so multiple instances don't share the same scene reference
  const cloned = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  // Brighten the planet's material with natural lighting

  return (
    <group position={position} rotation={[0, 60, 0]} {...props}>
      <primitive object={cloned} scale={scale} dispose={null} />
    </group>
  );
}

// Optional: preload the asset
useGLTF.preload("/models/Planet2.glb");

