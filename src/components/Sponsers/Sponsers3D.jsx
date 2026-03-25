// components/Sponsers/Sponsors3D.jsx
import * as THREE from "three";
import { useMemo } from "react";
import { Text, shaderMaterial } from "@react-three/drei";
import SponsorTile3D from "./SponsersTile3D";
import { extend, useThree } from "@react-three/fiber";
import Astronaut from "../3dAssets/Astronaut";

const sponsors = [
  {
    id: 1,
    tier: "Platinum",
    link: "https://windscribe.com/",
    imagePath: "images/Sponsors/windscribe.png",
    name: "Windscribe",
  },
  {
    id: 2,
    tier: "Platinum",
    link: "http://streetsvillerotary.com/",
    imagePath: "images/Sponsors/Rotary.png",
    name: "Rotary Streetsville",
  },
  {
    id: 3,
    tier: "Platinum",
    link: "https://johnfraser.peelschools.org/",
    imagePath: "/images/Sponsors/JFSS.png",
    name: "John Fraser Secondary School",
  },
  {
    id: 4,
    tier: "Platinum",
    link: "https://www.peelschools.org/advanced-placement",
    imagePath: "/images/Sponsors/AP.png",
    name: "Peel Advanced Placement Program",
  },

  {
    id: 5,
    tier: "Other",
    link: "https://appwizzy.com/",
    imagePath: "/images/Sponsors/Appwizzy.png",
    name: "App Wizzy",
  },
  {
    id: 6,
    tier: "Other",
    link: "https://www.interviewcake.com/",
    imagePath: "/images/Sponsors/interview_cake.png",
    name: "Interview Cake",
  },
  {
    id: 7,
    tier: "Other",
    link: "https://www.letsroam.com/",
    imagePath: "/images/Sponsors/letsroam.avif",
    name: "Lets Roam",
  },
  {
    id: 8,
    tier: "Other",
    link: "https://artofproblemsolving.com/company",
    imagePath: "/images/Sponsors/aops.png",
    name: "Art of Problem Solving",
  },
  {
    id: 9,
    tier: "Other",
    link: "https://codecrafters.io/",
    imagePath: "/images/Sponsors/codecrafters.svg",
    name: "Code Crafters",
  },
  {
    id: 10,
    tier: "Other",
    link: "https://gen.xyz/",
    imagePath: "/images/Sponsors/xyz.png",
    name: "XYZ",
  },
  {
    id: 11,
    tier: "Other",
    link: "https://athenachat.bot/chatbot",
    imagePath: "/images/Sponsors/athena.png",
    name: "Athena Chat",
  },
];

const tierOrder = ["Platinum", "Other"];
const tierLabels = {
  Platinum: "Platinum Sponsors!!",
  Other: "Other Sponsors!!",
};

// sizes + columns
const tileSpec = {
  Platinum: { w: 12, h: 1.7, cols: 1 },
  Other: { w: 6, h: 1.35, cols: 2 },
};

const tierAccent = {
  Platinum: "#feeeff",
  Other: "#cccccc",
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
  `,
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
  const tileScale =
    viewport.width < 6
      ? 0.3
      : viewport.width < 8
        ? 0.4
        : viewport.width < 10
          ? 0.6
          : viewport.width < 12
            ? 0.8
            : 1;
  const isNarrow = viewport.width < 8;
  // On mobile, make section title bigger (1.5x relative to scaled content)
  const titleFontSize = isNarrow ? 0.5 / tileScale : 1;
  // On mobile, raise the title (and underline) up a bit
  const titleYOffset = isNarrow ? 1.2 : 0;

  // Increase height proportionally as scale decreases (inverse relationship)
  // When scale is 0.4, height multiplier is 1/0.4 = 2.5, when scale is 1.0, height multiplier is 1.0
  const heightMultiplier = 1 / tileScale;

  const gapX = 0.4;
  const gapY = 0.6;
  const titleGap = 0.9;
  const sectionGap = !isNarrow ? 1.4 : 2;

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
        font="/fonts/PixelifySans-Medium.ttf"
        key={`${tier}-title`}
        position={[0, cursorY + titleYOffset, 0]}
        fontSize={titleFontSize}
        anchorX="center"
        anchorY="middle"
        color="#ffffff"
      >
        {tierLabels[tier]}
      </Text>,
    );

    nodes.push(
      <UnderlineLight
        key={`${tier}-underlineLight`}
        width={14}
        color={tierAccent[tier]}
        y={cursorY + titleYOffset}
      />,
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
          tileScale={tileScale}
        />,
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
    position[2],
  ];

  return (
    <group position={adjustedPosition} scale={tileScale}>
      {nodes}{" "}
      <Astronaut
        position={[isNarrow ? 7 : 3, isNarrow ? 7 : -2, 1]}
        lightOffset={[-2, -3, 2]}
        intensity={1}
        scale={0.00025 / tileScale}
      />
    </group>
  );
}
