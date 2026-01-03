// components/Sponsers/Sponsors3D.jsx
import * as THREE from "three";
import { useMemo } from "react";
import { Text, shaderMaterial } from "@react-three/drei";
import SponsorTile3D from "./SponsersTile3D";
import { extend, useThree } from "@react-three/fiber";

const sponsors = [
  // GOLD (2)
  { id: 1, tier: "gold", link: "https://gold2.com", imagePath: "" },
  { id: 2, tier: "gold", link: "https://gold2.com", imagePath: "" },

  // SILVER (4)
  { id: 3, tier: "silver", link: "https://silver1.com", imagePath: "" },
  { id: 4, tier: "silver", link: "https://silver2.com", imagePath: "" },
  { id: 5, tier: "silver", link: "https://silver3.com", imagePath: "" },
  { id: 6, tier: "silver", link: "https://silver4.com", imagePath: "" },

  // BRONZE (6)
  { id: 7, tier: "bronze", link: "https://bronze1.com", imagePath: "" },
  { id: 8, tier: "bronze", link: "https://bronze2.com", imagePath: "" },
  { id: 9, tier: "bronze", link: "https://bronze3.com", imagePath: "" },
  { id: 10, tier: "bronze", link: "https://bronze4.com", imagePath: "" },
  { id: 11, tier: "bronze", link: "https://bronze5.com", imagePath: "" },
  { id: 12, tier: "bronze", link: "https://bronze6.com", imagePath: "" },

  // OTHER (5)
  { id: 13, tier: "other", link: "https://other1.com", imagePath: "" },
  { id: 14, tier: "other", link: "https://other2.com", imagePath: "" },
  { id: 15, tier: "other", link: "https://other3.com", imagePath: "" },
  { id: 16, tier: "other", link: "https://other4.com", imagePath: "" },
  { id: 17, tier: "other", link: "https://other5.com", imagePath: "" },
];

const tierOrder = ["gold", "silver", "bronze", "other"];
const tierLabels = {
  gold: "Gold Sponsers",
  silver: "Silver Sponsers",
  bronze: "Bronze Sponsers",
  other: "Other Sponsers",
};

// sizes + columns
const tileSpec = {
  gold: { w: 12, h: 1.7, cols: 1 },
  silver: { w: 6, h: 1.45, cols: 2 },
  bronze: { w: 4, h: 1.3, cols: 3 },
  other: { w: 3, h: 1.15, cols: 4 },
};

const tierAccent = {
  gold: "#ffefba",
  silver: "#ebebeb",
  bronze: "#e8bc90",
  other: "#ffffff",
};

function groupByTier(list) {
  return list.reduce((acc, s) => {
    (acc[s.tier] ||= []).push(s);
    return acc;
  }, {});
}

const UnderlineFadeMaterial = shaderMaterial(
  {
    uColor: new THREE.Color("#ffffff"),
    uOpacity: 1.0,
    uPowerY: 2.2,
    uFeatherX: 0.18,
    uFeatherY: 0.08,
  },
  `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uPowerY;
  uniform float uFeatherX;
  uniform float uFeatherY;
  varying vec2 vUv;

  float edgeFeather(float t, float feather) {
    float left  = smoothstep(0.0, feather, t);
    float right = smoothstep(0.0, feather, 1.0 - t);
    return left * right;
  }

  void main() {
    float vy = 1.0 - pow(1.0 - vUv.y, uPowerY);
    float topSoft = smoothstep(0.0, uFeatherY, 1.0 - vUv.y);
    float hx = edgeFeather(vUv.x, uFeatherX);
    float a = vy * hx * topSoft * uOpacity;
    gl_FragColor = vec4(uColor, a);
  }
  `
);

extend({ UnderlineFadeMaterial });

function UnderlineLight({ width, color, y }) {
  const fadeH = 4;
  const lineY = -0.22;

  return (
    <group position={[0, y, 0]}>
      <mesh position={[0, lineY - fadeH * 0.5 + 0.03, 0.01]}>
        <planeGeometry args={[width, fadeH]} />
        <underlineFadeMaterial
          uColor={new THREE.Color(color)}
          uOpacity={0.15}
          uPowerY={2.2} // keep consistent with the shader uniform name
          uFeatherX={0.18}
          uFeatherY={0.08}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <rectAreaLight
        args={[color, 2, width, 0.18]}
        position={[0, lineY, 0.35]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
    </group>
  );
}

export default function Sponsors3D({ position = [0, -16, 0] }) {
  const { viewport } = useThree();
  const grouped = useMemo(() => groupByTier(sponsors), []);
  
  // Scale tiles smaller on small screens (viewport.width < 8 is roughly < 768px)
  const tileScale = viewport.width < 8 ? 0.4 : (viewport.width < 10 ? 0.6 : (viewport.width < 12 ? 0.8:1));

  // Increase height proportionally as scale decreases (inverse relationship)
  // When scale is 0.4, height multiplier is 1/0.4 = 2.5, when scale is 1.0, height multiplier is 1.0
  const heightMultiplier = 1 / tileScale;

  const gapX = 0.4;
  const gapY = 0.6;
  const titleGap = 0.9;
  const sectionGap = 1.4;

  // First pass: calculate total height to center everything
  let totalHeight = 0;
  for (const tier of tierOrder) {
    const items = grouped[tier] || [];
    if (!items.length) continue;
    
    totalHeight += titleGap; // Title gap
    const { w, h, cols } = tileSpec[tier];
    const adjustedH = h * heightMultiplier;
    const rows = Math.ceil(items.length / cols);
    totalHeight += rows * (adjustedH + gapY) - gapY; // Tile rows
    totalHeight += sectionGap; // Section gap
  }
  totalHeight -= sectionGap; // Remove last section gap

  // Start positioned toward the bottom (offset downward from center)
  // Offset by 6 units down from center to position it near the bottom
  let cursorY = totalHeight / 2 - 6;
  const nodes = [];

  for (const tier of tierOrder) {
    const items = grouped[tier] || [];
    if (!items.length) continue;

    nodes.push(
      <Text
        font="/fonts/Roboto-Black.ttf"
        key={`${tier}-title`}
        position={[0, cursorY, 0]}
        fontSize={0.42}
        anchorX="center"
        anchorY="middle"
        color="#ffffff"
      >
        {tierLabels[tier]}
      </Text>
    );

    nodes.push(
      <UnderlineLight
        key={`${tier}-underlineLight`}
        width={14}
        color={tierAccent[tier]}
        y={cursorY}
      />
    );

    cursorY -= titleGap;

    const { w, h, cols } = tileSpec[tier];
    // Apply height multiplier to increase height when scale decreases
    const adjustedH = h * heightMultiplier;
    const rows = Math.ceil(items.length / cols);

    const rowWidth = cols * w + (cols - 1) * gapX;
    const startX = -rowWidth / 2;

    items.forEach((s, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = startX + col * (w + gapX) + w / 2;
      const y = cursorY - row * (adjustedH + gapY) - adjustedH / 2;

      nodes.push(
        <SponsorTile3D
          key={s.id}
          sponsor={s} // includes s.imagePath now
          w={w}
          h={adjustedH}
          x={x}
          y={y}
          z={0}
        />
      );
    });

    cursorY -= rows * (adjustedH + gapY) - gapY;
    cursorY -= sectionGap;
  }

  // Adjust Y position to anchor the top (title) to a fixed position regardless of scale
  // When scaled down, we need to move the group up to compensate so the top stays in place
  const adjustedPosition = [
    position[0], 
    position[1] + (1 - tileScale) * 2, 
    position[2]
  ];

  return <group position={adjustedPosition} scale={tileScale}>{nodes}</group>;
}
