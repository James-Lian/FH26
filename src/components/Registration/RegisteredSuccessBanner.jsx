import { useState, useEffect } from "react";
import GradientBorder from "./GradientBorder";

export default function RegisteredSuccessBanner({ onDismiss }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsExiting(true), 5000);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
  };

  const handleTransitionEnd = (e) => {
    if (e.propertyName === "opacity" && isExiting) {
      onDismiss?.();
    }
  };

  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-[60] w-full max-w-xl transition-all duration-300 ease-out ${
        isExiting ? "opacity-0 -translate-y-8" : "opacity-100 translate-y-0"
      }`}
      onTransitionEnd={handleTransitionEnd}
    >
      <GradientBorder className="w-full" compact>
        <div className="flex items-center justify-between gap-4">
          <span className="font-semibold text-white text-base">Registered successfully!</span>
          <button
            type="button"
            onClick={handleClose}
            className="flex items-center p-1 text-center justify-center rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Dismiss"
          >
            x
          </button>
        </div>
      </GradientBorder>
    </div>
  );
}
