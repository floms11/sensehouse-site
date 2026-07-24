"use client";

import { useEffect, useRef } from "react";

type SmartLineProps = {
  /** SVG path у координатах viewBox */
  d: string;
  viewBox: string;
  /** Точки-сигнали [x, y, колір?] */
  dots?: Array<[number, number, ("blue" | "gold")?]>;
  className?: string;
  strokeWidth?: number;
};

/**
 * Smart Line — тонка інженерна лінія Electric Blue,
 * що промальовується під час прокручування.
 * Суто декоративна: прихована від assistive technologies.
 */
export default function SmartLine({
  d,
  viewBox,
  dots = [],
  className = "",
  strokeWidth = 1.5,
}: SmartLineProps) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    path.style.setProperty("--line-length", `${length}`);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          path.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(path);
    return () => observer.disconnect();
  }, []);

  return (
    <svg
      viewBox={viewBox}
      fill="none"
      aria-hidden="true"
      className={`pointer-events-none ${className}`}
      preserveAspectRatio="none"
    >
      <path
        ref={pathRef}
        d={d}
        stroke="#21b4ff"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        className="draw-line"
        opacity={0.7}
      />
      {dots.map(([x, y, color = "blue"], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={3}
          fill={color === "gold" ? "#f4c45b" : "#21b4ff"}
          className="signal-dot"
          style={{ animationDelay: `${i * 0.6}s` }}
        />
      ))}
    </svg>
  );
}
