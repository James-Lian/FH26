import { useState, useEffect, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { ScrollControls, Scroll, AdaptiveDpr } from "@react-three/drei";
import BackLink from "../../components/Registration/BackLink";
import GradientBorder from "../../components/Registration/GradientBorder";
import AuthField from "../../components/Registration/AuthField";
import SchoolSelector from "../../components/Registration/SchoolSelector";
import ExperienceSelector from "../../components/Registration/ExperienceSelector";
import TShirtSizeSelector from "../../components/Registration/TShirtSizeSelector";
import SubmitButton from "../../components/Registration/SubmitButton";
import { addRegistrationGroupedBySchool, emailExistsGlobally } from "../../tools/firebase";
import Background from "../../components/Background/Background";
import MouseLight from "../../components/MouseLight/MouseLight";
import Astronaut from "../../components/3dAssets/Astronaut";
import ScrollController, { scrollApi } from "../../components/Navbar/ScrollController";

export default function Registration() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    schoolEmail: "",
    personalEmail: "",
    school: "",
    experience: "",
    tshirtSize: "",
    dietaryRestrictions: "",
    additionalQuestions: "",
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [exists, setExists] = useState(false);
  const isFormValid = () =>
    formData.fullName.trim() !== "" &&
    formData.schoolEmail.trim() !== "" &&
    formData.school.trim() !== "" &&
    formData.tshirtSize.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    if (!isFormValid()) return;
    const emailExists = await emailExistsGlobally(formData.schoolEmail);
    if (emailExists){
      setExists(true);
      return;
    } else {
      setExists(false);
    }
    await addRegistrationGroupedBySchool({
      fullName: formData.fullName,
      schoolEmail: formData.schoolEmail,
      personalEmail: formData.personalEmail,
      school: formData.school,
      experience: formData.experience,
      tshirtSize: formData.tshirtSize,
      dietaryRestrictions: formData.dietaryRestrictions,
      additionalQuestions: formData.additionalQuestions,
    });
    navigate("/", { state: { registrationSuccess: true } });

    try {
      const data = {
        to: formData.schoolEmail,
        cc: formData.personalEmail ? formData.personalEmail : undefined,
        name: formData.fullName,
      }
      const response = await fetch('/api/registrationConfirmed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Success");
      } else {
        console.log('Error');
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!submitAttempted || isFormValid()) return;
    const scrollEl = scrollApi?.el;
    if (scrollEl) scrollEl.scrollTo({ top: 0, behavior: "smooth" });
  }, [submitAttempted, formData.fullName, formData.schoolEmail, formData.school, formData.tshirtSize]);

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
        <ScrollControls pages={1.5} damping={0.15}>
          <ScrollController />

          <Scroll html>
          <section style={{ height: "150vh", width: "100vw" }}>
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 pointer-events-none">
            <div className="absolute top-6 left-6 pointer-events-auto">
              <BackLink />
            </div>
            <div className="pointer-events-auto w-full max-w-md">
              <GradientBorder className="w-full">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
                  Register
                </h1>
                <form onSubmit={handleSubmit}>
                  <AuthField
                    label="Full name"
                    id="full-name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    placeholder="John Doe"
                    required
                    error={submitAttempted && !formData.fullName.trim()}
                  />
                  <AuthField
                    label="School email"
                    id="school-email"
                    name="schoolEmail"
                    type="email"
                    value={formData.schoolEmail}
                    onChange={(e) => updateField("schoolEmail", e.target.value)}
                    placeholder="you@school.edu"
                    required
                    error={submitAttempted && (!formData.schoolEmail.trim() || exists)}
                    errorMessage={exists ? "This email is already registered" : undefined}
                  />
                  <AuthField
                    label="Personal email"
                    id="personal-email"
                    name="personalEmail"
                    type="email"
                    value={formData.personalEmail}
                    onChange={(e) => updateField("personalEmail", e.target.value)}
                    placeholder="you@example.com"
                    required={false}
                  />
                  <SchoolSelector
                    id="school"
                    value={formData.school}
                    onChange={(v) => updateField("school", v)}
                    required
                    error={submitAttempted && !formData.school.trim()}
                  />
                  <ExperienceSelector
                    id="experience"
                    value={formData.experience}
                    onChange={(v) => updateField("experience", v)}
                  />
                  <p className="text-white/60 text-sm mb-4">No experience required.</p>
                  <TShirtSizeSelector
                    id="tshirt-size"
                    value={formData.tshirtSize}
                    onChange={(v) => updateField("tshirtSize", v)}
                    required
                    error={submitAttempted && !formData.tshirtSize.trim()}
                  />
                  <AuthField
                    label="Dietary restrictions"
                    id="dietary"
                    name="dietaryRestrictions"
                    value={formData.dietaryRestrictions}
                    onChange={(e) => updateField("dietaryRestrictions", e.target.value)}
                    placeholder="e.g. vegetarian, allergies, none"
                    required={false}
                  />
                  <AuthField
                    label="Additional questions / concerns"
                    id="additional"
                    name="additionalQuestions"
                    as="textarea"
                    value={formData.additionalQuestions}
                    onChange={(e) => updateField("additionalQuestions", e.target.value)}
                    placeholder="Anything else we should know?"
                    required={false}
                  />
                  <p className="text-white/60 text-xs text-center mt-4">
                    This hackathon may cost up to $10 to participate for non-JFSS students. We're working hard to make it free!
                  </p>
                  <SubmitButton>Submit</SubmitButton>
                </form>
              </GradientBorder>
            </div>
          </div>
          </section>
        </Scroll>
      </ScrollControls>
      </Canvas>
    </div>
  );
}
