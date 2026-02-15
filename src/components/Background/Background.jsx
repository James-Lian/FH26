// Net.jsx
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useMemo, useLayoutEffect, useRef } from "react";
import Delaunator from "delaunator";
import { Stars } from "@react-three/drei";

const NUM_POINTS = 50;
const MIN_DIST = 0.1;
const NODE_SCALE = 0.025;
const LINK_RADIUS_BASE = 0.004;
const LINK_RADIUS_MAX = 0.008;
const Z_MIN = -4;
const Z_MAX = 0;

const SPEED_X = 0.002;
const SPEED_Y = 0.002;
const SPEED_Z = 0.001;
const REBUILD_INTERVAL = 2.5; // bumping this up reduces Delaunay spikes

const NODE_COLOR = "#b0b0b0";
const LINK_COLOR = "#ffffff";

export default function Background({ worldWidth = 32, worldHeight = 18 }) {
  const HALF_W = worldWidth / 2;
  const HALF_H = worldHeight / 2;

  function poissonLikePoints(count, minDist) {
    const pts = [];
    const maxTries = count * 20;
    let tries = 0;

    while (pts.length < count && tries < maxTries) {
      tries++;
      const x = THREE.MathUtils.randFloatSpread(worldWidth);
      const y = THREE.MathUtils.randFloatSpread(worldHeight);
      const ok = pts.every(
        (p) => (p.x - x) ** 2 + (p.y - y) ** 2 >= minDist * minDist
      );
      if (ok) {
        const z = THREE.MathUtils.randFloat(Z_MIN, Z_MAX);
        pts.push(new THREE.Vector3(x, y, z));
      }
    }

    while (pts.length < count) {
      const x = THREE.MathUtils.randFloatSpread(worldWidth);
      const y = THREE.MathUtils.randFloatSpread(worldHeight);
      const z = THREE.MathUtils.randFloat(Z_MIN, Z_MAX);
      pts.push(new THREE.Vector3(x, y, z));
    }
    return pts;
  }

  function buildDelaunayEdges(points) {
    const pts2 = points.map((p) => [p.x, p.y]);
    const d = Delaunator.from(pts2);
    const tris = d.triangles;

    const edges = new Set();
    const key = (i, j) => (i < j ? `${i}-${j}` : `${j}-${i}`);

    for (let t = 0; t < tris.length; t += 3) {
      const a = tris[t],
        b = tris[t + 1],
        c = tris[t + 2];
      edges.add(key(a, b));
      edges.add(key(b, c));
      edges.add(key(c, a));
    }

    const pairsIdx = [];
    for (const k of edges) {
      const [i, j] = k.split("-").map(Number);
      pairsIdx.push([i, j]);
    }
    return pairsIdx;
  }

  // Points & velocities
  const points = useMemo(
    () => poissonLikePoints(NUM_POINTS, MIN_DIST),
    [worldWidth, worldHeight]
  );

  const velocities = useMemo(() => {
    const v = new Array(NUM_POINTS);
    for (let i = 0; i < NUM_POINTS; i++) {
      v[i] = new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(SPEED_X),
        THREE.MathUtils.randFloatSpread(SPEED_Y),
        THREE.MathUtils.randFloatSpread(SPEED_Z)
      );
    }
    return v;
  }, []);

  const linkIndexPairsRef = useRef(buildDelaunayEdges(points));
  const timeSinceRebuild = useRef(0);

  const nodesRef = useRef(null);
  const linksRef = useRef(null);

  const MAX_LINKS = useMemo(() => Math.ceil(NUM_POINTS * 3.2), []);

  // Scratch objects (NO allocations in frame loop)
  const scratch = useMemo(() => {
    return {
      m: new THREE.Matrix4(),
      q: new THREE.Quaternion(),
      up: new THREE.Vector3(0, 1, 0),
      dir: new THREE.Vector3(),
      mid: new THREE.Vector3(),
      scaleNode: new THREE.Vector3(NODE_SCALE, NODE_SCALE, NODE_SCALE),
      scaleLink: new THREE.Vector3(LINK_RADIUS_BASE, 1, LINK_RADIUS_BASE),
    };
  }, []);

  // Initialize instance matrices once
  useLayoutEffect(() => {
    if (!nodesRef.current || !linksRef.current) return;

    // Nodes init
    for (let i = 0; i < points.length; i++) {
      scratch.m.compose(points[i], scratch.q, scratch.scaleNode);
      nodesRef.current.setMatrixAt(i, scratch.m);
    }
    nodesRef.current.instanceMatrix.needsUpdate = true;

    // Links init
    const pairs = linkIndexPairsRef.current;
    const N = Math.min(pairs.length, MAX_LINKS);

    for (let i = 0; i < N; i++) {
      const [ia, ib] = pairs[i];
      const a = points[ia];
      const b = points[ib];

      scratch.dir.subVectors(b, a);
      const len = scratch.dir.length();

      scratch.mid.addVectors(a, b).multiplyScalar(0.5);
      scratch.q.setFromUnitVectors(scratch.up, scratch.dir.normalize());

      scratch.scaleLink.set(LINK_RADIUS_BASE, len / 2, LINK_RADIUS_BASE);
      scratch.m.compose(scratch.mid, scratch.q, scratch.scaleLink);

      linksRef.current.setMatrixAt(i, scratch.m);
    }

    linksRef.current.count = N;
    linksRef.current.instanceMatrix.needsUpdate = true;
  }, [points, MAX_LINKS, scratch]);

  useFrame((_, dt) => {
    if (!nodesRef.current || !linksRef.current) return;

    // Update nodes
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const v = velocities[i];

      p.x += v.x;
      p.y += v.y;
      p.z += v.z;

      if (p.x < -HALF_W || p.x > HALF_W) {
        p.x = THREE.MathUtils.clamp(p.x, -HALF_W, HALF_W);
        v.x *= -1;
      }
      if (p.y < -HALF_H || p.y > HALF_H) {
        p.y = THREE.MathUtils.clamp(p.y, -HALF_H, HALF_H);
        v.y *= -1;
      }
      if (p.z < Z_MIN || p.z > Z_MAX) {
        p.z = THREE.MathUtils.clamp(p.z, Z_MIN, Z_MAX);
        v.z *= -1;
      }

      // tiny jitter
      v.x += THREE.MathUtils.randFloatSpread(0.0004);
      v.y += THREE.MathUtils.randFloatSpread(0.0004);
      v.z += THREE.MathUtils.randFloatSpread(0.0002);

      v.x = THREE.MathUtils.clamp(v.x, -SPEED_X, SPEED_X);
      v.y = THREE.MathUtils.clamp(v.y, -SPEED_Y, SPEED_Y);
      v.z = THREE.MathUtils.clamp(v.z, -SPEED_Z, SPEED_Z);

      scratch.m.compose(p, scratch.q, scratch.scaleNode);
      nodesRef.current.setMatrixAt(i, scratch.m);
    }
    nodesRef.current.instanceMatrix.needsUpdate = true;

    // Rebuild edges occasionally (spike reducer)
    timeSinceRebuild.current += dt;
    if (timeSinceRebuild.current >= REBUILD_INTERVAL) {
      linkIndexPairsRef.current = buildDelaunayEdges(points);
      timeSinceRebuild.current = 0;
    }

    // Update links (NO hide loop needed — count handles it)
    const pairs = linkIndexPairsRef.current;
    const N = Math.min(pairs.length, MAX_LINKS);

    for (let i = 0; i < N; i++) {
      const [ia, ib] = pairs[i];
      const a = points[ia];
      const b = points[ib];

      scratch.dir.subVectors(b, a);
      const len = scratch.dir.length();

      scratch.mid.addVectors(a, b).multiplyScalar(0.5);
      scratch.q.setFromUnitVectors(scratch.up, scratch.dir.normalize());

      // radius based on length
      const t = THREE.MathUtils.clamp(1 - len / 2.0, 0, 1);
      const r = THREE.MathUtils.lerp(LINK_RADIUS_BASE, LINK_RADIUS_MAX, t);

      scratch.scaleLink.set(r, len / 2, r);
      scratch.m.compose(scratch.mid, scratch.q, scratch.scaleLink);

      linksRef.current.setMatrixAt(i, scratch.m);
    }

    linksRef.current.count = N;
    linksRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <Stars radius={120} depth={60} count={1200} factor={4} fade speed={0.5} />

      <instancedMesh ref={nodesRef} args={[null, null, points.length]}>
        {/* cheaper geometry */}
        <sphereGeometry args={[1, 6, 6]} />
        <meshStandardMaterial
          color={NODE_COLOR}
          roughness={0.6}
          metalness={0}
          emissive={NODE_COLOR}
          emissiveIntensity={2}
          transparent
          opacity={0.5}
          depthWrite
          toneMapped={false}
        />
      </instancedMesh>

      <instancedMesh ref={linksRef} args={[null, null, MAX_LINKS]}>
        {/* cheaper geometry */}
        <cylinderGeometry args={[1, 1, 2, 4]} />
        <meshStandardMaterial
          color={LINK_COLOR}
          roughness={0.7}
          metalness={0.2}
          transparent={false}
          opacity={0.5}
          depthWrite
          toneMapped={false}
        />
      </instancedMesh>
    </group>
  );
}
