"use client";

import type { ReactNode } from "react";
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

export default function CTAButton({
  href,
  children,
  variant = "primary",
  size = "md",
  event,
  eventParams,
  className = "",
}: CTAButtonProps) {
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
      href={href}
      onClick={() => event && trackEvent(event, eventParams)}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-button text-center transition-[background-color,border-color,box-shadow,color,filter] duration-200 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </a>
  );
}
