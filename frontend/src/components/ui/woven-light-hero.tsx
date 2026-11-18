"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export interface WovenCanvasProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Creates a soft glowing radial circle texture for the Three.js particle system.
 */
function createParticleTexture(): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.2, "rgba(200, 255, 240, 0.9)");
    gradient.addColorStop(0.5, "rgba(16, 185, 129, 0.4)");
    gradient.addColorStop(0.8, "rgba(6, 182, 212, 0.15)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * WovenCanvas
 * A high-performance Three.js particle torus-knot animation with container-scoped sizing,
 * Pramaan AI emerald-to-cyan color gradients, cursor interaction, and complete lifecycle cleanup.
 */
export function WovenCanvas({ className = "", style }: WovenCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // 1. Scene & Camera setup
    const scene = new THREE.Scene();

    const initialWidth = mount.clientWidth || 400;
    const initialHeight = mount.clientHeight || 400;
    const camera = new THREE.PerspectiveCamera(
      55,
      initialWidth / initialHeight,
      0.1,
      1000
    );
    camera.position.z = 24;

    // 2. WebGL Renderer with Alpha & Additive Blending
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(initialWidth, initialHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // 3. Woven Torus-Knot Particle System Geometry
    const knotGeo = new THREE.TorusKnotGeometry(7.5, 2.3, 240, 36, 2, 3);
    const positions = knotGeo.attributes.position.array;
    const particleCount = positions.length / 3;

    // Float32 arrays for positions & emerald-to-cyan HSL colors
    const posArray = new Float32Array(particleCount * 3);
    const colArray = new Float32Array(particleCount * 3);

    const color = new THREE.Color();
    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      posArray[idx] = positions[idx];
      posArray[idx + 1] = positions[idx + 1];
      posArray[idx + 2] = positions[idx + 2];

      // Pramaan AI Color Palette: Hue between 0.42 (emerald) and 0.54 (cyan)
      const t = i / particleCount;
      const hue = 0.42 + 0.12 * Math.sin(t * Math.PI * 4);
      const saturation = 0.92;
      const lightness = 0.5 + 0.25 * Math.sin(t * Math.PI * 8);

      color.setHSL(hue, saturation, lightness);
      colArray[idx] = color.r;
      colArray[idx + 1] = color.g;
      colArray[idx + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colArray, 3));

    // 4. Particle Material with Soft Glow Texture & Additive Blending
    const texture = createParticleTexture();
    const material = new THREE.PointsMaterial({
      size: 0.28,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      map: texture,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Ambient floating stardust embers
    const dustCount = 800;
    const dustPos = new Float32Array(dustCount * 3);
    const dustCol = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      const idx = i * 3;
      dustPos[idx] = (Math.random() - 0.5) * 32;
      dustPos[idx + 1] = (Math.random() - 0.5) * 24;
      dustPos[idx + 2] = (Math.random() - 0.5) * 20;

      const hue = 0.44 + Math.random() * 0.1;
      color.setHSL(hue, 0.8, 0.6);
      dustCol[idx] = color.r;
      dustCol[idx + 1] = color.g;
      dustCol[idx + 2] = color.b;
    }

    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    dustGeo.setAttribute("color", new THREE.BufferAttribute(dustCol, 3));

    const dustMat = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      map: texture,
    });

    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);

    // 5. Container-Scoped Sizing with ResizeObserver
    const handleResize = () => {
      if (!mount) return;
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (width === 0 || height === 0) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(mount);

    // 6. Interactive Cursor Movement & Smooth Damping
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const onPointerMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width - 0.5;
      const normY = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotY = normX * 1.4;
      targetRotX = normY * 1.2;
    };

    const onPointerLeave = () => {
      targetRotX = 0;
      targetRotY = 0;
    };

    mount.addEventListener("pointermove", onPointerMove);
    mount.addEventListener("pointerleave", onPointerLeave);

    // 7. Animation Loop with Organic Motion
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth lerp damping toward target rotation
      currentRotX += (targetRotX - currentRotX) * 0.06;
      currentRotY += (targetRotY - currentRotY) * 0.06;

      // Base organic rotation + cursor tilt
      particles.rotation.x = elapsedTime * 0.15 + currentRotX;
      particles.rotation.y = elapsedTime * 0.22 + currentRotY;
      particles.rotation.z = elapsedTime * 0.08;

      // Subtle counter-rotation for ambient dust embers
      dustParticles.rotation.y = -elapsedTime * 0.05;
      dustParticles.rotation.x = elapsedTime * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Lifecycle Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      mount.removeEventListener("pointermove", onPointerMove);
      mount.removeEventListener("pointerleave", onPointerLeave);

      knotGeo.dispose();
      geometry.dispose();
      material.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      texture.dispose();
      renderer.dispose();

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`overflow-hidden ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

/**
 * WovenLightHero
 * Wrapper component exported for compatibility with the woven-light-hero spec.
 */
export function WovenLightHero({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <WovenCanvas className="absolute inset-0 z-0 pointer-events-auto" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default WovenCanvas;
