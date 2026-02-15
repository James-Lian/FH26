import { useState, useEffect, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import BackLink from "../../components/Registration/BackLink";
import GradientBorder from "../../components/Registration/GradientBorder";
import AuthField from "../../components/Registration/AuthField";
import SubmitButton from "../../components/Registration/SubmitButton";
import Background from "../../components/Background/Background";
import MouseLight from "../../components/MouseLight/MouseLight";
import Astronaut from "../../components/3dAssets/Astronaut";

export default function Registration() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    school: "",
    dietaryRestrictions: "",
    additionalQuestions: "",
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const updateField = (name, value) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  return (
    <div className="w-screen h-screen relative">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, width: "100%", height: "100%", display: "block" }}
      >
        <ambientLight color="#ffffff" intensity={0.1} />
        <AdaptiveDpr pixelated />
        {!isMobile && <Background />}
        {!isMobile && <MouseLight />}
        <Suspense fallback={null}>
          <Astronaut position={[-3, 1.3, 1.5]} scale={0.0002} intensity={0.5} />
        </Suspense>
      </Canvas>
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 pointer-events-none">
        <div className="absolute top-6 left-6 pointer-events-auto">
          <BackLink />
        </div>
        <div className="pointer-events-auto w-full max-w-md">
          <GradientBorder className="w-full">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
              Register
            </h1>
            <form onSubmit={(e) => e.preventDefault()}>
              <AuthField
                label="Full name"
                id="full-name"
                name="fullName"
                value={formData.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                placeholder="John Doe"
                required
              />
              <AuthField
                label="Email"
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="you@example.com"
                required
              />
              <AuthField
                label="School"
                id="school"
                name="school"
                value={formData.school}
                onChange={(e) => updateField("school", e.target.value)}
                placeholder="Your school name"
                required
              />
              <AuthField
                label="Dietary restrictions"
                id="dietary"
                name="dietaryRestrictions"
                value={formData.dietaryRestrictions}
                onChange={(e) => updateField("dietaryRestrictions", e.target.value)}
                placeholder="e.g. vegetarian, allergies, none"
              />
              <AuthField
                label="Additional questions / concerns"
                id="additional"
                name="additionalQuestions"
                as="textarea"
                value={formData.additionalQuestions}
                onChange={(e) => updateField("additionalQuestions", e.target.value)}
                placeholder="Anything else we should know?"
              />
              <SubmitButton
                fullName={formData.fullName}
                email={formData.email}
                school={formData.school}
                dietaryRestrictions={formData.dietaryRestrictions}
                additionalQuestions={formData.additionalQuestions}
                onSuccess={() => navigate("/", { state: { registrationSuccess: true } })}
              >
                Submit
              </SubmitButton>
            </form>
          </GradientBorder>
        </div>
      </div>
    </div>
  );
}
