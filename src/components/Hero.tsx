import CTAButton from "./CTAButton";
import HeroScene from "./HeroScene";
import { site } from "@/config/site";

export default function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="blueprint-grid relative isolate min-h-[min(900px,100svh)] overflow-hidden pt-28 pb-14 sm:pt-36 sm:pb-20 xl:flex xl:items-center xl:pt-32"
    >
      <div
        aria-hidden="true"
        className="absolute top-1/4 right-[-12rem] -z-10 size-[36rem] rounded-full bg-blue/[0.07] blur-3xl"
      />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 sm:px-8 xl:grid-cols-[minmax(0,1.02fr)_minmax(30rem,.98fr)] xl:gap-8">
        <div className="relative z-10">
          <p className="mb-5 flex items-center gap-3 text-[0.76rem] font-semibold tracking-[0.18em] text-blue uppercase">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-gold" />
            {site.geo.primary} · {site.geo.region}
          </p>

          <h1
            id="hero-title"
            className="text-balance text-[clamp(2.45rem,6vw,4.6rem)] leading-[1.02] font-bold tracking-[-0.045em] text-silver"
          >
            Електрика та інженерні системи під ключ
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-silver-dim sm:text-lg">
            Проєктуємо, монтуємо й запускаємо електрику та розумний дім:
            електрощити, освітлення, клімат, безпеку, резервне живлення й
            мережу — з єдиною логікою керування та технічною документацією.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <CTAButton href="#contact" size="lg" event="hero_cta_click">
              Обговорити проєкт
            </CTAButton>
            <CTAButton
              href="#process"
              variant="ghost"
              size="lg"
            >
              Дізнатися, як ми працюємо
            </CTAButton>
          </div>

          <a
            href={`tel:${site.phone.e164}`}
            className="mt-7 inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-silver transition-colors hover:text-blue-soft"
          >
            <span aria-hidden="true" className="h-px w-7 bg-blue/70" />
            {site.phone.display}
          </a>
        </div>

        <div
          className="is-visible relative overflow-hidden rounded-[1.5rem] border border-silver/10 bg-navy-deep/55 p-1 shadow-[0_32px_90px_-40px_rgb(0_0_0/0.9)]"
        >
          <div className="flex items-center justify-between border-b border-silver/10 px-4 py-3">
            <span className="font-display text-[0.62rem] font-medium tracking-[0.2em] text-silver-dim uppercase">
              System architecture
            </span>
            <span className="flex items-center gap-2 text-[0.7rem] text-silver-dim">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-blue" />
              Єдина логіка
            </span>
          </div>
          <HeroScene className="h-auto w-full" />
        </div>
      </div>
    </section>
  );
}
