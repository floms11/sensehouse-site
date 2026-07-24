/**
 * Фірмовий логотип Sense House.
 * Знак — з наданого logoSenseHouseV3.svg (контур будинку + схема),
 * оптимізований для малих розмірів: ті самі координати, без glow-фільтра
 * (на 24–32px він лише розмиває), градієнти вузлів збережені.
 *
 * idPrefix потрібен, коли логотип рендериться на сторінці кілька разів
 * (header + footer), щоб id градієнтів не дублювалися.
 */

type LogoMarkProps = {
  className?: string;
  idPrefix?: string;
};

export function LogoMark({ className = "", idPrefix = "sh" }: LogoMarkProps) {
  const cyan = `${idPrefix}-cyan`;
  const gold = `${idPrefix}-gold`;

  return (
    <svg viewBox="0 0 901 901" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={cyan} cx="35%" cy="25%" r="75%">
          <stop offset="0%" stopColor="#9FF2FF" />
          <stop offset="28%" stopColor="#42C8E9" />
          <stop offset="72%" stopColor="#27A9D6" />
          <stop offset="100%" stopColor="#1887BA" />
        </radialGradient>
        <radialGradient id={gold} cx="35%" cy="25%" r="75%">
          <stop offset="0%" stopColor="#FFF0B1" />
          <stop offset="32%" stopColor="#FFD571" />
          <stop offset="78%" stopColor="#FFC452" />
          <stop offset="100%" stopColor="#E8A83C" />
        </radialGradient>
      </defs>

      {/* Контур будинку */}
      <path
        d="M 200 486 L 200 408 L 158 408 L 158 386 L 452 180 L 555 257 L 555 208 L 631 208 L 631 312 L 744 387 L 744 408 L 707 408 L 707 486 M 707 535 L 707 718 L 477 718 M 427 718 L 200 718 L 200 535"
        fill="none"
        stroke="#D6E5EC"
        strokeWidth="26"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />

      {/* Схема */}
      <g
        fill="none"
        stroke="#2AA9D6"
        strokeWidth="18"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M 144 511 L 301 511 L 338 546 L 365 546 L 452 480 L 533 426 L 634 511 L 759 511" />
        <path d="M 452 480 L 452 259" />
        <path d="M 452 590 L 452 724" />
        <path d="M 452 590 L 549 535" />
        <path d="M 244 583 L 244 674 L 361 674" />
      </g>

      {/* Блакитні вузли */}
      <g fill={`url(#${cyan})`}>
        <circle cx="144" cy="511" r="30" />
        <circle cx="351" cy="553" r="33" />
        <circle cx="452" cy="369" r="33" />
        <circle cx="452" cy="259" r="30" />
        <circle cx="533" cy="426" r="33" />
        <circle cx="452" cy="590" r="33" />
        <circle cx="361" cy="674" r="30" />
      </g>

      {/* Жовті вузли */}
      <g fill={`url(#${gold})`}>
        <circle cx="659" cy="441" r="28" />
        <circle cx="759" cy="511" r="30" />
        <circle cx="549" cy="535" r="28" />
        <circle cx="244" cy="583" r="28" />
      </g>
    </svg>
  );
}

export default function Logo({
  className = "",
  idPrefix = "sh",
}: {
  className?: string;
  idPrefix?: string;
}) {
  return (
    <span
      className={`font-display inline-flex items-center gap-2.5 text-lg font-semibold tracking-wide text-silver select-none ${className}`}
    >
      <LogoMark className="size-8" idPrefix={idPrefix} />
      Sense&nbsp;House
    </span>
  );
}
