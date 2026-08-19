import Link from "next/link";
import Reveal from "./Reveal";
import { site } from "@/config/site";

/**
 * Компактний перехід на сторінку «Для бізнесу» після секції рішень.
 */
export default function BusinessCallout() {
  return (
    <section aria-labelledby="business-callout-title" className="relative">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="blueprint-grid relative overflow-hidden rounded-card border border-silver/12 bg-navy-deep/60 px-6 py-10 sm:px-10 sm:py-12">
            <div
              aria-hidden="true"
              className="absolute top-0 right-0 -z-0 size-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-blue/[0.08] blur-3xl"
            />
            <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
              <div className="max-w-2xl">
                <p className="flex items-center gap-3 text-[0.76rem] font-semibold tracking-[0.18em] text-blue uppercase">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-gold" />
                  Для бізнесу
                </p>
                <h2
                  id="business-callout-title"
                  className="mt-4 text-balance text-2xl leading-[1.12] font-bold tracking-tight text-silver sm:text-3xl"
                >
                  Рішення для бізнесу
                </h2>
                <p className="mt-4 text-base leading-relaxed text-silver-dim">
                  Електрика та інженерні системи для кавʼярень, магазинів,
                  офісів, шоурумів та інших комерційних просторів.
                </p>
              </div>
              <Link
                href={site.businessPage.href}
                className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 self-start rounded-button bg-blue px-8 py-4 text-base font-semibold text-navy-deep transition-[background-color,box-shadow] duration-200 hover:bg-blue-soft hover:shadow-glow-blue lg:self-auto"
              >
                Переглянути рішення
                <svg
                  viewBox="0 0 20 20"
                  className="size-4"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 10h12m-5-5 5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
