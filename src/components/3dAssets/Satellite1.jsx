// Satellite1.jsx
import { useGLTF } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { SkeletonUtils } from "three-stdlib"; // safe clone for skinned/animated models

export default function Satellite1({
  position = [0, 0, 0],
  scale = 1,
  lightOffset = [0, 0, 0],
  intensity,
}) {
  const { scene } = useGLTF("/models/background/Satellite1.glb");

  // Clone so multiple instances don't share the same scene reference
  const cloned = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  // Animation frame for floating and rotating
  return (
    <group position={position}>
      <primitive object={cloned} scale={scale} dispose={null} />
    </group>
  );
}

// Optional: preload the asset
useGLTF.preload("/models/background/Satellite1.glb");
