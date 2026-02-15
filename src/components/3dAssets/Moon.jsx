// Moon.jsx
import { useGLTF } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { SkeletonUtils } from "three-stdlib"; // safe clone for skinned/animated models

export default function Moon({
  position = [0, 0, 0],
  scale = 1,
  lightOffset = [0, 0, 0],
  intensity,
}) {
  const ref = useRef();
  const { scene } = useGLTF("/models/Moon.glb");

  // Clone so multiple instances don’t share the same scene reference
  const cloned = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  return (
    <group position={position} ref={ref}>
      <primitive object={cloned} scale={scale} dispose={null} />
      {intensity > 0 && (
      <pointLight
        color="#ffffff"
        intensity={intensity}
        decay={2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        position={lightOffset}
      />
      )}
    </group>
  );
}

// Optional: preload the asset
useGLTF.preload("/models/Moon.glb");
