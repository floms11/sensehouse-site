import type { Metadata } from "next";
import Link from "next/link";
import CTAButton from "@/components/CTAButton";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Reveal from "@/components/Reveal";
import { site } from "@/config/site";
import { createBusinessStructuredData } from "@/lib/structured-data";

const title = "Інженерні системи для бізнесу у Кропивницькому | Sense House";
const description =
  "Електрика, освітлення, резервне живлення, мережа, відеоспостереження, контроль доступу й автоматизація для кавʼярень, магазинів, офісів, клінік та інших комерційних просторів у Кропивницькому та області.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/dlia-biznesu" },
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: "/dlia-biznesu",
    siteName: site.name,
    title,
    description,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `Інженерні системи для бізнесу — ${site.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/opengraph-image"],
  },
};

const spaces = [
  {
    title: "Кавʼярні, ресторани та пекарні",
    text: "Кухонне обладнання, освітлення залу, каса й музика — з розподілом навантажень і резервом для роботи під час відключень.",
  },
  {
    title: "Магазини та шоуруми",
    text: "Освітлення вітрин і торгової зони, каси, камери й мережа, спроєктовані для стабільної щоденної роботи закладу.",
  },
  {
    title: "Офіси й коворкінги",
    text: "Робочі місця, переговорні, мережа та Wi‑Fi, контроль доступу й безперебійна робота критичного обладнання.",
  },
  {
    title: "Клініки, стоматології та салони",
    text: "Живлення обладнання за групами, освітлення кабінетів і резерв для критичних приладів — склад узгоджується під специфіку закладу.",
  },
  {
    title: "Склади, майстерні й невеликі виробництва",
    text: "Силові лінії під обладнання, освітлення робочих зон, відеоспостереження та контроль доступу до приміщень.",
  },
  {
    title: "Готелі, апартаменти та заклади гостинності",
    text: "Електрика й мережа для номерів і спільних просторів, автоматизація та контроль систем на всьому обʼєкті.",
  },
  {
    title: "Навчальні та спортивні студії",
    text: "Освітлення залів, музика, мережа та Wi‑Fi, відеоспостереження й керований доступ для груп і персоналу.",
  },
];

const directions = [
  {
    title: "Розподіл живлення та електрощити",
    text: "Навантаження розподіляються за групами із захистом і маркуванням, щоб локальна несправність якомога менше впливала на роботу закладу.",
  },
  {
    title: "Внутрішня електрика",
    text: "Кабельні лінії, розетки та підключення обладнання за проєктом, з фіксацією прихованих робіт.",
  },
  {
    title: "Освітлення",
    text: "Робоче, акцентне та чергове освітлення під задачі простору — від зали для гостей до складу.",
  },
  {
    title: "Резервне живлення",
    text: "Критичні групи, автоматичне перемикання й інтеграція джерела резерву, щоб бізнес працював під час перебоїв.",
  },
  {
    title: "Дротова мережа та Wi‑Fi",
    text: "Стабільна інфраструктура для кас, терміналів, робочих місць і гостьового доступу.",
  },
  {
    title: "Відеоспостереження",
    text: "Камери в ключових зонах, локальний запис і впорядкований віддалений доступ для власника.",
  },
  {
    title: "Контроль доступу",
    text: "Керований доступ до службових приміщень, складів і технічних зон обʼєкта.",
  },
  {
    title: "Інтеграція кліматичного обладнання",
    text: "Живлення й керування кондиціонуванням та іншим кліматичним обладнанням узгоджуються із загальною системою.",
  },
  {
    title: "Автоматизація",
    text: "Сценарії відкриття й закриття закладу, керування світлом і кліматом, контроль стану систем з телефона.",
  },
  {
    title: "Технічна документація",
    text: "Схеми, кабельний журнал і маркування — обʼєкт можна обслуговувати без «памʼяті майстра».",
  },
];

export default function BusinessPage() {
  const jsonLd = createBusinessStructuredData();

  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <article>
          <section
            aria-labelledby="business-title"
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
                  <li aria-current="page">Для бізнесу</li>
                </ol>
              </nav>

              <div className="mt-12 max-w-4xl">
                <p className="text-[0.76rem] font-semibold tracking-[0.18em] text-blue uppercase">
                  Для бізнесу · {site.geo.primary}
                </p>
                <h1
                  id="business-title"
                  className="mt-5 text-balance text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.03] font-bold tracking-[-0.04em] text-silver"
                >
                  Інженерні системи для бізнесу
                </h1>
                <p className="mt-7 max-w-3xl text-base leading-relaxed text-silver-dim sm:text-lg">
                  Проєктуємо та реалізуємо електрику, освітлення, резервне
                  живлення, мережу, безпеку й автоматизацію для комерційних
                  просторів у Кропивницькому та області. Беремо на себе весь
                  комплекс або окремий етап — із технічною документацією, за
                  якою обʼєкт можна обслуговувати й розвивати.
                </p>
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <CTAButton
                  href="#contact"
                  size="lg"
                  event="hero_cta_click"
                  eventParams={{ placement: "business_hero" }}
                >
                  Проконсультуватися
                </CTAButton>
                <CTAButton
                  href={`tel:${site.phone.e164}`}
                  variant="ghost"
                  size="lg"
                  event="phone_click"
                  eventParams={{ placement: "business_hero" }}
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
            aria-labelledby="business-spaces-title"
            className="relative py-24 sm:py-32"
          >
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
              <Reveal className="max-w-3xl">
                <p className="text-[0.76rem] font-semibold tracking-[0.18em] text-blue uppercase">
                  Обʼєкти
                </p>
                <h2
                  id="business-spaces-title"
                  className="mt-4 text-balance text-3xl leading-[1.12] font-bold tracking-tight text-silver sm:text-4xl"
                >
                  З якими просторами працюємо
                </h2>
                <p className="mt-5 text-base leading-relaxed text-silver-dim sm:text-lg">
                  Кожен тип закладу має власні вимоги до живлення, освітлення
                  та безпеки. Склад систем визначається під конкретний простір
                  і спосіб його роботи.
                </p>
              </Reveal>

              <div className="mt-14 grid gap-px overflow-hidden rounded-card border border-silver/10 bg-silver/10 sm:grid-cols-2 lg:grid-cols-3">
                {spaces.map((space, index) => (
                  <Reveal
                    key={space.title}
                    delay={(index % 3) * 70}
                    className="bg-navy-deep p-7 sm:p-8"
                  >
                    <h3 className="text-lg font-bold tracking-tight text-silver">
                      {space.title}
                    </h3>
                    <p className="mt-3 text-[0.94rem] leading-relaxed text-silver-dim">
                      {space.text}
                    </p>
                  </Reveal>
                ))}
                <Reveal
                  delay={70}
                  className="flex items-center bg-navy-deep p-7 sm:p-8"
                >
                  <p className="text-[0.94rem] leading-relaxed text-silver-dim">
                    Ваш формат не в переліку? Опишіть простір і задачі —
                    визначимо, чи зможемо допомогти, і з чого варто почати.
                  </p>
                </Reveal>
              </div>
            </div>
          </section>

          <section
            aria-labelledby="business-directions-title"
            className="relative overflow-hidden bg-navy-deep/55 py-24 sm:py-32"
          >
            <div
              aria-hidden="true"
              className="blueprint-grid absolute inset-0 opacity-50"
            />
            <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
              <Reveal className="max-w-3xl">
                <p className="text-[0.76rem] font-semibold tracking-[0.18em] text-blue uppercase">
                  Напрями
                </p>
                <h2
                  id="business-directions-title"
                  className="mt-4 text-balance text-3xl leading-[1.12] font-bold tracking-tight text-silver sm:text-4xl"
                >
                  Що беремо на себе на комерційному обʼєкті
                </h2>
                <p className="mt-5 text-base leading-relaxed text-silver-dim sm:text-lg">
                  Системи проєктуються узгоджено: щити враховують резерв,
                  мережа — камери й каси, а автоматизація — реальні процеси
                  закладу.
                </p>
              </Reveal>

              <ol className="mt-14 grid border-y border-silver/10 md:grid-cols-2">
                {directions.map((direction, index) => (
                  <Reveal
                    as="li"
                    key={direction.title}
                    delay={(index % 2) * 70}
                    className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4 border-b border-silver/10 py-7 md:odd:border-r md:odd:pr-8 md:even:pl-8 md:[&:nth-last-child(-n+2)]:border-b-0"
                  >
                    <span className="font-display text-xs font-semibold tracking-[0.16em] text-blue">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold tracking-tight text-silver">
                        {direction.title}
                      </h3>
                      <p className="mt-3 text-[0.94rem] leading-relaxed text-silver-dim">
                        {direction.text}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </ol>

              <Reveal className="mt-10 border-l border-gold/70 pl-5">
                <p className="max-w-3xl text-sm leading-relaxed text-silver-dim">
                  Пожежну сигналізацію, вентиляцію, опалення та інші
                  спеціалізовані системи виконують профільні підрядники. Ми
                  готуємо для них живлення, узгоджуємо технічні рішення та за
                  потреби інтегруємо керування в загальну систему обʼєкта.
                </p>
              </Reveal>
            </div>
          </section>

          <section
            aria-labelledby="business-services-title"
            className="relative py-24 sm:py-32"
          >
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
              <Reveal className="max-w-3xl">
                <p className="text-[0.76rem] font-semibold tracking-[0.18em] text-blue uppercase">
                  Докладніше
                </p>
                <h2
                  id="business-services-title"
                  className="mt-4 text-balance text-3xl leading-[1.12] font-bold tracking-tight text-silver sm:text-4xl"
                >
                  Сторінки послуг за напрямами
                </h2>
              </Reveal>

              <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {site.servicePages.map((service, index) => (
                  <Reveal as="li" key={service.href} delay={(index % 3) * 70}>
                    <Link
                      href={service.href}
                      className="group flex min-h-16 items-center justify-between gap-4 rounded-button border border-silver/15 px-5 py-4 transition-colors hover:border-blue/60"
                    >
                      <span className="font-semibold text-silver transition-colors group-hover:text-blue-soft">
                        {service.label}
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
                  </Reveal>
                ))}
              </ul>
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
