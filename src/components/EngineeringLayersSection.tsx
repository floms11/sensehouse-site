import type { CSSProperties } from "react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const layers = [
  {
    num: "01",
    title: "Живлення та захист",
    text: "Ввід, розподіл навантажень, кабельні лінії та електрощити.",
  },
  {
    num: "02",
    title: "Безперервність роботи",
    text: "Резервне живлення, критичні групи та контроль споживання.",
  },
  {
    num: "03",
    title: "Мережа та безпека",
    text: "Дротова мережа, Wi‑Fi, відеоспостереження та контроль доступу.",
  },
  {
    num: "04",
    title: "Керування й автоматизація",
    text: "Освітлення, інтеграція клімату, сценарії та контроль систем.",
  },
];

/**
 * Чотири взаємоповʼязані рівні інженерної системи обʼєкта,
 * зʼєднані вертикальною Smart Line, що промальовується під час появи.
 */
export default function EngineeringLayersSection() {
  return (
    <section
      id="system"
      aria-labelledby="system-title"
      className="relative py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)] lg:gap-20">
          <SectionHeading
            eyebrow="Одна система"
            title={
              <span id="system-title">
                Інженерна система обʼєкта — від живлення до керування
              </span>
            }
            description="Кожен рівень спирається на попередній: рішення про щити впливають на резерв, мережа — на камери й керування. Тому ми проєктуємо їх не окремо, а як одну систему."
          />

          <Reveal className="relative">
            <svg
              aria-hidden="true"
              viewBox="0 0 2 100"
              preserveAspectRatio="none"
              className="absolute top-8 bottom-8 left-[calc(1.25rem-1px)] h-[calc(100%-4rem)] w-0.5"
            >
              {/*
                Без vector-effect: у Chrome non-scaling-stroke переводить
                stroke-dasharray в екранні пікселі та розриває лінію.
                Ширина штриха стабільна, бо x-масштаб viewBox дорівнює 1.
              */}
              <path
                d="M1 0v100"
                pathLength="100"
                stroke="#21b4ff"
                strokeOpacity="0.5"
                strokeWidth="2"
                fill="none"
                className="draw-line"
                style={{ "--line-length": "100" } as CSSProperties}
              />
            </svg>

            <ol>
              {layers.map((layer, index) => (
                <Reveal
                  as="li"
                  key={layer.num}
                  delay={index * 120}
                  className="relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-5 pb-10 last:pb-0 sm:gap-6"
                >
                  <span
                    aria-hidden="true"
                    className="font-display flex size-10 items-center justify-center rounded-full border border-blue/50 bg-navy text-xs font-semibold tracking-[0.08em] text-blue"
                  >
                    {layer.num}
                  </span>
                  <div className="pt-1.5">
                    <h3 className="text-lg font-bold tracking-tight text-silver sm:text-xl">
                      {layer.title}
                    </h3>
                    <p className="mt-2 max-w-xl text-[0.95rem] leading-relaxed text-silver-dim">
                      {layer.text}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </Reveal>
        </div>

        <Reveal className="mt-14 border-l border-gold/70 pl-5 lg:mt-16">
          <p className="max-w-3xl text-sm leading-relaxed text-silver-dim sm:text-base">
            Коли системи узгоджені ще на етапі проєкту, вони не конфліктують
            під час монтажу, залишаються зрозумілими в експлуатації та
            готовими до майбутнього розширення.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
