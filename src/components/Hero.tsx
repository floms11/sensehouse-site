import type { CSSProperties } from "react";
import CTAButton from "./CTAButton";
import HeroScene from "./HeroScene";
import { site } from "@/config/site";

/** CSS-only reveal: hero не чекає на hydration (важливо для LCP). */
function introDelay(ms: number): CSSProperties {
  return { "--reveal-delay": `${ms}ms` } as CSSProperties;
}

export default function Hero() {
  return (
    <section
      id="top"
      className="blueprint-grid relative overflow-hidden pt-32 pb-16 sm:pt-40 lg:pb-24"
    >
      {/* Мʼяке світіння за сценою */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 right-[-10%] h-[36rem] w-[36rem] rounded-full bg-blue/[0.06] blur-3xl"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-10">
        <div className="relative z-10">
          <p
            className="intro font-display mb-5 text-[0.8rem] font-medium tracking-[0.22em] text-blue uppercase"
            style={introDelay(0)}
          >
            {site.tagline}
          </p>

          <h1
            className="intro text-balance text-4xl leading-[1.08] font-bold tracking-tight text-silver sm:text-5xl lg:text-[3.5rem]"
            style={introDelay(100)}
          >
            Будинок, у якому все працює як&nbsp;одне ціле.
          </h1>

          <p
            className="intro mt-6 max-w-lg text-base leading-relaxed text-silver-dim sm:text-lg"
            style={introDelay(200)}
          >
            Проєктуємо, монтуємо та налаштовуємо електрику, світло, клімат,
            безпеку, мережу й сценарії — від першого креслення до запуску
            системи.
          </p>

          <div
            className="intro mt-9 flex flex-col gap-3 xs:flex-row xs:items-center"
            style={introDelay(300)}
          >
            <CTAButton href="#contact" size="lg" event="hero_cta_click">
              Обговорити проєкт
            </CTAButton>
            <CTAButton
              href={`tel:${site.phone.e164}`}
              variant="ghost"
              size="lg"
              event="phone_click"
              eventParams={{ placement: "hero" }}
            >
              Зателефонувати
            </CTAButton>
          </div>

          <p
            className="intro mt-7 text-sm text-silver-dim/80"
            style={introDelay(400)}
          >
            {site.geo.primary} та {site.geo.region}. {site.geo.note}
          </p>
        </div>

        <div className="intro relative" style={introDelay(250)}>
          <HeroScene className="h-auto w-full drop-shadow-[0_40px_60px_rgba(3,8,20,0.5)]" />
        </div>
      </div>
    </section>
  );
}
