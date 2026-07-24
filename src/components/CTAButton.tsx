"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

type CTAButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost" | "gold";
  size?: "md" | "lg";
  event?: AnalyticsEvent;
  eventParams?: Record<string, string>;
  className?: string;
};

/**
 * Головна кнопка дії з subtle magnetic hover.
 * Магнітний зсув мінімальний (до 3px) і вимикається
 * для prefers-reduced-motion та touch-пристроїв.
 */
export default function CTAButton({
  href,
  children,
  variant = "primary",
  size = "md",
  event,
  eventParams,
  className = "",
}: CTAButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const dy = (e.clientY - rect.top - rect.height / 2) / rect.height;
    el.style.translate = `${dx * 6}px ${dy * 4}px`;
  };

  const onMouseLeave = () => {
    if (ref.current) ref.current.style.translate = "0 0";
  };

  const variants: Record<string, string> = {
    primary:
      "bg-blue text-navy-deep font-semibold hover:bg-blue-soft hover:shadow-glow-blue active:bg-blue",
    ghost:
      "border border-silver/25 text-silver font-medium hover:border-blue/60 hover:text-blue-soft active:border-blue",
    gold: "bg-gold text-navy-deep font-semibold hover:brightness-110 active:brightness-95",
  };

  const sizes: Record<string, string> = {
    md: "px-6 py-3 text-[0.95rem]",
    lg: "px-8 py-4 text-base",
  };

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={() => event && trackEvent(event, eventParams)}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-button transition-[background-color,border-color,box-shadow,color,filter,translate] duration-300 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </a>
  );
}
