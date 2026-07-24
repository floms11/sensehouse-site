"use client";

import { useEffect, useRef } from "react";
import ContactActions from "./ContactActions";
import HousePulse from "./HousePulse";
import LeadForm from "./LeadForm";
import Reveal from "./Reveal";
import { site } from "@/config/site";
import { trackEvent } from "@/lib/analytics";

/**
 * Фінальний CTA: заголовок, форма заявки та контакти поруч.
 */
export default function FinalCTA() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackEvent("final_cta_view");
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
      ref={ref}
      id="contact"
      className="blueprint-grid relative scroll-mt-24 overflow-hidden py-24 sm:py-32"
    >
      {/* Мʼяке світіння за формою */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 h-[28rem] w-[44rem] -translate-x-1/2 rounded-full bg-blue/[0.07] blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <HousePulse className="mx-auto mb-10 h-8" />
          <h2 className="text-balance text-3xl leading-[1.12] font-bold tracking-tight text-silver sm:text-4xl lg:text-[2.75rem]">
            Розкажіть, на якому етапі ваш будинок.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-silver-dim sm:text-lg">
            Обговоримо ваші побажання, визначимо потрібні системи та підкажемо,
            з чого почати.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:mt-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-16">
          <Reveal delay={100}>
            <LeadForm />
          </Reveal>

          <Reveal delay={200} className="lg:pt-2">
            <h3 className="font-display text-[0.8rem] font-medium tracking-[0.22em] text-blue uppercase">
              Контакти
            </h3>
            <div className="mt-6">
              <ContactActions layout="full" />
            </div>

            <div className="mt-10 border-t border-silver/10 pt-8">
              <h3 className="font-display text-[0.8rem] font-medium tracking-[0.22em] text-blue uppercase">
                Географія
              </h3>
              <p className="mt-4 leading-relaxed text-silver/90">
                {site.geo.primary} та {site.geo.region}.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-silver-dim">
                {site.geo.note} Виїзд в інші міста — з оплатою відрядження та
                проживання команди.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
