import { useState, useEffect } from "react";

/**
 * Custom hook for smooth, eased numerical count-up animations
 * Uses cubic ease-out deceleration curve for forensic Bloomberg-style numbers
 */
export function useCountUp(
  target: number,
  duration = 1500,
  start = 0,
  delay = 0
): { value: number; formatted: string; isComplete: boolean } {
  const [value, setValue] = useState(start);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let animationFrameId: number;
    let timeoutId: NodeJS.Timeout;

    timeoutId = setTimeout(() => {
      const startTime = performance.now();

      function tick(now: number) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Cubic ease-out deceleration
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (target - start) * eased);

        setValue(current);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(tick);
        } else {
          setValue(target);
          setIsComplete(true);
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationFrameId);
    };
  }, [target, duration, start, delay]);

  return {
    value,
    formatted: value.toLocaleString(),
    isComplete,
  };
}
