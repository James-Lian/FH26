// App.jsx
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { ScrollControls, Scroll, AdaptiveDpr } from "@react-three/drei";
import { Suspense, lazy, useState, useEffect } from "react";
import "./App.css";

import HeroSection from "./components/HeroSection/HeroSection";
import TitleMain from "./components/HeroSection/TitleMain";
import MouseLight from "./components/MouseLight/MouseLight";
import Background from "./components/Background/Background";
import IntroText from "./components/Intro/IntroText";
import Recap3D from "./components/Recap/Recap3d";
import RecapText from "./components/Recap/RecapComponents/RecapText/RecapText";
import RecapProjects from "./components/Recap/RecapComponents/RecapProjects/RecapProjects";
import Sponsers from "./components/Sponsers/Sponsers";
import Sponsors3D from "./components/Sponsers/Sponsers3D";
import FAQ from "./components/FAQ/FAQ";
import Navbar from "./components/Navbar/Navbar";
import ScrollController from "./components/Navbar/ScrollController";
import { scrollFromNavbarWhenReady } from "./hooks/useHorizontalScroll";
import Registration from "./pages/registration/Registration";
import ScannerX7P4N2 from "./pages/scanner/ScannerX7P4N2";
import TeamPage from "./pages/team/team";
import RegisteredSuccessBanner from "./components/Registration/RegisteredSuccessBanner";

// Lazy load heavy 3D components
const Intro3D = lazy(() => import("./components/Intro/Intro3D"));

function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(
    () => !!location.state?.registrationSuccess,
  );

  useEffect(() => {
    const s = location.state;
    if (!s || typeof s !== "object") return;

    let nextState = { ...s };
    let didSomething = false;

    if (s.registrationSuccess) {
      setShowSuccessBanner(true);
      delete nextState.registrationSuccess;
      didSomething = true;
    }

    const vh = s.scrollVH;
    if (vh != null && typeof vh === "number") {
      scrollFromNavbarWhenReady(vh);
      delete nextState.scrollVH;
      didSomething = true;
    }

    if (!didSomething) return;

    const keys = Object.keys(nextState);
    navigate(location.pathname, {
      replace: true,
      state: keys.length > 0 ? nextState : {},
    });
  }, [location.state, location.pathname, navigate]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="w-screen h-screen">
      {showSuccessBanner && (
        <RegisteredSuccessBanner
          onDismiss={() => setShowSuccessBanner(false)}
        />
      )}
      <Navbar />

      <Canvas
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{
          width: "100vw",
          display: "block",
        }}
      >
        <ambientLight color="#ffffff" intensity={0.1} />
        <AdaptiveDpr pixelated />
        {!isMobile && <MouseLight />}
        {!isMobile && <Background />}

        <ScrollControls pages={7} damping={0.15}>
          <ScrollController />

          <Scroll>
            <group position={[0, 0, 0]}>
              <HeroSection />
            </group>
            <group position={[0, -8, 0]}>
              <Suspense fallback={null}>
                <Intro3D />
              </Suspense>
            </group>
            <Recap3D />
            <group position={[0, -18, 0]}>
              <Sponsors3D />
            </group>
          </Scroll>

          {/* HTML overlay that scrolls */}
          <Scroll html>
            <section style={{ height: "100vh", width: "100vw" }}>
              <TitleMain />
            </section>
            <section style={{ height: "100vh", width: "100vw" }}>
              <IntroText />
            </section>
            <section
              className="flex flex-row items-start justify-between"
              style={{ height: "100vh", width: "200vw" }}
            >
              <RecapText />
              <RecapProjects />
            </section>
            <section
              style={{
                height: "100vh",
                width: "100vw",
                // On mobile, nudge FAQ up slightly so it appears a bit earlier while scrolling
                marginTop: isMobile ? "-30vh" : 0,
              }}
            >
              <FAQ />
            </section>
          </Scroll>
        </ScrollControls>
      </Canvas>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/scanner-x7p4n2" element={<ScannerX7P4N2 />} />
      <Route path="/team" element={<TeamPage />} />
    </Routes>
  );
}
