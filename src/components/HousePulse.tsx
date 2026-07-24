/**
 * House Pulse — фірмова лінія-пульс, символ живої системи будинку.
 * Використовується дозовано: hero, розділювачі великих секцій,
 * фінальний CTA. Декоративна, прихована від assistive technologies.
 */
export default function HousePulse({
  className = "",
  tone = "blue",
}: {
  className?: string;
  tone?: "blue" | "dim";
}) {
  const stroke = tone === "blue" ? "#21b4ff" : "rgba(159,176,200,0.4)";

  return (
    <svg
      viewBox="0 0 640 40"
      fill="none"
      aria-hidden="true"
      className={`pointer-events-none w-full max-w-2xl ${className}`}
      preserveAspectRatio="none"
    >
      <path
        d="M0 20h180l14-8 12 16 10-24 12 32 10-16h22l10-6 10 6h180"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="house-pulse-line"
        opacity={0.8}
        pathLength={640}
      />
      <path
        d="M460 20h180"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity={0.25}
      />
    </svg>
  );
}
