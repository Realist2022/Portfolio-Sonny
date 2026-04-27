"use client";

import { useEffect, useMemo, useRef } from "react";

interface TechScrollBarProps {
  filters: string[];
  selectedFilter: string;
  onSelect: (tech: string) => void;
}

const ARROW_STEP = 100;

function escTech(s: string): string {
  if (typeof window !== "undefined") {
    return CSS.escape(s);
  }
  return String(s).replace(/["\\]/g, "\\$&");
}

function findNearestNode(
  track: HTMLElement,
  tech: string
): { node: Element; trackRect: DOMRect } | null {
  const nodes = track.querySelectorAll(`[data-tech="${escTech(tech)}"]`);
  if (!nodes.length) return null;
  const trackRect = track.getBoundingClientRect();
  const trackCenter = trackRect.left + trackRect.width / 2;
  let best: Element | null = null;
  let bestDist = Infinity;
  nodes.forEach((n) => {
    const r = n.getBoundingClientRect();
    const c = r.left + r.width / 2;
    const d = Math.abs(c - trackCenter);
    if (d < bestDist) {
      bestDist = d;
      best = n;
    }
  });
  return best ? { node: best, trackRect } : null;
}

function centerOnNode(
  track: HTMLElement,
  node: Element,
  trackRect: DOMRect,
  smooth = true
): void {
  const itemRect = node.getBoundingClientRect();
  const deltaToCenter =
    itemRect.left - trackRect.left + itemRect.width / 2 - trackRect.width / 2;
  const targetLeft = Math.min(
    track.scrollWidth - track.clientWidth,
    Math.max(0, track.scrollLeft + deltaToCenter)
  );
  track.scrollTo({ left: targetLeft, behavior: smooth ? "smooth" : "auto" });
}

function centerTech(track: HTMLElement, tech: string, smooth = true): void {
  const res = findNearestNode(track, tech);
  if (!res) return;
  centerOnNode(track, res.node, res.trackRect, smooth);
}

function centerSecondAll(track: HTMLElement, smooth = true): void {
  const nodes = track.querySelectorAll('[data-tech="__ALL__"]');
  const targetNode = nodes.length > 1 ? nodes[1] : nodes[0];
  if (!targetNode) return;
  const trackRect = track.getBoundingClientRect();
  centerOnNode(track, targetNode, trackRect, smooth);
}

export default function TechScrollBar({
  filters,
  selectedFilter,
  onSelect,
}: TechScrollBarProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const lastScrollYRef = useRef<number>(
    typeof window !== "undefined" ? window.scrollY : 0
  );
  const lastCenterTsRef = useRef<number>(0);
  const isInitialLoad = useRef<boolean>(true);

  const baseItems = useMemo(() => ["__ALL__", ...filters], [filters]);
  const loopItems = useMemo(() => [...baseItems, ...baseItems], [baseItems]);

  // Center on selected filter whenever it changes
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    if (isInitialLoad.current) {
      centerSecondAll(track, false);
      isInitialLoad.current = false;
      return;
    }
    if (selectedFilter) {
      centerTech(track, selectedFilter, true);
    } else {
      centerSecondAll(track, true);
    }
  }, [selectedFilter]);

  // Re-center on window scroll and resize
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let rafId = 0;

    const recenter = () => {
      const now = performance.now();
      if (now - lastCenterTsRef.current <= 150) return;
      lastCenterTsRef.current = now;
      if (selectedFilter) centerTech(track, selectedFilter, true);
      else centerSecondAll(track, true);
    };

    const onWindowScroll = () => {
      if (!track || track.scrollWidth <= track.clientWidth) return;
      const currY = window.scrollY || document.documentElement.scrollTop || 0;
      const rawDelta = currY - lastScrollYRef.current;
      lastScrollYRef.current = currY;
      if (rawDelta !== 0) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(recenter);
      }
    };

    const onResize = () => {
      if (selectedFilter) centerTech(track, selectedFilter, false);
      else centerSecondAll(track, false);
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onWindowScroll, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onWindowScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [selectedFilter]);

  return (
    <div className="flex items-center gap-2">
      {/* Left arrow */}
      <button
        onClick={() =>
          trackRef.current?.scrollBy({ left: -ARROW_STEP, behavior: "smooth" })
        }
        aria-label="Scroll left"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[rgba(255,75,31,0.35)] bg-[rgba(255,75,31,0.06)] text-[#ffc3b1] transition hover:border-[rgba(255,75,31,0.7)] hover:bg-[rgba(255,75,31,0.14)] hover:text-white"
      >
        ‹
      </button>

      {/* Scrollable track */}
      <div
        ref={trackRef}
        tabIndex={0}
        aria-label="Technology filters"
        className="flex gap-2 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {loopItems.map((tech, i) => {
          const isAll = tech === "__ALL__";
          const isActive =
            (isAll && !selectedFilter) ||
            (!isAll && selectedFilter === tech);
          return (
            <span
              key={`${i}-${tech}`}
              data-tech={isAll ? "__ALL__" : tech}
              role="button"
              aria-pressed={isActive}
              title={isAll ? "Show all" : `Filter by ${tech}`}
              onClick={() => onSelect(isAll ? "" : tech)}
              className={[
                "inline-flex shrink-0 cursor-pointer items-center rounded-full border px-4 py-1.5 text-sm font-semibold transition select-none",
                isActive
                  ? "border-[rgba(255,75,31,0.9)] bg-[#ff4b1f] text-[#1b0905]"
                  : "border-[rgba(255,75,31,0.35)] bg-[rgba(255,75,31,0.06)] text-[#ffc3b1] hover:border-[rgba(255,75,31,0.65)] hover:bg-[rgba(255,75,31,0.12)] hover:text-white",
              ].join(" ")}
            >
              {isAll ? "All" : tech}
            </span>
          );
        })}
      </div>

      {/* Right arrow */}
      <button
        onClick={() =>
          trackRef.current?.scrollBy({ left: ARROW_STEP, behavior: "smooth" })
        }
        aria-label="Scroll right"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[rgba(255,75,31,0.35)] bg-[rgba(255,75,31,0.06)] text-[#ffc3b1] transition hover:border-[rgba(255,75,31,0.7)] hover:bg-[rgba(255,75,31,0.14)] hover:text-white"
      >
        ›
      </button>
    </div>
  );
}
