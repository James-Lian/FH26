import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import { scrollApi } from "../components/Navbar/ScrollController";

// Configuration
const HORIZONTAL_SCROLL_CONFIG = {
  transitionSpeed: 0.05,
  scrollDeltaScale: 0.01,
  recapSection: {
    start: 0.33,
    end: 0.34,
    entryBuffer: 0.08,
  },
};

// Shared state
let sharedHorizontalOffset = 0;
const offsetListeners = new Set();

const setSharedOffset = (value) => {
  sharedHorizontalOffset = value;
  offsetListeners.forEach((listener) => listener(value));
};

export const getHorizontalOffset = () => sharedHorizontalOffset;
export const subscribeToHorizontalOffset = (callback) => {
  offsetListeners.add(callback);
  return () => offsetListeners.delete(callback);
};

// Flag to indicate Navbar-triggered scroll
let allowNavbarScroll = false;

// Function for Navbar to trigger scroll
export const scrollFromNavbar = (vh) => {
  allowNavbarScroll = true; // temporarily allow vertical scroll
  scrollApi.el.scrollTo({
    top: (vh / 100) * window.innerHeight,
    behavior: "smooth",
  });
  setTimeout(() => (allowNavbarScroll = false), 800);
};

export const useHorizontalScroll = () => {
  const scroll = useScroll();
  const { viewport } = useThree();
  const { transitionSpeed, scrollDeltaScale, recapSection } =
    HORIZONTAL_SCROLL_CONFIG;

  const maxOffset = viewport.width * 1.5;
  const minOffset = -viewport.width * 2;
  const initialOffset = viewport.width * 1.5;
  console.log(minOffset, maxOffset, initialOffset);

  const [isHorizontalMode, setIsHorizontalMode] = useState(false);
  const [horizontalOffset, setHorizontalOffset] = useState(initialOffset);
  const targetHorizontalOffset = useRef(initialOffset);
  const lastScrollOffset = useRef(0);
  const scrollDirection = useRef(null);
  const scrollDirectionHorizontal = useRef(null);
  const lastScrollTime = useRef(Date.now());

  // Sync initial value
  useEffect(() => {
    setSharedOffset(initialOffset);
  }, [initialOffset]);

  // Touch tracking for swipe gestures
  const lastTouchX = useRef(null);
  const lastTouchY = useRef(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  // Wheel handler
  useEffect(() => {
    const handleWheel = (event) => {
      // Only prevent default if horizontal mode is active AND NOT coming from Navbar
      if (isHorizontalMode && !allowNavbarScroll) {
        event.preventDefault();
        event.stopPropagation();

        const deltaY = event.deltaY;
        const currentOffset = targetHorizontalOffset.current;
        const horizontalDelta = -deltaY * scrollDeltaScale;

        scrollDirectionHorizontal.current = deltaY > 0 ? "right" : "left";

        targetHorizontalOffset.current = Math.max(
          minOffset,
          Math.min(maxOffset, currentOffset + horizontalDelta)
        );

        return false;
      } else {
        return true;
      }
    };

    const handleTouchStart = (event) => {
      if (event.touches.length === 1 && scrollApi?.el) {
        touchStartX.current = event.touches[0].clientX;
        touchStartY.current = event.touches[0].clientY;
        lastTouchX.current = event.touches[0].clientX;
        lastTouchY.current = event.touches[0].clientY;
      }
    };

    const handleTouchMove = (event) => {
      if (event.touches.length === 1 && scrollApi?.el && lastTouchX.current !== null && lastTouchY.current !== null) {
        const currentX = event.touches[0].clientX;
        const currentY = event.touches[0].clientY;
        const deltaX = currentX - lastTouchX.current;
        const deltaY = currentY - lastTouchY.current;
        
        // Determine if swipe is primarily horizontal or vertical
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);
        const isVerticalSwipe = absDeltaY > absDeltaX;

        if (isVerticalSwipe && isHorizontalMode && !allowNavbarScroll) {
          // Vertical swipe in horizontal mode - scroll horizontally
          // Swipe up (negative deltaY) = scroll left, swipe down (positive deltaY) = scroll right
          event.preventDefault();
          event.stopPropagation();

          lastTouchX.current = currentX;
          lastTouchY.current = currentY;

          const currentOffset = targetHorizontalOffset.current;
          // Convert vertical delta to horizontal scroll delta
          // Swipe up (negative deltaY) moves left (negative horizontalDelta)
          // Swipe down (positive deltaY) moves right (positive horizontalDelta)
          const horizontalDelta = deltaY * scrollDeltaScale * 10; // Scale factor for touch sensitivity

          scrollDirectionHorizontal.current = deltaY > 0 ? "right" : "left";

          targetHorizontalOffset.current = Math.max(
            minOffset,
            Math.min(maxOffset, currentOffset + horizontalDelta)
          );
        } else if (!isVerticalSwipe && isHorizontalMode && !allowNavbarScroll) {
          // Horizontal swipe in horizontal mode - scroll horizontally
          event.preventDefault();
          event.stopPropagation();

          lastTouchX.current = currentX;
          lastTouchY.current = currentY;

          const currentOffset = targetHorizontalOffset.current;
          // Convert pixel delta to horizontal scroll delta (negative because swipe left = scroll right)
          const horizontalDelta = -deltaX * scrollDeltaScale * 10; // Scale factor for touch sensitivity

          scrollDirectionHorizontal.current = deltaX < 0 ? "right" : "left";

          targetHorizontalOffset.current = Math.max(
            minOffset,
            Math.min(maxOffset, currentOffset + horizontalDelta)
          );
        } else if (!isHorizontalMode) {
          // Not in horizontal mode - allow normal vertical scrolling
          lastTouchX.current = currentX;
          lastTouchY.current = currentY;
        } else {
          // Update tracking even if we don't handle it
          lastTouchX.current = currentX;
          lastTouchY.current = currentY;
        }
      }
    };

    const handleTouchEnd = () => {
      lastTouchX.current = null;
      lastTouchY.current = null;
      touchStartX.current = null;
      touchStartY.current = null;
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isHorizontalMode, maxOffset, scrollDeltaScale]);

  useFrame(() => {
    if (!scroll || !scroll.offset) return;

    const scrollProgress = scroll.offset;
    const currentTime = Date.now();

    if (scrollProgress > lastScrollOffset.current) {
      scrollDirection.current = "down";
    } else if (scrollProgress < lastScrollOffset.current) {
      scrollDirection.current = "up";
    }

    lastScrollOffset.current = scrollProgress;
    lastScrollTime.current = currentTime;

    const { start, end, entryBuffer } = recapSection;
    const inRecapSection =
      scrollProgress > start - entryBuffer &&
      scrollProgress < end + entryBuffer;

    if (inRecapSection && !allowNavbarScroll) {
      const atLeftBoundary =
        scrollDirectionHorizontal.current === "left" &&
        scrollDirection.current !== "down" &&
        horizontalOffset >= maxOffset - 0.1;

      const atRightBoundary =
        scrollDirectionHorizontal.current === "right" &&
        scrollDirection.current !== "up" &&
        horizontalOffset <= minOffset + 0.1;

      if (atLeftBoundary || atRightBoundary) {
        setIsHorizontalMode(false);
      } else {
        setIsHorizontalMode(true);
        const target = scroll.el.scrollHeight * 0.26;
        scroll.el.scrollTo({ top: target, behavior: "instant" });
        scrollDirection.current = null;
      }
    }
    // If the scroll came from the Navbar
    const inRecapEntryExitBounds =
      scrollProgress >= recapSection.start - recapSection.entryBuffer &&
      scrollProgress <= recapSection.end + recapSection.entryBuffer;

    if (allowNavbarScroll) {
      if (!inRecapEntryExitBounds) {
        if (
          scrollDirection.current === "down" &&
          horizontalOffset > minOffset
        ) {
          setHorizontalOffset(minOffset);
          setSharedOffset(minOffset);
          targetHorizontalOffset.current = minOffset;
        } else if (
          scrollDirection.current === "up" &&
          horizontalOffset < maxOffset
        ) {
          setHorizontalOffset(maxOffset);
          setSharedOffset(maxOffset);
          targetHorizontalOffset.current = maxOffset;
        }
        setIsHorizontalMode(false);
      } else {
        setHorizontalOffset(maxOffset);
        setSharedOffset(maxOffset);
        targetHorizontalOffset.current = maxOffset;
      }
    }

    if (isHorizontalMode) {
      const currentOffset = horizontalOffset;
      const targetOffset = targetHorizontalOffset.current;

      if (Math.abs(targetOffset - currentOffset) > 0.01) {
        const newOffset =
          currentOffset + (targetOffset - currentOffset) * transitionSpeed;
        setHorizontalOffset(newOffset);
        setSharedOffset(newOffset);
      }
    }
  });

  return {
    isHorizontalMode,
    horizontalOffset,
    maxHorizontalOffset: maxOffset,
  };
};
