import { useState, useEffect } from "react";

export interface TypewriterOptions {
  speed?: number; // ms per character
  delay?: number; // ms before starting
  onComplete?: () => void;
  cursorBlink?: boolean;
}

/**
 * Custom hook for cinematic typewriter text streaming
 * Returns the currently displayed substring, completion state, and blinking cursor flag
 */
export function useTypewriter(
  text: string,
  options: TypewriterOptions = {}
): {
  displayedText: string;
  isComplete: boolean;
  cursorVisible: boolean;
  progress: number;
} {
  const { speed = 30, delay = 0, onComplete, cursorBlink = true } = options;

  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Typewriter text interval
  useEffect(() => {
    let charIndex = 0;
    setDisplayedText("");
    setIsComplete(false);

    const startTimeout = setTimeout(() => {
      const typeInterval = setInterval(() => {
        if (charIndex < text.length) {
          setDisplayedText(text.slice(0, charIndex + 1));
          charIndex++;
        } else {
          setIsComplete(true);
          clearInterval(typeInterval);
          onComplete?.();
        }
      }, speed);

      return () => clearInterval(typeInterval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [text, speed, delay, onComplete]);

  // Blinking block cursor interval
  useEffect(() => {
    if (!cursorBlink) return;
    const blinkInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);

    return () => clearInterval(blinkInterval);
  }, [cursorBlink]);

  const progress = text.length > 0 ? displayedText.length / text.length : 1;

  return {
    displayedText,
    isComplete,
    cursorVisible,
    progress,
  };
}
