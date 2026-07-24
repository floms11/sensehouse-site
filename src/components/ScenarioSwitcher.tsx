"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { trackEvent } from "@/lib/analytics";

type SceneState = {
  /** 0..1 — інтенсивність шарів освітлення сцени */
  warm: number;
  cool: number;
  night: number;
  curtains: number; // 0 — відкриті, 1 — закриті
  security: boolean;
  gate: boolean;
  water: boolean;
};

type Scenario = {
  id: string;
  label: string;
  title: string;
  points: string[];
  scene: SceneState;
};

const scenarios: Scenario[] = [
  {
    id: "evening",
    label: "Вечір",
    title: "Будинок створює атмосферу без зайвих дій",
    points: [
      "Світло переходить у мʼякий теплий режим",
      "Штори закриваються",
      "Клімат тримає комфортну температуру",
    ],
    scene: { warm: 1, cool: 0.15, night: 0.35, curtains: 1, security: false, gate: false, water: false },
  },
  {
    id: "away",
    label: "Не вдома",
    title: "Система пильнує, поки вас немає",
    points: [
      "Зайве освітлення вимикається",
      "Клімат переходить в економний режим",
      "Безпека активна: вікна, двері, протікання — під контролем",
    ],
    scene: { warm: 0, cool: 0.1, night: 0.9, curtains: 1, security: true, gate: false, water: false },
  },
  {
    id: "return",
    label: "Повернення",
    title: "Будинок зустрічає вас готовим",
    points: [
      "Ворота відчиняються назустріч",
      "Вмикається потрібне світло",
      "Клімат повертається в комфортний режим",
    ],
    scene: { warm: 0.7, cool: 0.5, night: 0.45, curtains: 0, security: false, gate: true, water: false },
  },
  {
    id: "alert",
    label: "Аварійна ситуація",
    title: "Реакція швидша, ніж ви дістанете телефон",
    points: [
      "Система фіксує протікання",
      "Вода автоматично перекривається",
      "Ви одразу отримуєте сповіщення",
    ],
    scene: { warm: 0.25, cool: 0.9, night: 0.6, curtains: 0.5, security: true, gate: false, water: true },
  },
];

/** Інтерʼєрна сцена, освітлення якої змінюється між сценаріями. */
function Scene({ s }: { s: SceneState }) {
  return (
    <svg
      viewBox="0 0 800 460"
      fill="none"
      role="img"
      aria-label="Схематичний інтерʼєр вітальні, освітлення якого змінюється залежно від обраного сценарію"
      className="h-auto w-full"
    >
      <defs>
        <linearGradient id="sc-night" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#050f26" />
          <stop offset="1" stopColor="#0a1f44" />
        </linearGradient>
        <radialGradient id="sc-warm" cx="0.5" cy="0.1" r="0.9">
          <stop offset="0" stopColor="#f4c45b" stopOpacity="0.4" />
          <stop offset="0.6" stopColor="#f4c45b" stopOpacity="0.1" />
          <stop offset="1" stopColor="#f4c45b" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sc-cool" cx="0.15" cy="0.2" r="1">
          <stop offset="0" stopColor="#21b4ff" stopOpacity="0.16" />
          <stop offset="1" stopColor="#21b4ff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Кімната */}
      <rect width="800" height="460" fill="#0b1830" />
      {/* Панорамне вікно з нічним небом */}
      <rect x="60" y="60" width="330" height="280" fill="url(#sc-night)" stroke="#e8edf3" strokeOpacity="0.3" />
      <line x1="225" y1="60" x2="225" y2="340" stroke="#0b1830" strokeWidth="5" />
      {/* Місяць */}
      <circle cx="330" cy="110" r="14" stroke="#e8edf3" strokeOpacity="0.5" fill="none" />

      {/* Нічний шар (затемнення кімнати) */}
      <rect width="800" height="460" fill="#040b1c" className="scene-layer" opacity={s.night * 0.55} />

      {/* Штори: масштабуються від країв вікна до центру */}
      <g opacity={0.92}>
        <rect
          x="60"
          y="60"
          width="160"
          height="280"
          fill="#1b2435"
          stroke="#e8edf3"
          strokeOpacity="0.18"
          style={{
            transform: `scaleX(${0.14 + s.curtains * 0.86})`,
            transformOrigin: "60px 0",
            transition: "transform 0.9s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
        <rect
          x="230"
          y="60"
          width="160"
          height="280"
          fill="#1b2435"
          stroke="#e8edf3"
          strokeOpacity="0.18"
          style={{
            transform: `scaleX(${0.14 + s.curtains * 0.86})`,
            transformOrigin: "390px 0",
            transition: "transform 0.9s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      </g>

      {/* Меблі — тонкі силуети */}
      <g stroke="#e8edf3" strokeOpacity="0.55" strokeWidth="1.5">
        {/* Диван */}
        <path d="M470 300h220a16 16 0 0 1 16 16v44H454v-44a16 16 0 0 1 16-16Z" />
        <path d="M470 300v-28a12 12 0 0 1 12-12h196a12 12 0 0 1 12 12v28" />
        <line x1="454" y1="360" x2="454" y2="376" />
        <line x1="706" y1="360" x2="706" y2="376" />
        {/* Столик */}
        <line x1="330" y1="392" x2="410 " y2="392" />
        <line x1="342" y1="392" x2="342" y2="410" />
        <line x1="398" y1="392" x2="398" y2="410" />
        {/* Підвісний світильник */}
        <line x1="580" y1="0" x2="580" y2="96" />
        <path d="M556 96h48l-8 20h-32l-8-20Z" />
      </g>

      {/* Тепле світло */}
      <ellipse cx="580" cy="130" rx="240" ry="150" fill="url(#sc-warm)" className="scene-layer" opacity={s.warm} />
      <path d="M556 116h48" stroke="#f4c45b" strokeWidth="3" strokeLinecap="round" className="scene-layer" opacity={s.warm} />

      {/* Холодне технологічне світло */}
      <rect width="800" height="460" fill="url(#sc-cool)" className="scene-layer" opacity={s.cool} />

      {/* Лінія підлоги */}
      <line x1="40" y1="420" x2="760" y2="420" stroke="#e8edf3" strokeOpacity="0.25" strokeWidth="1.5" />

      {/* Безпека: периметр вікна */}
      <g className="scene-layer" opacity={s.security ? 1 : 0}>
        <rect x="54" y="54" width="342" height="292" stroke="#21b4ff" strokeOpacity="0.7" strokeDasharray="6 8" fill="none" />
        <circle cx="396" cy="54" r="4" fill="#21b4ff" className="signal-dot" />
      </g>

      {/* Ворота / зустріч (right edge glow) */}
      <g className="scene-layer" opacity={s.gate ? 1 : 0}>
        <path d="M744 420V300" stroke="#f4c45b" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" />
        <circle cx="744" cy="294" r="4" fill="#f4c45b" className="signal-dot" />
      </g>

      {/* Вода: вузол перекриття */}
      <g className="scene-layer" opacity={s.water ? 1 : 0}>
        <path d="M120 420v24h96" stroke="#21b4ff" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="222" cy="444" r="4.5" fill="#21b4ff" className="signal-dot" />
        <path
          d="M222 430c4 6 7 9 7 13a7 7 0 1 1-14 0c0-4 3-7 7-13Z"
          stroke="#21b4ff"
          strokeWidth="1.5"
          fill="none"
        />
        <line x1="214" y1="452" x2="230" y2="436" stroke="#21b4ff" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/**
 * Секція «Можливості»: чотири життєві сценарії з інтерактивним
 * перемиканням атмосфери одного інтерʼєру.
 */
export default function ScenarioSwitcher() {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const select = (index: number, viaKeyboard = false) => {
    setActive(index);
    trackEvent("scenario_change", { scenario: scenarios[index].id });
    if (viaKeyboard) tabRefs.current[index]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const dir =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? -1
          : 0;
    if (!dir) return;
    e.preventDefault();
    select((active + dir + scenarios.length) % scenarios.length, true);
  };

  const current = scenarios[active];

  return (
    <div className="mt-12 lg:mt-16">
      {/* Перемикач */}
      <div
        role="tablist"
        aria-label="Сценарії роботи будинку"
        onKeyDown={onKeyDown}
        className="flex flex-wrap gap-2"
      >
        {scenarios.map((s, i) => (
          <button
            key={s.id}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            role="tab"
            id={`${baseId}-tab-${s.id}`}
            aria-selected={i === active}
            aria-controls={`${baseId}-panel`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => select(i)}
            className={`min-h-11 rounded-button px-5 py-2.5 text-[0.92rem] font-medium transition-[background-color,color,border-color] duration-300 ${
              i === active
                ? "bg-blue text-navy-deep"
                : "border border-silver/20 text-silver-dim hover:border-blue/50 hover:text-silver"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Сцена + опис */}
      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${current.id}`}
        className="mt-8 grid items-center gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"
      >
        <div className="overflow-hidden rounded-card border border-silver/10 shadow-card">
          <Scene s={current.scene} />
        </div>

        <div>
          <h3 className="text-balance text-2xl font-bold tracking-tight text-silver">
            {current.title}
          </h3>
          <ul className="mt-6 space-y-4" aria-live="polite">
            {current.points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-silver/90">
                <svg viewBox="0 0 20 20" className="mt-1 size-4 shrink-0 text-blue" aria-hidden="true">
                  <path
                    d="M3 10h5l2-4 3 8 2-4h2"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {point}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm leading-relaxed text-silver-dim">
            Сценарії налаштовуються під ваш спосіб життя під час
            пусконалагодження — і змінюються разом із ним.
          </p>
        </div>
      </div>
    </div>
  );
}
