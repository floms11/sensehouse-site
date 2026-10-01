import Link from "next/link";
import type { ReactNode } from "react";
import type { ServicePage } from "@/lib/service-pages";
import { getServicePage } from "@/lib/service-pages";
import CTAButton from "./CTAButton";
import FinalCTA from "./FinalCTA";
import Footer from "./Footer";
import Header from "./Header";
import Reveal from "./Reveal";
import { site } from "@/config/site";
import { createServiceStructuredData } from "@/lib/structured-data";

type ServiceLandingPageProps = {
  page: ServicePage;
  /**
   * Додатковий блок (наприклад, сценарії на сторінці розумного дому),
   * що розміщується після пояснення підходу та перед відповідями.
   */
  extraSection?: ReactNode;
};

export default function ServiceLandingPage({
  page,
  extraSection,
}: ServiceLandingPageProps) {
  const jsonLd = createServiceStructuredData(page);
  const relatedPages = page.related
    .map((slug) => getServicePage(slug))
    .filter((related): related is ServicePage => Boolean(related));

  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <article>
          <section
            aria-labelledby="service-title"
            className="blueprint-grid relative isolate overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28"
          >
            <div
              aria-hidden="true"
              className="absolute top-16 right-[-12rem] -z-10 size-[32rem] rounded-full bg-blue/[0.07] blur-3xl"
            />
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
              <nav aria-label="Навігаційний ланцюжок">
                <ol className="flex flex-wrap items-center gap-2 text-sm text-silver-dim">
                  <li>
                    <Link
                      href="/"
                      className="inline-flex min-h-11 items-center transition-colors hover:text-blue-soft"
                    >
                      Головна
                    </Link>
                  </li>
                  <li aria-hidden="true" className="text-silver-dim/50">
                    /
                  </li>
                  <li aria-current="page">{page.title}</li>
                </ol>
              </nav>

              <div className="mt-12 max-w-4xl">
                <p className="text-[0.76rem] font-semibold tracking-[0.18em] text-blue uppercase">
                  {page.eyebrow}
                </p>
                <h1
                  id="service-title"
                  className="mt-5 text-balance text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.03] font-bold tracking-[-0.04em] text-silver"
                >
                  {page.title}
                </h1>
                <p className="mt-7 max-w-3xl text-base leading-relaxed text-silver-dim sm:text-lg">
                  {page.intro}
                </p>
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <CTAButton
                  href="#contact"
                  size="lg"
                  event="hero_cta_click"
                  eventParams={{ placement: `service_${page.slug}` }}
                >
                  Проконсультуватися
                </CTAButton>
                <CTAButton
                  href={`tel:${site.phone.e164}`}
                  variant="ghost"
                  size="lg"
                  event="phone_click"
                  eventParams={{ placement: `service_${page.slug}` }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="size-5"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Зателефонувати
                </CTAButton>
              </div>
            </div>
          </section>

          <section
            aria-labelledby="service-fit-title"
            className="relative py-24 sm:py-32"
          >
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
              <Reveal className="max-w-3xl">
                <p className="text-[0.76rem] font-semibold tracking-[0.18em] text-blue uppercase">
                  Кому підходить
                </p>
                <h2
                  id="service-fit-title"
                  className="mt-4 text-balance text-3xl leading-[1.12] font-bold tracking-tight text-silver sm:text-4xl"
                >
                  {page.fitTitle}
                </h2>
                <p className="mt-5 text-base leading-relaxed text-silver-dim sm:text-lg">
                  {page.fitDescription}
                </p>
              </Reveal>

              <div className="mt-14 grid gap-px overflow-hidden rounded-card border border-silver/10 bg-silver/10 sm:grid-cols-2">
                {page.fit.map((item, index) => (
                  <Reveal
                    key={item.title}
                    delay={(index % 2) * 70}
                    className="bg-navy-deep p-7 sm:p-8"
                  >
                    <h3 className="text-lg font-bold tracking-tight text-silver">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-[0.94rem] leading-relaxed text-silver-dim">
                      {item.text}
                    </p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <section
            aria-labelledby="service-scope-title"
            className="relative overflow-hidden bg-navy-deep/55 py-24 sm:py-32"
          >
            <div
              aria-hidden="true"
              className="blueprint-grid absolute inset-0 opacity-50"
            />
            <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
              <Reveal className="max-w-3xl">
                <p className="text-[0.76rem] font-semibold tracking-[0.18em] text-blue uppercase">
                  Склад рішення
                </p>
                <h2
                  id="service-scope-title"
                  className="mt-4 text-balance text-3xl leading-[1.12] font-bold tracking-tight text-silver sm:text-4xl"
                >
                  {page.scopeTitle}
                </h2>
                <p className="mt-5 text-base leading-relaxed text-silver-dim sm:text-lg">
                  {page.scopeDescription}
                </p>
              </Reveal>

              <ol className="mt-14 grid border-y border-silver/10 md:grid-cols-2">
                {page.scope.map((item, index) => (
                  <Reveal
                    as="li"
                    key={item.title}
                    delay={(index % 2) * 70}
                    className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4 border-b border-silver/10 py-7 md:odd:border-r md:odd:pr-8 md:even:pl-8 md:[&:nth-last-child(-n+2)]:border-b-0"
                  >
                    <span className="font-display text-xs font-semibold tracking-[0.16em] text-blue">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold tracking-tight text-silver">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-[0.94rem] leading-relaxed text-silver-dim">
                        {item.text}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </div>
          </section>

          <section
            aria-labelledby="service-outcomes-title"
            className="blueprint-grid--light blueprint-grid relative bg-silver py-24 text-navy sm:py-32"
          >
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
              <Reveal className="max-w-2xl">
                <p className="text-[0.76rem] font-semibold tracking-[0.18em] text-navy/60 uppercase">
                  Результат
                </p>
                <h2
                  id="service-outcomes-title"
                  className="mt-4 text-balance text-3xl leading-[1.12] font-bold tracking-tight text-navy sm:text-4xl"
                >
                  Що ви отримуєте в результаті
                </h2>
              </Reveal>

              <div className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
                {page.outcomes.map((item, index) => (
                  <Reveal
                    key={item.title}
                    delay={(index % 2) * 70}
                    className="border-l border-blue/50 pl-5"
                  >
                    <h3 className="text-lg font-bold tracking-tight text-navy">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[0.94rem] leading-relaxed text-navy/68">
                      {item.text}
                    </p>
                  </Reveal>
                ))}
              </div>

              <div className="mt-20 grid gap-12 border-t border-navy/12 pt-16 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] lg:gap-20">
                <Reveal>
                  <p className="text-[0.76rem] font-semibold tracking-[0.18em] text-navy/60 uppercase">
                    Як проходить робота
                  </p>
                  <h2
                    id="service-approach-title"
                    className="mt-4 text-balance text-3xl leading-[1.12] font-bold tracking-tight text-navy sm:text-4xl"
                  >
                    {page.approachTitle}
                  </h2>
                  <p className="mt-5 text-base leading-relaxed text-navy/70 sm:text-lg">
                    {page.approachDescription}
                  </p>
                </Reveal>

                <ol className="divide-y divide-navy/12 border-y border-navy/12">
                  {page.approach.map((item, index) => (
                    <Reveal
                      as="li"
                      key={item.title}
                      delay={index * 70}
                      className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-5 py-7"
                    >
                      <span className="font-display text-xs font-semibold tracking-[0.16em] text-blue">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="text-lg font-bold text-navy">{item.title}</h3>
                        <p className="mt-2 text-[0.94rem] leading-relaxed text-navy/68">
                          {item.text}
                        </p>
                      </div>
                    </Reveal>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          {extraSection}

          <section
            aria-labelledby="service-answers-title"
            className="relative py-24 sm:py-32"
          >
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
              <Reveal className="max-w-2xl">
                <p className="text-[0.76rem] font-semibold tracking-[0.18em] text-blue uppercase">
                  Перед початком
                </p>
                <h2
                  id="service-answers-title"
                  className="mt-4 text-balance text-3xl leading-[1.12] font-bold tracking-tight text-silver sm:text-4xl"
                >
                  Відповіді перед початком робіт
                </h2>
              </Reveal>

              <div className="mt-14 grid gap-px overflow-hidden rounded-card border border-silver/10 bg-silver/10 lg:grid-cols-3">
                {page.answers.map((item, index) => (
                  <Reveal
                    key={item.title}
                    delay={index * 70}
                    className="bg-navy-deep p-7 sm:p-8"
                  >
                    <h3 className="text-lg font-bold tracking-tight text-silver">
                      {item.title}
                    </h3>
                    <p className="mt-4 text-[0.94rem] leading-relaxed text-silver-dim">
                      {item.text}
                    </p>
                  </Reveal>
                ))}
              </div>

              {relatedPages.length > 0 && (
                <Reveal className="mt-16 border-t border-silver/10 pt-10">
                  <h2 className="text-[0.76rem] font-semibold tracking-[0.18em] text-blue uppercase">
                    Суміжні послуги
                  </h2>
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {relatedPages.map((related) => (
                      <li key={related.slug}>
                        <Link
                          href={`/posluhy/${related.slug}`}
                          className="group flex min-h-14 items-center justify-between gap-4 rounded-button border border-silver/15 px-5 py-4 transition-colors hover:border-blue/60"
                        >
                          <span className="font-semibold text-silver transition-colors group-hover:text-blue-soft">
                            {related.eyebrow}
                          </span>
                          <svg
                            viewBox="0 0 20 20"
                            className="size-4 shrink-0 text-blue transition-transform duration-200 group-hover:translate-x-1"
                            fill="none"
                            aria-hidden="true"
                          >
                            <path
                              d="M4 10h12m-5-5 5 5-5 5"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}
            </div>
          </section>
        </article>

        <FinalCTA />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
