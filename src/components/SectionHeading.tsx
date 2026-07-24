import type { ReactNode } from "react";
import Reveal from "./Reveal";

type SectionHeadingProps = {
  /** Малий технічний надпис над заголовком, напр. "02 — Підхід" */
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  /** Світла секція (Soft Silver) — інверсія кольорів тексту */
  onLight?: boolean;
  align?: "left" | "center";
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  onLight = false,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  const alignCls = align === "center" ? "text-center mx-auto" : "";

  return (
    <Reveal className={`max-w-2xl ${alignCls} ${className}`}>
      {eyebrow && (
        <p
          className={`mb-4 text-[0.76rem] font-semibold tracking-[0.18em] uppercase ${
            onLight ? "text-navy/60" : "text-blue"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`text-balance text-3xl leading-[1.12] font-bold tracking-tight sm:text-4xl lg:text-[2.75rem] ${
          onLight ? "text-navy" : "text-silver"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-5 max-w-xl text-base leading-relaxed sm:text-lg ${
            onLight ? "text-navy/70" : "text-silver-dim"
          } ${align === "center" ? "mx-auto" : ""}`}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
