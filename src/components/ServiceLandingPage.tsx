import Link from "next/link";
import type { ServicePage } from "@/lib/service-pages";
import CTAButton from "./CTAButton";
import Footer from "./Footer";
import Header from "./Header";
import Reveal from "./Reveal";
import { site } from "@/config/site";
import { createServiceStructuredData } from "@/lib/structured-data";

export default function ServiceLandingPage({ page }: { page: ServicePage }) {
  const jsonLd = createServiceStructuredData(page);

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
                  href="/#contact"
                  size="lg"
                  event="hero_cta_click"
                  eventParams={{ placement: `service_${page.slug}` }}
                >
                  Обговорити обʼєкт
                </CTAButton>
                <CTAButton href={`tel:${site.phone.e164}`} variant="ghost" size="lg">
                  {site.phone.display}
                </CTAButton>
              </div>
            </div>
          </section>

          <section
            aria-labelledby="service-scope-title"
            className="relative py-24 sm:py-32"
          >
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
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
            aria-labelledby="service-approach-title"
            className="blueprint-grid--light blueprint-grid relative bg-silver py-24 text-navy sm:py-32"
          >
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
              <div className="grid gap-12 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] lg:gap-20">
                <Reveal>
                  <p className="text-[0.76rem] font-semibold tracking-[0.18em] text-navy/60 uppercase">
                    Підхід
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

              <Reveal className="mt-16 flex flex-col gap-6 border-t border-silver/10 pt-10 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-silver">
                    Обговорімо ваш будинок і майбутні системи
                  </h2>
                  <p className="mt-2 max-w-2xl leading-relaxed text-silver-dim">
                    Коротко опишіть обʼєкт, етап робіт і бажаний результат.
                    Визначимо, які вихідні дані потрібні та з чого варто почати.
                  </p>
                </div>
                <CTAButton href="/#contact" size="lg">
                  Залишити заявку
                </CTAButton>
              </Reveal>

            </div>
          </section>
        </article>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
