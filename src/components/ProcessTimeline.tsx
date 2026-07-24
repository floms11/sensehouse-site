"use client";

import { useEffect, useRef } from "react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { trackEvent } from "@/lib/analytics";

const steps = [
  {
    num: "01",
    title: "Знайомство з обʼєктом",
    action:
      "Обговорюємо плани будинку, етап робіт, побутові звички та критичні системи.",
    result: "Результат: зафіксовані задачі й межі проєкту.",
  },
  {
    num: "02",
    title: "Технічне завдання",
    action:
      "Узгоджуємо точки, сценарії, пріоритети, резервне живлення та майбутні інтеграції.",
    result: "Результат: зрозумілий склад систем до початку креслень.",
  },
  {
    num: "03",
    title: "Технічний проєкт",
    action:
      "Готуємо плани, кабельний журнал, схеми щитів, специфікації та логіку керування.",
    result: "Результат: комплект документації для реалізації й контролю.",
  },
  {
    num: "04",
    title: "Монтаж і фіксація",
    action:
      "Прокладаємо та маркуємо лінії, збираємо щити, фіксуємо приховані роботи.",
    result: "Результат: система змонтована відповідно до проєкту.",
  },
  {
    num: "05",
    title: "Перевірка та запуск",
    action:
      "Перевіряємо підключення, налаштовуємо сценарії, передаємо документацію й пояснюємо керування.",
    result: "Результат: готова система та контакт для подальшої підтримки.",
  },
];

export default function ProcessTimeline() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackEvent("process_section_view");
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="process"
      aria-labelledby="process-title"
      className="relative overflow-hidden bg-navy-deep/55 py-24 sm:py-32"
    >
      <div aria-hidden="true" className="blueprint-grid absolute inset-0 opacity-50" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Як працюємо"
          title={<span id="process-title">Від першої розмови до керованої системи</span>}
          description="На кожному етапі є конкретний результат, який можна перевірити до переходу далі."
        />

        <ol className="relative mt-14 border-t border-silver/12 lg:mt-20">
          {steps.map((step, index) => (
            <Reveal
              as="li"
              key={step.num}
              delay={index * 70}
              className="grid gap-4 border-b border-silver/12 py-7 sm:grid-cols-[4rem_minmax(12rem,.75fr)_minmax(0,1fr)] sm:gap-7 lg:py-9"
            >
              <span className="font-display text-sm font-medium tracking-[0.2em] text-blue">
                {step.num}
              </span>
              <h3 className="text-xl font-bold tracking-tight text-silver">
                {step.title}
              </h3>
              <div>
                <p className="text-[0.95rem] leading-relaxed text-silver-dim">
                  {step.action}
                </p>
                <p className="mt-3 text-sm font-semibold leading-relaxed text-silver">
                  {step.result}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
