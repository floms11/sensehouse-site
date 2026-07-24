import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Політика конфіденційності | Sense House",
  description:
    "Як Sense House отримує, використовує та захищає дані, надіслані через сайт.",
  alternates: { canonical: "/privacy" },
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1 bg-navy pt-28 pb-20 sm:pt-36 sm:pb-28">
        <article className="mx-auto max-w-3xl px-5 sm:px-8">
          <p className="font-display text-[0.75rem] font-medium tracking-[0.2em] text-blue uppercase">
            Sense House
          </p>
          <h1 className="mt-4 text-balance text-4xl leading-tight font-bold tracking-tight text-silver sm:text-5xl">
            Політика конфіденційності
          </h1>
          <p className="mt-5 text-sm text-silver-dim">
            Останнє оновлення: 25 липня 2026 року
          </p>

          <div className="mt-12 space-y-10 text-base leading-relaxed text-silver-dim">
            <section aria-labelledby="privacy-owner">
              <h2 id="privacy-owner" className="text-xl font-bold text-silver">
                Хто обробляє дані
              </h2>
              <p className="mt-3">
                Дані, надіслані через sense-house.com, обробляє Sense House
                для комунікації щодо електрики та інженерних систем. Звʼязатися
                з нами можна за телефоном{" "}
                <a className="font-semibold text-blue-soft" href={`tel:${site.phone.e164}`}>
                  {site.phone.display}
                </a>{" "}
                або через{" "}
                <a
                  className="font-semibold text-blue-soft"
                  href={site.social.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Telegram
                </a>
                .
              </p>
            </section>

            <section aria-labelledby="privacy-data">
              <h2 id="privacy-data" className="text-xl font-bold text-silver">
                Які дані ми отримуємо
              </h2>
              <p className="mt-3">
                Через форму можна передати імʼя, номер телефону або Telegram,
                опис обʼєкта, а також необовʼязково площу й етап будівництва.
                Технічні журнали сервера можуть містити IP-адресу та дані про
                запит, потрібні для безпеки й захисту від спаму.
              </p>
            </section>

            <section aria-labelledby="privacy-purpose">
              <h2 id="privacy-purpose" className="text-xl font-bold text-silver">
                Для чого використовуються дані
              </h2>
              <p className="mt-3">
                Дані використовуються, щоб відповісти на запит, уточнити
                вихідні дані обʼєкта, підготуватися до консультації та
                захистити форму від зловживань. Ми не використовуємо дані з
                форми для сторонніх розсилок.
              </p>
            </section>

            <section aria-labelledby="privacy-transfer">
              <h2 id="privacy-transfer" className="text-xl font-bold text-silver">
                Передача та зберігання
              </h2>
              <p className="mt-3">
                Заявка може передаватися до налаштованої системи обліку,
                захищеного webhook-сервісу або Telegram-бота, які допомагають
                її опрацювати. Доступ мають лише особи та постачальники,
                залучені до обробки запиту. Дані зберігаються не довше, ніж це
                потрібно для комунікації, виконання домовленостей і законних
                обовʼязків.
              </p>
            </section>

            <section aria-labelledby="privacy-analytics">
              <h2 id="privacy-analytics" className="text-xl font-bold text-silver">
                Аналітика
              </h2>
              <p className="mt-3">
                Сайт підключає аналітичні сервіси лише якщо вони налаштовані
                власником сайту. Такі сервіси можуть використовувати технічні
                ідентифікатори та cookie відповідно до власних політик.
              </p>
            </section>

            <section aria-labelledby="privacy-rights">
              <h2 id="privacy-rights" className="text-xl font-bold text-silver">
                Ваші права
              </h2>
              <p className="mt-3">
                Ви можете попросити уточнити, виправити або видалити надані
                дані, а також відкликати згоду на їх подальшу обробку, якщо
                інша законна підстава для зберігання відсутня. Для цього
                зверніться за контактами вище.
              </p>
            </section>

            <section aria-labelledby="privacy-law">
              <h2 id="privacy-law" className="text-xl font-bold text-silver">
                Правова основа
              </h2>
              <p className="mt-3">
                Обробка даних здійснюється для відповіді на добровільно
                надісланий запит і відповідно до вимог{" "}
                <a
                  href="https://zakon.rada.gov.ua/laws/show/2297-17"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-soft underline decoration-blue/35 underline-offset-4"
                >
                  Закону України «Про захист персональних даних»
                </a>
                .
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
