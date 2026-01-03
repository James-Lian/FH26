import { Suspense, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import Moon from "../../3dAssets/Moon";
import Earth from "../../3dAssets/Earth";
import Asteroid1 from "../../3dAssets/Asteroid1";
import Asteroid2 from "../../3dAssets/Asteroid2";
import Astronaut from "../../3dAssets/Astronaut";

// Configuration for orbital objects
const getOrbitalObjects = () => [
  {
    type: "Moon",
    text: "last year we had...",
    angle: 0, // 0 degrees
    heightOffset: 0,
    scale: 0.12,
    orbitDistance: 4.3,
  },
  {
    type: "Asteroid1",
    text: "100+ participants",
    angle: 50,
    heightOffset: -0.1,
    scale: 1.2,
    orbitDistance: 4.7,
  },
  {
    type: "Asteroid2",
    text: "30+ projects",
    angle: 110,
    heightOffset: -0.05,
    scale: 2.8,
    orbitDistance: 4.4,
  },
  {
    type: "Asteroid1",
    text: "20+ sponsors",
    angle: 160,
    heightOffset: -0.5,
    scale: 1.2,
    orbitDistance: 4.6,
  },
  {
    type: "Asteroid2",
    text: "1000+ dollars in prizes",
    angle: 210,
    heightOffset: 0.5,
    scale: 2.8,
    orbitDistance: 4.5,
  },
  {
    type: "Asteroid1",
    text: "10000+ lines of code",
    angle: 270,
    heightOffset: -0.05,
    scale: 1.2,
    orbitDistance: 4.8,
  },
  {
    type: "Asteroid2",
    text: "10+ judges",
    angle: 310,
    heightOffset: 0.2,
    scale: 2.8,
    orbitDistance: 4.2,
  },
  {
    type: "Astronaut",
    angle: 60,
    heightOffset: 2,
    scale: 0.0003,
    orbitDistance: 4.0,
  },
];

// Calculate orbital positions for all objects
const calculateOrbitalPositions = (orbitalObjects, time, rotationSpeed) => {
  return orbitalObjects.map((object) => {
    // Astronaut rotates faster than other objects
    const speedMultiplier = object.type === "Astronaut" ? 1.5 : 1;
    const radian =
      (object.angle * Math.PI) / 180 + time * rotationSpeed * speedMultiplier;
    const x = Math.cos(radian) * object.orbitDistance;
    const y = object.heightOffset + 1.5; // heightOffset is now properly used with base height
    const z = Math.sin(radian) * object.orbitDistance;
    return { x, y, z };
  });
};

// Render text component
const renderText = (text, position, fontSize = 0.3) => (
  <Text
    position={position}
    fontSize={fontSize}
    color="white"
    anchorX="center"
    anchorY="middle"
    font="/fonts/Bitcount.ttf"
    maxWidth={2.5}
  >
    {text}
  </Text>
);

// Render Moon component
const renderMoon = (object) => (
  <group>
    {renderText(object.text, [0, 1.1, 1.2], 0.4)}
    <Moon
      position={[0, 0, 0]}
      scale={object.scale}
      lightOffset={[0, 1, 1.8]}
      intensity={0.7}
    />
  </group>
);

// Render Asteroid1 component
const renderAsteroid1 = (object) => (
  <group>
    {renderText(object.text, [0, 0, 1], 0.2)}
    <Asteroid1
      position={[0, 0, 0]}
      scale={object.scale}
      lightOffset={[0, 0, 2.2]}
      intensity={1.5}
    />
  </group>
);

// Render Asteroid2 component
const renderAsteroid2 = (object) => (
  <group>
    {renderText(object.text, [0, 0.8, 1], 0.25)}
    <Asteroid2
      position={[0, 0, 0]}
      scale={object.scale}
      lightOffset={[-0.3, 0.8, 1.5]}
      intensity={1.5}
    />
  </group>
);

// Render Astronaut component
const renderAstronaut = (object) => (
  <group>
    <Astronaut
      position={[0, 0, 0]}
      lightOffset={[-2, 3, 2]}
      intensity={1}
      scale={object.scale}
    />
  </group>
);

// Main component to render orbital objects
const renderOrbitalObject = (object) => {
  switch (object.type) {
    case "Moon":
      return renderMoon(object);
    case "Asteroid1":
      return renderAsteroid1(object);
    case "Asteroid2":
      return renderAsteroid2(object);
    case "Astronaut":
      return renderAstronaut(object);
    default:
      return null;
  }
};

// Animation hook
const useOrbitalAnimation = (orbitalObjects, setMoonPositions) => {
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const rotationSpeed = 0.1;

    const orbitalPositions = calculateOrbitalPositions(
      orbitalObjects,
      time,
      rotationSpeed
    );
    setMoonPositions(orbitalPositions);
  });
};

// Central Earth component
const CentralEarth = () => (
  <Earth
    position={[0, 1.5, -4]}
    lightOffset={[0, 0, 2]}
    scale={0.12}
    intensity={2}
  />
);

// Orbital belt component
const OrbitalBelt = ({ moonPositions, orbitalObjects }) => (
  <group>
    {moonPositions.map((position, index) => (
      <group key={index} position={[position.x, position.y, position.z - 3]}>
        {renderOrbitalObject(orbitalObjects[index], index)}
      </group>
    ))}
  </group>
);

function PlanetRecap3D() {
  const [moonPositions, setMoonPositions] = useState([]);
  const orbitalObjects = getOrbitalObjects();

  // Use the animation hook
  useOrbitalAnimation(orbitalObjects, setMoonPositions);

  return (
    <>
      <Suspense fallback={null}>
        <group position={[0, -1.5, 0]}>
        <CentralEarth />
        <OrbitalBelt
            moonPositions={moonPositions}
            orbitalObjects={orbitalObjects}
          />
        </group>
      </Suspense>
    </>
  );
}

export default PlanetRecap3D;
