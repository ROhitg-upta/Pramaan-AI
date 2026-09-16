"use client";

import confetti from "canvas-confetti";

export function fireBuilderConfetti() {
  // Primary burst from center-bottom
  confetti({
    particleCount: 120,
    spread: 70,
    origin: { y: 0.6, x: 0.5 },
    colors: ["#10B981", "#34D399", "#6EE7B7", "#F59E0B", "#06B6D4"],
    gravity: 0.8,
    ticks: 200,
    scalar: 1.1,
  });

  // Left angled cannon
  setTimeout(() => {
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 55,
      origin: { x: 0.2, y: 0.65 },
      colors: ["#10B981", "#F59E0B", "#06B6D4"],
    });
  }, 200);

  // Right angled cannon
  setTimeout(() => {
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 55,
      origin: { x: 0.8, y: 0.65 },
      colors: ["#10B981", "#F59E0B", "#06B6D4"],
    });
  }, 350);
}
