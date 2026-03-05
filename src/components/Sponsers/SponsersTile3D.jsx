// SponsorTile3D.jsx (copy-paste)
import * as THREE from "three";
import { useMemo, useRef, useState } from "react";
import { RoundedBox, Text, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

// 1x1 transparent png (so useTexture always gets a valid URL)
const TRANSPARENT_PX =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+X2kQAAAAASUVORK5CYII=";

export default function SponsorTile3D({ sponsor, w, h, x, y, z, tileScale = 1 }) {
  const [hovered, setHovered] = useState(false);
  const g = useRef();

  const imagePath = (sponsor?.imagePath || "").trim();
  const hasImage = imagePath.length > 0;
  const sponsorName = (sponsor?.name || "").trim();
  const showName = sponsorName && tileScale >= 0.5;

  // Always load *something* valid to avoid "Could not load null"
  const tex = useTexture(hasImage ? imagePath : TRANSPARENT_PX);

  // Only treat it as a real image when sponsor.imagePath exists
  const showImage = hasImage;

  if (showImage) {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
  }

  const open = () => {
    if (sponsor?.link)
      window.open(sponsor.link, "_blank", "noopener,noreferrer");
  };

  const depth = 0.3;
  const frontZ = depth / 2 + 0.002;

  // keep logo aspect ratio (contain). When text is hidden (small tiles), use full tile; else left half.
  const { imgW, imgH } = useMemo(() => {
    const padding = showName ? 0.6 : 0.85;
    const tileW = showName ? w / 2 : w;
    const tileH = h;

    if (!showImage) return { imgW: tileW * padding, imgH: tileH * padding };

    const iw = tex?.image?.width || 1;
    const ih = tex?.image?.height || 1;

    const tileAspect = tileW / tileH;
    const imgAspect = iw / ih;

    if (imgAspect > tileAspect) {
      const width = tileW * padding;
      return { imgW: width, imgH: width / imgAspect };
    } else {
      const height = tileH * padding;
      return { imgW: height * imgAspect, imgH: height };
    }
  }, [showImage, showName, tex, w, h]);

  // base + hover targets
  const baseZ = z - 0.5;
  const hoverLift = 0.18;
  const targetZ = hovered ? baseZ + hoverLift : baseZ;
  const targetScale = hovered ? 1.03 : 1;

  useFrame((_, dt) => {
    if (!g.current) return;
    g.current.position.z = THREE.MathUtils.damp(
      g.current.position.z,
      targetZ,
      12,
      dt
    );
    const s = THREE.MathUtils.damp(g.current.scale.x, targetScale, 12, dt);
    g.current.scale.setScalar(s);
  });

  const tierText = (sponsor?.tier || "sponsor").toString().toUpperCase();

  return (
    <group ref={g} position={[x, y, baseZ]}>
      <RoundedBox
        args={[w, h, depth]}
        radius={0.2}
        smoothness={0.1}
        bevelSegments={1}
        steps={1}
        creaseAngle={0.9}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = sponsor?.link ? "pointer" : "default";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          open();
        }}
      >
        <meshStandardMaterial
          color="#ffffff"
          roughness={1}
          metalness={0}
          flatShading
        />
      </RoundedBox>

      {showImage ? (
        <>
          {showName ? (
            <>
              {/* Logo on the left half, name on the right */}
              <group position={[w * 0.25, 0, frontZ]}>
                <mesh position={[-w / 2, 0, 0]}>
                  <planeGeometry args={[imgW, imgH]} />
                  <meshBasicMaterial
                    map={tex}
                    transparent
                    toneMapped={false}
                    opacity={hovered ? 0.95 : 1}
                  />
                </mesh>
                <Text
                  position={[-w / 2 + imgW / 2 + 0.2, 0, 0]}
                  font="/fonts/PixelifySans-Medium.ttf"
                  fontSize={Math.min(w, h) * 0.25}
                  maxWidth={w * 0.8}
                  anchorX="left"
                  anchorY="middle"
                  color="#cccccc"
                >
                  {sponsorName}
                </Text>
              </group>
            </>
          ) : (
            /* Text hidden (e.g. mobile): image fills the tile, centered */
            <mesh position={[0, 0, frontZ]}>
              <planeGeometry args={[imgW, imgH]} />
              <meshBasicMaterial
                map={tex}
                transparent
                toneMapped={false}
                opacity={hovered ? 0.95 : 1}
              />
            </mesh>
          )}
        </>
      ) : (
        <Text
          position={[0, 0, frontZ]}
          font="/fonts/PixelifySans-Medium.ttf"
          fontSize={Math.min(w, h) * 0.22}
          maxWidth={w * 0.85}
          anchorX="center"
          anchorY="middle"
          color="#eeeeee"
        >
          {tierText}
        </Text>
      )}
    </group>
  );
}
