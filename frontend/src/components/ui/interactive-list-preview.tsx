// Built using Hyperiux Vault & Adapted for Pramaan AI
"use client";

import gsap from "gsap";
import React, {
  useEffect,
  useRef,
  type ComponentProps,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";

const DEFAULT_IMAGE_Z_INDEX = 10;
const DEFAULT_IMAGE_SIZE = 1;
const DEFAULT_DURATION = 0.5;
const DEFAULT_SMOOTHNESS = 0.3;
const DEFAULT_LERP = 0.18;
const BASE_IMAGE_WIDTH_REM = 22;
const BASE_IMAGE_HEIGHT_REM = 16;
const IMAGE_OFFSET_MULTIPLIER = 24;
const ACTIVE_ROW_TEXT_COLOR = "#000000";
const INACTIVE_ROW_TEXT_COLOR = "#ffffff";
const IMAGE_HIDDEN_CLIP_PATH = "inset(50% round 16px)";
const IMAGE_VISIBLE_CLIP_PATH = "inset(0% round 16px)";
const IMAGE_VISIBILITY_HIDDEN = "hidden";
const IMAGE_VISIBILITY_VISIBLE = "visible";

function clampNumber(value: number, min: number, max: number, fallback: number) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(Math.max(number, min), max);
}

export interface InteractiveListItem {
  client: string; // Title e.g. "ACT 01 — Repo Ingestion"
  platform?: string; // Subtitle e.g. "PHASE 01/05"
  services: string; // Description
  img?: string;
  preview?: ReactNode; // Custom theme-matched React preview component
  act?: string;
  href?: string;
}

export interface InteractiveListPreviewProps {
  items: InteractiveListItem[];
  bgColor?: string;
  imageSize?: number;
  duration?: number;
  smoothness?: number;
  lerp?: number;
  enableMixBlend?: boolean;
  className?: string;
}

export function InteractiveListPreview({
  items,
  bgColor = "#07090D",
  imageSize = DEFAULT_IMAGE_SIZE,
  duration = DEFAULT_DURATION,
  smoothness = DEFAULT_SMOOTHNESS,
  lerp = DEFAULT_LERP,
  enableMixBlend = false,
  className = "",
}: InteractiveListPreviewProps) {
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageContainerRef = useRef<HTMLDivElement | null>(null);
  const tableRef = useRef<HTMLDivElement | null>(null);
  const highlightRef = useRef<HTMLDivElement | null>(null);
  const rowRefs = useRef<Record<number, HTMLTableRowElement | null>>({});
  const pendingLeaveRef = useRef<Record<number, boolean>>({});
  const tweenGenerationRef = useRef<Record<number, number>>({});
  const activeIndexRef = useRef<number | null>(null);
  const zIndexRef = useRef(DEFAULT_IMAGE_Z_INDEX);
  const pointerTargetRef = useRef({ x: 0, y: 0 });
  const pointerCurrentRef = useRef({ x: 0, y: 0 });
  const reduceMotionRef = useRef(
    typeof window !== "undefined" &&
      (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false)
  );

  const safeImageSize = clampNumber(imageSize, 0.5, 2, DEFAULT_IMAGE_SIZE);
  const safeDuration = clampNumber(duration, 0.1, 2, DEFAULT_DURATION);
  const safeSmoothness = clampNumber(smoothness, 0.05, 1.5, DEFAULT_SMOOTHNESS);
  const safeLerp = clampNumber(lerp, 0.02, 1, DEFAULT_LERP);

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;

    const onChange = (event: MediaQueryListEvent) => {
      reduceMotionRef.current = event.matches;
      if (event.matches && imageContainerRef.current) {
        gsap.killTweensOf(imageContainerRef.current);
        gsap.set(imageContainerRef.current, { x: 0, y: 0 });
        pointerTargetRef.current = { x: 0, y: 0 };
        pointerCurrentRef.current = { x: 0, y: 0 };
      }
    };

    reduceMotionRef.current = mq.matches;
    if (mq.matches && imageContainerRef.current) {
      gsap.set(imageContainerRef.current, { x: 0, y: 0 });
      pointerTargetRef.current = { x: 0, y: 0 };
      pointerCurrentRef.current = { x: 0, y: 0 };
    }
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    let frameId: number;

    const tick = () => {
      const imageContainer = imageContainerRef.current;

      if (imageContainer && !reduceMotionRef.current) {
        const current = pointerCurrentRef.current;
        const target = pointerTargetRef.current;

        current.x += (target.x - current.x) * safeLerp;
        current.y += (target.y - current.y) * safeLerp;

        gsap.set(imageContainer, {
          x: current.x,
          y: current.y,
        });
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [safeLerp]);

  useEffect(() => {
    imageRefs.current.forEach((imageElement) => {
      if (!imageElement) return;

      if (reduceMotionRef.current) {
        gsap.set(imageElement, {
          clipPath: IMAGE_VISIBLE_CLIP_PATH,
          opacity: 0,
          visibility: IMAGE_VISIBILITY_HIDDEN,
        });
      } else {
        gsap.set(imageElement, {
          clipPath: IMAGE_HIDDEN_CLIP_PATH,
          visibility: IMAGE_VISIBILITY_HIDDEN,
          opacity: 0,
        });
      }
    });

    if (!highlightRef.current) return;

    gsap.set(highlightRef.current, {
      opacity: 0,
      y: 0,
      height: 0,
    });
  }, []);

  const getNextTweenGeneration = (index: number) => {
    tweenGenerationRef.current[index] =
      (tweenGenerationRef.current[index] || 0) + 1;

    return tweenGenerationRef.current[index];
  };

  const setImageRef = (index: number, element: HTMLDivElement | null) => {
    imageRefs.current[index] = element;
  };

  const setRowTextColor = (index: number, isActive: boolean) => {
    const rowElement = rowRefs.current[index];
    if (!rowElement) return;

    const cells = rowElement.querySelectorAll("td");
    if (isActive) {
      // Switch all text on active row to crisp deep obsidian #07090D against white highlight bar
      gsap.to(cells, {
        color: "#07090D",
        duration: safeSmoothness,
        ease: "power2.out",
        overwrite: "auto",
      });
      gsap.to(rowElement.querySelectorAll("*"), {
        color: "#07090D",
        duration: safeSmoothness,
        ease: "power2.out",
        overwrite: "auto",
      });
    } else {
      if (cells[0]) gsap.to(cells[0], { color: "#FFFFFF", duration: safeSmoothness, ease: "power2.out", overwrite: "auto" });
      if (cells[1]) gsap.to(cells[1], { color: "#A1A1AA", duration: safeSmoothness, ease: "power2.out", overwrite: "auto" });
      if (cells[2]) gsap.to(cells[2], { color: "#71717A", duration: safeSmoothness, ease: "power2.out", overwrite: "auto" });
    }
  };

  const moveHighlightToRow = (rowElement: HTMLTableRowElement | null) => {
    const tableElement = tableRef.current;
    const highlightElement = highlightRef.current;

    if (!tableElement || !highlightElement || !rowElement) return;

    const tableBounds = tableElement.getBoundingClientRect();
    const rowBounds = rowElement.getBoundingClientRect();

    gsap.to(highlightElement, {
      y: rowBounds.top - tableBounds.top,
      height: rowBounds.height,
      opacity: 1,
      duration: safeSmoothness,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const animateImageOut = (index: number) => {
    const imageElement = imageRefs.current[index];
    if (!imageElement) return;

    const tweenGeneration = getNextTweenGeneration(index);
    const reduceMotion = reduceMotionRef.current;

    gsap.killTweensOf(imageElement);

    gsap.to(imageElement, {
      ...(reduceMotion
        ? { opacity: 0 }
        : { clipPath: IMAGE_HIDDEN_CLIP_PATH, opacity: 0 }),
      duration: reduceMotion ? Math.min(safeSmoothness, 0.35) : safeDuration,
      ease: reduceMotion ? "power2.out" : "power3.inOut",
      onComplete: () => {
        if (tweenGenerationRef.current[index] !== tweenGeneration) return;

        gsap.set(imageElement, {
          visibility: IMAGE_VISIBILITY_HIDDEN,
        });
      },
    });
  };

  const onRowEnter = (rowElement: HTMLTableRowElement, index: number) => {
    const imageElement = imageRefs.current[index];
    if (!imageElement) return;

    const reduceMotion = reduceMotionRef.current;
    const previousIndex = activeIndexRef.current;

    pendingLeaveRef.current[index] = false;
    rowRefs.current[index] = rowElement;

    if (reduceMotion && previousIndex !== null && previousIndex !== index) {
      pendingLeaveRef.current[previousIndex] = false;
      animateImageOut(previousIndex);
    }

    zIndexRef.current += 1;
    const tweenGeneration = getNextTweenGeneration(index);

    gsap.killTweensOf(imageElement);

    if (reduceMotion) {
      gsap.set(imageElement, {
        zIndex: zIndexRef.current,
        visibility: IMAGE_VISIBILITY_VISIBLE,
        clipPath: IMAGE_VISIBLE_CLIP_PATH,
        opacity: 0,
      });

      gsap.to(imageElement, {
        opacity: 1,
        duration: Math.min(safeSmoothness, 0.35),
        ease: "power2.out",
        onComplete: () => {
          if (tweenGenerationRef.current[index] !== tweenGeneration) return;
          if (!pendingLeaveRef.current[index]) return;

          pendingLeaveRef.current[index] = false;
          animateImageOut(index);
        },
      });
    } else {
      gsap.set(imageElement, {
        zIndex: zIndexRef.current,
        visibility: IMAGE_VISIBILITY_VISIBLE,
        clipPath: IMAGE_HIDDEN_CLIP_PATH,
        opacity: 0,
      });

      gsap.to(imageElement, {
        clipPath: IMAGE_VISIBLE_CLIP_PATH,
        opacity: 1,
        duration: safeDuration,
        ease: "power2.inOut",
        onComplete: () => {
          if (tweenGenerationRef.current[index] !== tweenGeneration) return;
          if (!pendingLeaveRef.current[index]) return;

          pendingLeaveRef.current[index] = false;
          animateImageOut(index);
        },
      });
    }

    if (previousIndex !== null && previousIndex !== index) {
      setRowTextColor(previousIndex, false);
    }

    activeIndexRef.current = index;

    setRowTextColor(index, true);
    moveHighlightToRow(rowElement);
  };

  const onRowLeave = (index: number) => {
    const imageElement = imageRefs.current[index];
    if (!imageElement) return;

    if (gsap.isTweening(imageElement)) {
      pendingLeaveRef.current[index] = true;
      return;
    }

    animateImageOut(index);
  };

  const onTableLeave = () => {
    if (activeIndexRef.current !== null) {
      setRowTextColor(activeIndexRef.current, false);
      activeIndexRef.current = null;
    }

    if (!highlightRef.current) return;

    gsap.to(highlightRef.current, {
      opacity: 0,
      duration: safeSmoothness,
      ease: "power2.out",
      overwrite: "auto",
    });

    pointerTargetRef.current = { x: 0, y: 0 };
  };

  const onMouseMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (reduceMotionRef.current) return;
    if (!imageContainerRef.current) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    pointerTargetRef.current = {
      x: x * IMAGE_OFFSET_MULTIPLIER,
      y: y * IMAGE_OFFSET_MULTIPLIER,
    };
  };

  return (
    <div
      className={`relative w-full rounded-2xl border border-white/10 overflow-hidden font-mono text-white ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      {/* Desktop Interactive Table View */}
      <div
        className="relative min-h-[460px] w-full overflow-hidden max-lg:hidden select-none"
        onMouseMove={onMouseMove}
      >
        {/* Sliding Highlight Row Bar */}
        <div
          ref={highlightRef}
          className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-white"
        />

        {/* Floating Follower Card Container with Right-Hand Offset (z-30 pointer-events-none) */}
        <div
          ref={imageContainerRef}
          className="pointer-events-none absolute inset-0 z-30 flex items-center"
          style={enableMixBlend ? { mixBlendMode: "difference" } : undefined}
        >
          {items.map((item, index) => (
            <div
              key={`${item.client}-${index}`}
              ref={(element) => setImageRef(index, element)}
              className="invisible absolute right-8 sm:right-14 top-1/2 -translate-y-1/2 rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.95)] border border-white/20 overflow-hidden pointer-events-none z-30"
              style={{
                width: `${BASE_IMAGE_WIDTH_REM * safeImageSize}rem`,
                height: `${BASE_IMAGE_HEIGHT_REM * safeImageSize}rem`,
                willChange: "clip-path, opacity",
                zIndex: DEFAULT_IMAGE_Z_INDEX,
              }}
            >
              {item.preview ? (
                <div className="relative h-full w-full bg-[#07090D] border border-white/10 p-5 rounded-2xl shadow-2xl">
                  {item.preview}
                </div>
              ) : item.img ? (
                <img
                  src={item.img}
                  alt={item.client}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : null}
            </div>
          ))}
        </div>

        {/* Interactive Row Table */}
        <div
          ref={tableRef}
          className="relative w-full py-2"
          onMouseLeave={onTableLeave}
        >
          <table className="relative z-30 w-full table-fixed border-collapse">
            <colgroup>
              <col style={{ width: "32%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "52%" }} />
            </colgroup>

            <thead>
              <tr className="border-b border-white/10 text-[11px] uppercase tracking-widest text-zinc-500">
                <th className="px-8 py-5 text-left font-normal">Forensic Phase</th>
                <th className="px-8 py-5 text-left font-normal">Sequence</th>
                <th className="px-8 py-5 text-left font-normal">Engine Capability</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => (
                <tr
                  key={`${item.client}-${index}`}
                  className="border-b border-white/5 cursor-pointer transition-colors duration-150"
                  onMouseEnter={(event) =>
                    onRowEnter(event.currentTarget, index)
                  }
                  onMouseLeave={() => onRowLeave(index)}
                >
                  <td className="whitespace-nowrap px-8 py-7 sm:py-8 text-base font-bold uppercase tracking-wider text-white">
                    {item.client}
                  </td>

                  <td className="whitespace-nowrap px-8 py-7 sm:py-8 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                    {item.platform || `ACT 0${index + 1}`}
                  </td>

                  <td className="px-8 py-7 sm:py-8 pr-72 xl:pr-80 text-xs text-zinc-400 leading-relaxed font-normal">
                    {item.services}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Stacked View */}
      <div className="hidden w-full divide-y divide-white/10 font-mono text-white max-lg:block">
        {items.map((item, index) => (
          <div
            key={`${item.client}-${index}`}
            className="flex flex-col gap-4 p-5 sm:p-6"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {item.platform || `PHASE 0${index + 1}/05`}
              </span>
              <span className="text-[11px] text-zinc-500">
                Act 0{index + 1}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-base text-zinc-100 uppercase tracking-wide">
                {item.client}
              </h3>
              <p className="mt-1 text-xs text-zinc-400 leading-relaxed font-sans">
                {item.services}
              </p>
            </div>

            {item.preview && (
              <div className="w-full rounded-xl border border-white/10 bg-zinc-950/80 p-3 overflow-hidden shadow-md">
                {item.preview}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default InteractiveListPreview;
