import { useEffect, useRef, useState } from "react";
import { scrollFromNavbar } from "../../hooks/useHorizontalScroll";
import GlassContainer from "../Recap/RecapComponents/RecapProjects/GlassContainer";
import NavItem from "./NavItem";

export default function Navbar() {
  const scrollToVH = (vh) => scrollFromNavbar(vh);

  const [hidden, setHidden] = useState(false);

  const lastTouchY = useRef(null);
  const ticking = useRef(false);

  useEffect(() => {
    const applyDelta = (deltaY) => {
      // down => hide, up => show
      if (Math.abs(deltaY) < 2) return;

      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        setHidden(deltaY > 0); // down hides, up shows
        ticking.current = false;
      });
    };

    const onWheel = (e) => {
      applyDelta(e.deltaY);
    };

    const onTouchStart = (e) => {
      lastTouchY.current = e.touches?.[0]?.clientY ?? null;
    };

    const onTouchMove = (e) => {
      const y = e.touches?.[0]?.clientY;
      if (y == null || lastTouchY.current == null) return;

      // swipe up => deltaY positive (treat as scroll down)
      const deltaY = lastTouchY.current - y;
      lastTouchY.current = y;

      applyDelta(deltaY);
    };

    window.addEventListener("wheel", onWheel, { passive: true, capture: true });
    window.addEventListener("touchstart", onTouchStart, {
      passive: true,
      capture: true,
    });
    window.addEventListener("touchmove", onTouchMove, {
      passive: true,
      capture: true,
    });

    return () => {
      window.removeEventListener("wheel", onWheel, { capture: true });
      window.removeEventListener("touchstart", onTouchStart, { capture: true });
      window.removeEventListener("touchmove", onTouchMove, { capture: true });
    };
  }, []);

  return (
    <div
      className={[
        "fixed top-0 left-0 w-full z-50",
        "transition-all duration-500 ease-out",
        hidden
          ? "-translate-y-30 opacity-0 pointer-events-none"
          : "translate-y-0 opacity-100",
      ].join(" ")}
    >
      <div className="flex flex-row justify-center items-center w-full pt-0">
        <GlassContainer className="flex justify-between items-center w-4/5 mt-4 md:mt-6 lg:mt-8 py-3 px-8 md:py-4 md:px-12 lg:py-4 lg:px-16 text-white">
          <div className="text-lg md:text-xl lg:text-2xl">
            <NavItem label="FH26" onClick={() => scrollToVH(0)} />
          </div>

          <div className="flex flex-row items-center justify-center gap-4 md:gap-5 lg:gap-6 text-sm md:text-base lg:text-lg">
            <NavItem label="Intro" onClick={() => scrollToVH(125)} />
            <NavItem label="Recap" onClick={() => scrollToVH(230)} />
            <NavItem label="FAQ" onClick={() => scrollToVH(350)} />
            <NavItem label="Sponsors" onClick={() => scrollToVH(450)} />
          </div>
        </GlassContainer>
      </div>
    </div>
  );
}
