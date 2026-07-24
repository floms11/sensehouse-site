"use client";

import { useEffect, useRef } from "react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { trackEvent } from "@/lib/analytics";

const steps = [
  {
    num: "01",
    title: "Консультація",
    text: "Визначаємо тип обʼєкта, етап будівництва, площу та побажання щодо електрики, комфорту, безпеки, клімату й резервного живлення.",
  },
  {
    num: "02",
    title: "Технічний проєкт",
    text: "Формуємо плани розеток, вимикачів, освітлення, кабельні траси, щитову, перелік матеріалів і логіку системи. Технічний проєкт є платним.",
  },
  {
    num: "03",
    title: "Монтаж та інтеграція",
    text: "Прокладаємо кабелі, монтуємо щити, мережеве обладнання, електрику, автоматику та необхідні підсистеми.",
  },
  {
    num: "04",
    title: "Запуск і підтримка",
    text: "Налаштовуємо сценарії, перевіряємо систему, навчаємо вас і допомагаємо після здачі обʼєкта.",
  },
];

/**
 * Секція «Етапи»: чотири кроки на одній вертикальній Smart Line
 * (mobile) / горизонтальному маршруті (desktop).
 */
export default function ProcessTimeline() {
  const sectionRef = useRef<HTMLElement>(null);

  // Аналітика: перегляд секції процесу
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackEvent("process_section_view");
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative scroll-mt-24 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Етапи"
          title="Чотири кроки до будинку, який працює на вас"
          description="Кожен етап має зрозумілий результат: ви завжди знаєте, що вже зроблено і що буде далі."
        />

        <ol className="relative mt-14 grid gap-12 lg:mt-20 lg:grid-cols-4 lg:gap-8">
          {/* Горизонтальна лінія маршруту (desktop) */}
          <div
            aria-hidden="true"
            className="absolute top-[1.35rem] right-[12%] left-[3%] hidden h-px bg-gradient-to-r from-blue/60 via-blue/25 to-blue/60 lg:block"
          />
          {/* Вертикальна лінія (mobile) */}
          <div
            aria-hidden="true"
            className="absolute top-2 bottom-6 left-[1.35rem] w-px bg-gradient-to-b from-blue/60 via-blue/25 to-blue/60 lg:hidden"
          />

          {steps.map((step, i) => (
            <Reveal as="li" key={step.num} delay={i * 120} className="relative pl-16 lg:pl-0">
              {/* Вузол на лінії */}
              <div
                aria-hidden="true"
                className="absolute top-0 left-0 flex size-11 items-center justify-center lg:relative lg:mb-6"
              >
                <span
                  className={`absolute inset-0 rounded-full border ${
                    i === 3 ? "border-gold/60" : "border-blue/40"
                  }`}
                />
                <span
                  className={`signal-dot size-2 rounded-full ${
                    i === 3 ? "bg-gold" : "bg-blue"
                  }`}
                  style={{ animationDelay: `${i * 0.5}s` }}
                />
              </div>

              <p className="font-display text-sm font-medium tracking-[0.2em] text-blue">
                {step.num}
              </p>
              <h3 className="mt-2 text-xl font-bold tracking-tight text-silver">
                {step.title}
              </h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-silver-dim">
                {step.text}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
